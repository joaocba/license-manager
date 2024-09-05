using project_main.Models;

namespace project_main.Service
{
    public interface ILicenseStatusService
    {
        public List<LicenseStatus> GetAll();
    }
}
