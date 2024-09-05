using MailKit.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using project_main.Helper;
using project_main.Models;
using project_main.Repository;
using project_main.Service;
using project_main.Services;
using project_main.ViewModel;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;
using MailKit.Net.Smtp;
using MailKit;
using MimeKit;
using MailKit.Security;
using System.Numerics;
using Microsoft.AspNetCore.Http.Extensions;
using project_main.Helper;
using Microsoft.AspNetCore.Http;
using System.Reflection.Metadata.Ecma335;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel;
using Org.BouncyCastle.Bcpg;

namespace project_main.Controllers
{

    [Produces("application/json")]
    [Route("api/[controller]")]
    [ApiController]

    public class LicenseStatusController : Controller
    {
        private readonly ILicenseStatusService _licenseStatusService;

        public LicenseStatusController(ILicenseStatusService licenseStatusService)
        {
            _licenseStatusService = licenseStatusService;
        }

        [HttpGet("GetAll")]
        public IActionResult GetAll()
        {
            var licenseStatus = _licenseStatusService.GetAll();
            return Ok(licenseStatus);
        }
    }
}
