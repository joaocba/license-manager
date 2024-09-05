using Microsoft.AspNetCore.Identity;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using project_main.Helper;
using project_main.Models;
using project_main.ViewModel;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;

namespace project_main.Repository
{
    public class UserRepository : IUserRepository
    {
        private readonly project_mainContext _context;
        private readonly string _jwtSecret;

        public UserRepository(project_mainContext context, string jwtSecret)
        {
            _context = context;
            _jwtSecret = jwtSecret;

        }

        public List<User> GetAll()
        {
            using (var context = new project_mainContext())
            {
                var users = (from u in context.Users
                             select new User
                             {
                                 IdUser = u.IdUser,
                                 Name = u.Name,
                                 Password = u.Password,
                                 Email = u.Email,
                                 PhoneNumber = u.PhoneNumber,
                                 InsertDate = u.InsertDate,
                                 Status = u.Status,
                                 FkClient = u.FkClient,
                                 FkRole = u.FkRole,
                                 Token = u.Token,
                                 PasswordRecoveryToken = u.PasswordRecoveryToken,
                                 PasswordRecoveryTokenExpires = u.PasswordRecoveryTokenExpires,
                                 Address = u.Address,
                                 Country = u.Country,
                                 FkLicense = u.FkLicense,
                                 FkProfilePicture = u.FkProfilePicture
                             }).ToList();

                return users;
            }
        }

        public void Create(UserViewModel user)
        {
            PasswordHash passwordHash = new PasswordHash();
            // Hash the password before storing it
            user.User.Password = passwordHash.HashPassword(user.User.Password);

            // Creates the user validation token
            var token = GenerateToken(user.User);
            user.User.VerificationToken = token; // Store token in user object

            using (var context = new project_mainContext())
            {
                context.Users.Add(user.User);
                context.SaveChanges();
            }
        }

        public bool EmailExists(string email)
        {
            using (var context = new project_mainContext())
            {
                return context.Users.Where(u => u.Email == email).Any();
            }

        }

        //public User GetUserByEmail(string email)
        //{
        //    using (var context = new project_mainContext())
        //    {
        //        return context.Users.Where(u => u.Email == email).FirstOrDefault();
        //    }
        //}

        public User GetUserByEmail(string email)
        {
            using (var context = new project_mainContext())
            {
                return context.Users
                              .Include(u => u.FkRoleNavigation) // Include role data
                              .Include(u => u.FkClientNavigation) // Include client data
                              .Include(u => u.FkLicensesNavigation)
                              .Include(u => u.FkProfilePictureNavigation)
                              .FirstOrDefault(u => u.Email == email);
            }
        }

        public User GetUserByVerificationToken(string token)
        {
            using (var context = new project_mainContext())
            {
                return context.Users.Where(u => u.VerificationToken == token).DefaultIfEmpty().FirstOrDefault();
            }
        }

        public void updateUser(User user)
        {
            using (var context = new project_mainContext())
            {
                context.Users.Update(user);
                context.SaveChanges();
            }
        }

        public string GenerateToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_jwtSecret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.IdUser.ToString() ?? string.Empty),
                    new Claim(ClaimTypes.Name, user.Name ?? string.Empty),
                    new Claim(ClaimTypes.Email, user.Email ?? string.Empty),
                    new Claim(ClaimTypes.MobilePhone, user.PhoneNumber),
                    new Claim("InsertDate", user.InsertDate?.ToString("o") ?? string.Empty),
                    new Claim("Status", user.Status ?? string.Empty),
                    new Claim(ClaimTypes.Role, user.FkRole.ToString() ?? string.Empty),
                    new Claim("FkClient", user.FkClient.ToString() ?? string.Empty),
                    new Claim("FkLicense", user.FkLicense.ToString() ?? string.Empty),
                    // Add more claims as needed
                }),
                Expires = DateTime.UtcNow.AddHours(1), // Token expiration time
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        public User CheckUsers(User user)
        {
            using (var context = new project_mainContext())
            {
                var person = context.Users.FirstOrDefault(u => u.Email == user.Email);

                if (person != null)
                {
                    PasswordHash passwordHash = new PasswordHash();
                    bool isPasswordCorrect = passwordHash.VerifyPassword(user.Password, person.Password);

                    var token = GenerateToken(person);
                    person.Token = token; // Store token in user object
                    context.SaveChanges();

                    if (isPasswordCorrect)
                    {
                        return person;
                    }
                }

                return null;
            }
        }

        public void Update(User user)
        {
            using (var context = new project_mainContext())
            {
                context.Users.Update(user);
                context.SaveChanges();
            }
        }
    }
}
