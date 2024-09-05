namespace project_main.Repository
{
    public interface ILicenseLogsRepository
    {
        public List<object> GetAll();
        public void Create(LicenseLog licenseLog);
        public void Update(LicenseLog licenseLog);
        public List<object> GetByClientId(Guid clientId);
    }
}
