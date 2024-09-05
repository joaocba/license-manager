using MailKit.Security;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using MimeKit;
using MailKit.Net.Smtp;
using MailKit;
using project_main.Helper;
using project_main.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data.SqlClient;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Reflection.Metadata.Ecma335;
using System.Security.Claims;
using System.Text;
using System.Web;

namespace project_main.Repository
{
    public class LicensesRepository : ILicensesRepository
    {
        private readonly project_mainContext _context;

        public LicensesRepository(project_mainContext context)
        {
            _context = context;
        }

        public List<License> GetAll()
        {
            using (var context = new project_mainContext())
            {
                var licenses = (from l in context.Licenses
                                select new License
                                {
                                    IdLicenses = l.IdLicenses,
                                    FkIdPackage = l.FkIdPackage,
                                    FkIdClient = l.FkIdClient,
                                    FkStatus = l.FkStatus,
                                    StartDate = l.StartDate,
                                    FinishDate = l.FinishDate,
                                    FkIdUser = l.FkIdUser
                                }).ToList();

                return licenses;
            }
        }
        public void Create(License license)
        {
            using (var context = new project_mainContext())
            {
                context.Licenses.Add(license);
                context.SaveChanges();
            }
        }

        public void Delete(License license)
        {
            using (var context = new project_mainContext())
            {
                context.Licenses.Remove(license);
                context.SaveChanges();
            }
        }

        public void Update(License license)
        {
            using (var context = new project_mainContext())
            {
                context.Licenses.Update(license);
                context.SaveChanges();
            }
        }

        public void UpdateLicenseStatus(Guid idLicense, int status)
        {
            using (var context = new project_mainContext())
            {
                var license = context.Licenses.FirstOrDefault(l => l.IdLicenses == idLicense);
                if (license != null)
                {
                    license.FkStatus = status;
                    context.SaveChanges();
                }
            }
        }

        public License GetLicenseById(Guid idLicense)
        {
            using (var context = new project_mainContext())
            {
                return context.Licenses.FirstOrDefault(u => u.IdLicenses == idLicense);
            }
        }

        public List<License> GetAllByClientId(Guid clientId)
        {
            using (var context = new project_mainContext())
            {
                var licenses = context.Licenses
                                      .Include(l => l.Package)
                                      .ThenInclude(p => p.FkPackageParentNavigation) // Include the PackageParent
                                      .Include(l => l.LicenseStatus)
                                      .Include(l => l.FkUserNavigation)
                                      .Where(l => l.FkIdClient == clientId)
                                      .OrderBy(l => l.FinishDate) // Order by FinishDate, ascending
                                      .Select(l => new License
                                      {
                                          IdLicenses = l.IdLicenses,
                                          FkIdPackage = l.FkIdPackage,
                                          FkIdClient = l.FkIdClient,
                                          FkStatus = l.FkStatus,
                                          StartDate = l.StartDate,
                                          FinishDate = l.FinishDate,
                                          Package = l.Package != null ? new Package
                                          {
                                              IdPackage = l.Package.IdPackage,
                                              PackageName = l.Package.PackageName,
                                              FkIdPackageParent = l.Package.FkIdPackageParent,
                                              FkPackageParentNavigation = l.Package.FkPackageParentNavigation != null ? new PackageParent
                                              {
                                                  IdPackageParent = l.Package.FkPackageParentNavigation.IdPackageParent,
                                                  PackageParentName = l.Package.FkPackageParentNavigation.PackageParentName
                                              } : null
                                          } : null,
                                          LicenseStatus = l.LicenseStatus != null ? new LicenseStatus
                                          {
                                              IdLicenseStatus = l.LicenseStatus.IdLicenseStatus,
                                              Status = l.LicenseStatus.Status,
                                              Description = l.LicenseStatus.Description
                                          } : null,
                                          FkUserNavigation = l.FkUserNavigation != null ? new User
                                          {
                                              IdUser = l.FkUserNavigation.IdUser,
                                              Name = l.FkUserNavigation.Name,
                                              Email = l.FkUserNavigation.Email
                                          } : null,
                                          Transaction = l.Transaction != null ? new Transaction
                                          {
                                              IdTransaction = l.Transaction.IdTransaction,
                                              FKSubscriptionType = l.Transaction.FKSubscriptionType
                                          } : null
                                      })
                                      .ToList();

                return licenses;
            }
        }




        public User GetUserById(Guid id)
        {
            using (var context = new project_mainContext())
            {
                return context.Users.Where(u => u.IdUser == id).FirstOrDefault();
            }
        }

        public List<License> GetLicenseHistory(Guid clientId)
        {
            using (var context = new project_mainContext())
            {
                var licenses = (from l in context.Licenses
                                where l.FkIdClient == clientId
                                select new License
                                {
                                    IdLicenses = l.IdLicenses,
                                    FkIdPackage = l.FkIdPackage,
                                    FkIdClient = l.FkIdClient,
                                    FkStatus = l.FkStatus,
                                    StartDate = l.StartDate,
                                    FinishDate = l.FinishDate,
                                    FkIdUser = l.FkIdUser
                                }).ToList();

                return licenses.FindAll(l => l.FkStatus == 2);
            }
        }

