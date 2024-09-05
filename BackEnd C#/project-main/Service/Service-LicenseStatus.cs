using project_main.Models;
using project_main.Repository;

namespace project_main.Service
{
    public class LicenseStatusService : ILicenseStatusService
    {
        private ILicenseStatusRepository _licenseStatusRepository;

        public LicenseStatusService(ILicenseStatusRepository licenseStatusRepository)
        {
            _licenseStatusRepository = licenseStatusRepository;
        }

        public List<LicenseStatus> GetAll()
        {
            return _licenseStatusRepository.GetAll();
        }
    }
}
