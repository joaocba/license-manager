using project_main.Models;

namespace project_main.Repository
{
    public class PackageRepository : IPackageRepository
    {
        public PackageRepository() { }

        public List<Package> GetAll()
        {
            using (var context = new project_mainContext())
            {
                var packages = (from p in context.Packages
                                select new Package
                                {
                                    PackagesClientsModules = (from pcm in context.PackagesClientsModules
                                                              join
                                                              m in context.Modules on pcm.FkModule equals m.IdModule
                                                              where pcm.FkPackage.Equals(p.IdPackage)
                                                              select new PackagesClientsModule
                                                              {
                                                                  FkModuleNavigation = m,
                                                              }).ToList(),
                                    IdPackage = p.IdPackage,
                                    PackageName = p.PackageName,
                                    PackageMonthlyPrice = p.PackageMonthlyPrice,
                                    PackageAnnualPrice = p.PackageAnnualPrice,
                                    FkIdPackageParent = p.FkIdPackageParent

                                }).ToList();

                return packages;
            }
        }

        public void Create(Package package)
        {
            using (var context = new project_mainContext())
            {
                context.Packages.Add(package);
                context.SaveChanges();
            }
        }

        public List<Package> GetAllActive()
        {
            using (var context = new project_mainContext())
            {
                //GetAll values from DB
                var packages = (from p in context.Packages
                                join
                                pp in context.PackagesParents on p.FkIdPackageParent equals pp.IdPackageParent
                                select new Package
                                {
                                    PackagesClientsModules = (from pcm in context.PackagesClientsModules
                                                              join
                                                              m in context.Modules on pcm.FkModule equals m.IdModule
                                                              where pcm.FkPackage.Equals(p.IdPackage)
                                                              select new PackagesClientsModule
                                                              {
                                                                  FkModuleNavigation = m,
                                                              }).ToList(),
                                    IdPackage = p.IdPackage,
                                    PackageName = pp.PackageParentName,
                                    PackageMonthlyPrice = p.PackageMonthlyPrice,
                                    PackageAnnualPrice = p.PackageAnnualPrice,
                                    StartDate = p.StartDate,
                                    FinishDate = p.FinishDate,
                                    FkIdPackageParent = p.FkIdPackageParent

                                }).ToList();

                //Filter by current date
                DateTime currentDateTime = DateTime.Now.Date;
                List<Package> activePackages = packages.Where(u => u.StartDate <= DateOnly.FromDateTime(currentDateTime) && u.FinishDate >= DateOnly.FromDateTime(currentDateTime)).ToList();

                return activePackages;
            }
        }
    }
}
