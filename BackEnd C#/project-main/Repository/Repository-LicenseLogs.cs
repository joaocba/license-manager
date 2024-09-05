using project_main.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;

namespace project_main.Repository
{
    public class LicenseLogsRepository : ILicenseLogsRepository
    {
        private readonly project_mainContext _context;

        public LicenseLogsRepository(project_mainContext context)
        {
            _context = context;
        }

        public List<object> GetAll()
        {
            var licenseLogs = (from l in _context.LicenseLogs
                               join u in _context.Users on l.FkUser equals u.IdUser
                               select new
                               {
                                   Id = l.Id,
                                   ActionTypeId = l.FkActionTypeNavigation.Id,
                                   ActionTypeName = l.FkActionTypeNavigation.ActionType,
                                   ActionTypeDescription = l.FkActionTypeNavigation.Description,
                                   IdUser = l.FkUserNavigation.IdUser,
                                   Name = l.FkUserNavigation.Name,
                                   FkClient = l.FkClient,
                                   LogDatetime = l.LogDatetime,
                               }).ToList();

            return licenseLogs.Cast<object>().ToList();
        }

        public void Create(LicenseLog licenseLog)
        {
            _context.LicenseLogs.Add(licenseLog);
            _context.SaveChanges();
        }

        public void Update(LicenseLog licenseLog)
        {
            _context.LicenseLogs.Update(licenseLog);
            _context.SaveChanges();
        }

        public List<object> GetByClientId(Guid clientId)
        {
            var licenseLogs = _context.LicenseLogs
                .Where(l => l.FkClient == clientId)
                .OrderByDescending(l => l.LogDatetime)
                .Select(l => new
                {
                    Id = l.Id,
                    ActionTypeId = l.FkActionTypeNavigation.Id,
                    ActionTypeName = l.FkActionTypeNavigation.ActionType,
                    ActionTypeDescription = l.FkActionTypeNavigation.Description,
                    IdUser = l.FkUserNavigation != null ? (Guid?)l.FkUserNavigation.IdUser : null,
                    Name = l.FkUserNavigation != null ? l.FkUserNavigation.Name : null,
                    FkClient = l.FkClient,
                    LogDatetime = l.LogDatetime,
                    LogMessage = l.LogMessage,
                }).ToList();

            return licenseLogs.Cast<object>().ToList();
        }
    }
}
