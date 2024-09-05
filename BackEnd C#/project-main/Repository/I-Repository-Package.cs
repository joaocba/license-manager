using project_main.Models;
using project_main.Repository;

namespace project_main.Repository
{
    public interface IPackageRepository
    {
        public List<Package> GetAll();
        public void Create(Package package);
        public List<Package> GetAllActive();
    }
}