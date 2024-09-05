using project_main.Models;

namespace project_main.Repository
{
    public interface ILicenseStatusRepository
    {
        public List<LicenseStatus> GetAll();
    }
}
