using project_main.Models;
using project_main.Repository;

namespace project_main.Service
{
    public class LicenseLogsService : ILicenseLogsService
    {
        private ILicenseLogsRepository _licenseLogsRepository;

        public LicenseLogsService(ILicenseLogsRepository licenseLogsRepository)
        {
            _licenseLogsRepository = licenseLogsRepository;
        }

        public List<object> GetAll()
        {
            return _licenseLogsRepository.GetAll();
        }

        public void Create(LicenseLog licenseLog)
        {
            _licenseLogsRepository.Create(licenseLog);
        }

        public void Update(LicenseLog licenseLog)
        {
            _licenseLogsRepository.Update(licenseLog);
        }

        public List<object> GetByClientId(Guid clientId)
        {
            return _licenseLogsRepository.GetByClientId(clientId);
        }
    }
}