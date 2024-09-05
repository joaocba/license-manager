using Microsoft.AspNetCore.Mvc;
using project_main.Models;
using project_main.Repository;

namespace project_main.Repository
{
    public interface ILicensesRepository
    {
        public List<License> GetAll();
        public void Create(License license);
        public void Delete(License license);
        public void Update(License license);
        public void UpdateLicenseStatus(Guid idLicense, int status);
        public License GetLicenseById(Guid idLicense);
        public List<License> GetAllByClientId(Guid clientId);
        public List<License> GetLicenseHistory(Guid clientId);
        public User GetUserById(Guid id);
        public void SendInvite(string email, Guid idLicenses, string userName);
        public List<License> GetLicensesByUserId(Guid userId);
        public List<object> GetUsersByClientId(Guid clientId);
        public License GetFirstAvailableLicense(Guid fkClientId, Guid licenseType, int status);
        public List<User> GetNonAssignedUsersByClientId(Guid clientId);
        public List<Client> GetClientsList();
        public List<License> GetLicensesByClientId(Guid clientId);
        public List<object> GetLicensesDataByClientId(Guid clientId);
    }
}