using project_main.Models;
using project_main.Repository;
using System.ComponentModel;

namespace project_main.Services
{
    public class ClientService : IClientService
    {
        private IClientRepository _clientRepository;

        public ClientService(IClientRepository clientRepository)
        {
            _clientRepository = clientRepository;
        }

        public List<Client> GetAll()
        {
            return _clientRepository.GetAll();
        }

        public void Create(Client client)
        {
            _clientRepository.Create(client);
        }

        public void Update(Client client)
        {
            _clientRepository.Update(client);
        }

        public List<object> GetClientInfoById(Guid idClient)
        {
            return _clientRepository.GetClientInfoById(idClient);
        }

        public Client GetClientByName(string name)
        {
            return _clientRepository.GetClientByName(name);
        }

        public string GetClientCountryName(Guid idClient)
        {
            return _clientRepository.GetClientCountryName(idClient);
        }
    }
}
