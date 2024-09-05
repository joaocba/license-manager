using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using project_main.Helper;
using project_main.Models;
using System.Linq.Expressions;
using System.Net.Sockets;
using System.Reflection.Metadata.Ecma335;

namespace project_main.Repository
{
    public class ClientRepository : IClientRepository
    {
        public ClientRepository() { }

        public List<Client> GetAll()
        {
            using (var context = new project_mainContext())
            {
                var query = (from c in context.Clients
                             select new Client
                             {
                                 IdClient = c.IdClient,
                                 ClientName = c.ClientName,
                                 Description = c.Description,
                                 FiscalAdress = c.FiscalAdress,
                                 Vat = c.Vat,
                                 Timestamp = c.Timestamp,
                                 Status = c.Status,
                                 FkUser = c.FkUser,
                                 FkCountry = c.FkCountry,
                                 Link = c.Link,
                                 Suspended = c.Suspended,

                             }).ToList();
                return query;
            }
        }

        public void Create(Client client)
        {
            using (var context = new project_mainContext())
            {
                context.Clients.Add(client);
                context.SaveChanges();
            }
        }

        public Client GetClientByName(string name)
        {
            using (var context = new project_mainContext())
            {
                return context.Clients.FirstOrDefault(c => c.ClientName == name);
            }
        }

        public void Update(Client client)
        {
            using (var context = new project_mainContext())
            {
                context.Clients.Update(client);
                context.SaveChanges();
            }
        }

        public List<Object> GetClientInfoById(Guid idClient)
        {
            using (var context = new project_mainContext())
            {
                return context.Clients
                              .Where(u => u.IdClient == idClient)
                              .Select(u => new
                              {
                                  u.ClientName,
                                  u.Vat,
                                  u.FiscalAdress
                              })
                              .ToList<Object>();
            }
        }

        public string GetClientCountryName(Guid idClient)
        {
            using (var context = new project_mainContext())
            {
                var countryName = from client in context.Clients
                                  join country in context.Countries on client.FkCountry equals country.IdCountry
                                  where client.IdClient == idClient
                                  select country.Country1;
                return countryName.FirstOrDefault();
            }
        }
    }
}
