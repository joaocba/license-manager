using Microsoft.AspNetCore.Mvc;
using project_main.Models;
using project_main.Services;

namespace project_main.Controllers
{

    [Produces("application/json")]
    [Route("api/[controller]")]
    [ApiController]

    public class PackageController : Controller
    {
        private readonly IPackageService _packageService;

        public PackageController(IPackageService packageService)
        {
            _packageService = packageService;
        }

        [HttpGet("GetAll")]
        public IActionResult GetAll()
        {
            var releases = _packageService.GetAll();
            return Ok(releases);
        }

        [HttpPost("Create")]
        public IActionResult Create([FromBody] Package package)
        {
            if (package == null)
            {
                return BadRequest("Release object is null");
            }

            _packageService.Create(package);
            return Ok("Release created successfully");
        }

        [HttpGet("GetAllActive")]
        public IActionResult GetAllActive()
        {
            var activeReleases = _packageService.GetAllActive();
            return Ok(activeReleases);
        }

        #region GetPackagePrices
        [HttpGet("GetPackagePrices")]
        public IActionResult GetPackagePrices()
        {
            // Fetch all packages
            var packages = _packageService.GetAll();

            // Project to a new anonymous type containing only the required fields
            var result = packages.Select(p => new
            {
                p.PackageName,
                p.PackageMonthlyPrice,
                p.PackageAnnualPrice
            }).ToList();

            return Ok(result);
        }
        #endregion
    }
}