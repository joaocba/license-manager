using Microsoft.AspNetCore.Mvc;
using project_main.Models;
using project_main.Repository;
using project_main.Service;
using System.ComponentModel;

namespace project_main.Services
{
    public class LicensesService : ILicensesService
    {
        private ILicensesRepository _licensesRepository;

        public LicensesService(ILicensesRepository licensesRepository)
        {
            _licensesRepository = licensesRepository;
        }

        public List<License> GetAll()
        {
            return _licensesRepository.GetAll();
        }

        public void Create(License license)
        {
            _licensesRepository.Create(license);
        }

        public void Delete(License license)
        {
            _licensesRepository.Delete(license);
        }

        public void Update(License license)
        {
            _licensesRepository.Update(license);
        }

        public void UpdateLicenseStatus(Guid idLicense, int status)
        {
            _licensesRepository.UpdateLicenseStatus(idLicense, status);
        }


        public License GetLicenseById(Guid idLicense)
        {
            return _licensesRepository.GetLicenseById(idLicense);
        }

        public List<License> GetAllByClientId(Guid clientId)
        {
            return _licensesRepository.GetAllByClientId(clientId);
        }

        public List<License> GetLicenseHistory(Guid clientId)
        {
            return _licensesRepository.GetLicenseHistory(clientId);
        }

        public User GetUserById(Guid id)
        {
            return _licensesRepository.GetUserById(id);
        }

        public void SendInvite(string email, Guid idLicenses, string userName)
        {
            _licensesRepository.SendInvite(email, idLicenses, userName);
        }

        public List<License> GetLicensesByUserId(Guid userId)
        {
            return _licensesRepository.GetLicensesByUserId(userId);
        }

        public List<object> GetUsersByClientId(Guid clientId)
        {
            return _licensesRepository.GetUsersByClientId(clientId);
        }

        public License GetFirstAvailableLicense(Guid fkClientId, Guid licenseType, int status)
        {
            return _licensesRepository.GetFirstAvailableLicense(fkClientId, licenseType, status);
        }

        public List<User> GetNonAssignedUsersByClientId(Guid clientId)
        {
            return _licensesRepository.GetNonAssignedUsersByClientId(clientId);
        }

        public List<Client> GetClientsList()
        {
            return _licensesRepository.GetClientsList();
        }

        public List<License> GetLicensesByClientId(Guid clientId)
        {
            return _licensesRepository.GetLicensesByClientId(clientId);
        }

        public List<object> GetLicensesDataByClientId(Guid clientId)
        {
            return _licensesRepository.GetLicensesDataByClientId(clientId);
        }
    }
}
