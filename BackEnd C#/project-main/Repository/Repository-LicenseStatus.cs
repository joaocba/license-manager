using project_main.Models;

namespace project_main.Repository
{
    public class LicenseStatusRepository : ILicenseStatusRepository
    {
        private readonly project_mainContext _context;

        public LicenseStatusRepository(project_mainContext context)
        {
            _context = context;
        }

        public List<LicenseStatus> GetAll()
        {
            using (var context = new project_mainContext())
            {
                var licenseStatus = (from l in context.LicenseStatuses
                                     select new LicenseStatus
                                     {
                                         IdLicenseStatus = l.IdLicenseStatus,
                                         Status = l.Status,
                                         Description = l.Description
                                     }).ToList();

                return licenseStatus;
            }
        }
    }
}
