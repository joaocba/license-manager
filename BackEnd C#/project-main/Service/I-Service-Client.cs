using project_main.Models;

namespace project_main.Services
{
    public interface IClientService
    {
        public List<Client> GetAll();
        public void Create(Client client);
        public void Update(Client client);
        public List<object> GetClientInfoById(Guid idClient);
        public Client GetClientByName(string name);
        public string GetClientCountryName(Guid idClient);
    }
}
