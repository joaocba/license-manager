using project_main.Models;
using project_main.Repository;

namespace project_main.Services
{
    public class PackageService : IPackageService
    {
        private IPackageRepository _packageRepository;

        public PackageService(IPackageRepository packageRepository)
        {
            _packageRepository = packageRepository;
        }

        public List<Package> GetAll()
        {
            return _packageRepository.GetAll();
        }

        public void Create(Package package)
        {
            _packageRepository.Create(package);
        }

        public List<Package> GetAllActive()
        {
            return _packageRepository.GetAllActive();
        }
    }
}
