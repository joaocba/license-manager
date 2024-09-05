using project_main.Models;

namespace project_main.Services
{
    public interface IPackageService
    {
        public List<Package> GetAll();
        public void Create(Package package);
        public List<Package> GetAllActive();
    }
}