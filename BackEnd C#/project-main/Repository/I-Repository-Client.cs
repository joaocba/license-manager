using project_main.Models;
using project_main.Repository;

namespace project_main.Repository
{
    public interface IClientRepository
    {
        public List<Client> GetAll();
        public void Create(Client client);
        public void Update(Client client);
        public List<object> GetClientInfoById(Guid idClient);
        public Client GetClientByName(string name);
        public string GetClientCountryName(Guid idClient);
    }
}