        public void SendInvite(string email, Guid idLicense, string userName)
        {
            SmtpConfig smtpConfig = new SmtpConfig();

            //Call values in table 'smtp_config' of DB to the instance
            using (var context = new project_mainContext())
            {
                smtpConfig = context.SmtpConfigs.FirstOrDefault();
            }

            //create a new mime messagem object which we are going to use to fill the message data
            MimeMessage message = new MimeMessage();

            //add sender info that will appear in the email message
            message.From.Add(new MailboxAddress("", smtpConfig.Sendusername));

            //add the receiver email address
            message.To.Add(MailboxAddress.Parse(email));

            //add the message subject from parameters
            message.Subject = "projectApp invite";

            //add the message body as plain text the "plain" string passed to the TextPart indicates that its plain
            message.Body = new TextPart("plain")
            {
                Text = @"You've been invited by " + userName + " to create an user account to join project App, click in the link below to create an account: " + "http://localhost:5173/register/" + HttpUtility.UrlEncode(idLicense.ToString())
            };

            //create a new SMTP client
            SmtpClient client = new SmtpClient();

            try
            {
                //connect to the mail smtp server using port 587
                client.Connect(smtpConfig.Smtpserver, smtpConfig.Smtpserverport, SecureSocketOptions.StartTls);

                client.Authenticate(smtpConfig.Sendusername, smtpConfig.Sendpassword);
                client.Send(message);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
            finally
            {
                client.Disconnect(true);
                client.Dispose();
            }
        }

        public List<License> GetLicensesByUserId(Guid userId)
        {
            using (var context = new project_mainContext())
            {
                return context.Licenses
                              .Where(l => l.FkIdUser == userId)
                              .Select(l => new License
                              {
                                  IdLicenses = l.IdLicenses,
                                  FkIdUser = l.FkIdUser
                              })
                      .ToList();
            }
        }

        public List<object> GetUsersByClientId(Guid clientId)
        {
            using (var context = new project_mainContext())
            {
                return context.Users
                              .Where(u => u.FkClient == clientId)
                              .Select(u => new
                              {
                                  u.IdUser,
                                  u.Name,
                                  u.Status,
                                  u.FkRole,
                                  u.FkClient
                              })
                              .ToList<object>();
            }
        }

        public License GetFirstAvailableLicense(Guid fkClientId, Guid licenseType, int status)
        {
            using (var context = new project_mainContext())
            {
                return context.Licenses
                              .FirstOrDefault(l => l.FkIdClient == fkClientId
                                                   && l.FkIdPackage == licenseType
                                                   && l.FkStatus == status);
            }
        }

        public List<User> GetNonAssignedUsersByClientId(Guid clientId)
        {
            using (var context = new project_mainContext())
            {
                var assignedUserIds = context.Licenses
                                             .Where(l => l.FkIdClient == clientId && l.FkIdUser.HasValue)
                                             .Select(l => l.FkIdUser.Value)
                                             .Distinct()
                                             .ToList();

                var nonAssignedUsers = context.Users
                                              .Where(u => u.FkClient == clientId && !assignedUserIds.Contains(u.IdUser))
                                              .ToList();

                return nonAssignedUsers;
            }
        }

        public List<Client> GetClientsList()
        {
            using (var context = new project_mainContext())
            {
                return context.Clients.ToList();
            }
        }

        public List<License> GetLicensesByClientId(Guid clientId)
        {
            using (var context = new project_mainContext())
            {
                return context.Licenses
                              .Where(l => l.FkIdClient == clientId)
                              .ToList();
            }
        }

        public List<object> GetLicensesDataByClientId(Guid clientId)
        {
            using (var context = new project_mainContext())
            {
                return context.Licenses
                              .Where(l => l.FkIdClient == clientId)
                              .Select(l => new
                              {
                                  Id = l.IdLicenses,
                                  Package = l.FkIdPackage,
                                  PackageName = l.Package.PackageName,
                                  Status = l.FkStatus,
                                  StatusName = l.LicenseStatus.Status,
                                  StartDate = l.StartDate,
                                  FinishDate = l.FinishDate,
                                  IdUser = l.FkUserNavigation != null ? (Guid?)l.FkUserNavigation.IdUser : null,
                                  Name = l.FkUserNavigation != null ? l.FkUserNavigation.Name : null,
                                  Email = l.FkUserNavigation != null ? l.FkUserNavigation.Email : null,
                                  TransactionId = l.Transaction != null ? l.Transaction.IdTransaction : (int?)null,
                                  SubscriptionType = l.Transaction.FKSubscriptionType,
                                  ClientId = l.FkIdClient
                              })
                              .ToList<object>();
            }
        }
    }
}