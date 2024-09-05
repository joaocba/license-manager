using project_main.Models;

namespace project_main.Service
{
    public interface ILicenseLogsService
    {
        public List<object> GetAll();
        public void Create(LicenseLog licenseLog);
        public void Update(LicenseLog licenseLog);
        public List<object> GetByClientId(Guid clientId);
    }
}
