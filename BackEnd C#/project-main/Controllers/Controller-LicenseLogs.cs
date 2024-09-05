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

    public class LicenseLogsController : Controller
    {
        private readonly ILicenseLogsService _licenseLogsService;

        public LicenseLogsController(ILicenseLogsService licenseLogsService)
        {
            _licenseLogsService = licenseLogsService;
        }

        #region Get All License Logs (UNUSED)
        [HttpGet("GetAll")]
        private IActionResult GetAll()
        {
            var licenseLogs = _licenseLogsService.GetAll();
            return Ok(licenseLogs);
        }
        #endregion

        #region Create License Log (UNUSED)
        [HttpPost("Create")]
        private IActionResult Create([FromBody] LicenseLog licenseLog)
        {
            if (licenseLog == null)
            {
                return BadRequest("Invalid data.");
            }

            try
            {
                _licenseLogsService.Create(licenseLog);
                return Ok("License log created successfully.");
            }
            catch (DbUpdateException ex)
            {
                // Log the exception details for further investigation
                return StatusCode(StatusCodes.Status500InternalServerError, "Database update error");
            }
        }
        #endregion

        #region Create License Log with Client ID
        [HttpPost("CreateWithClient")]
        public IActionResult CreateWithClient([FromBody] LicenseLog licenseLog)
        {
            if (licenseLog == null)
            {
                return BadRequest("Invalid data.");
            }

            // Get the authenticated user's Client ID from claims
            var fkClientString = User.Claims.FirstOrDefault(c => c.Type == "FkClient")?.Value;
            if (string.IsNullOrEmpty(fkClientString))
            {
                return Unauthorized("Client ID not found in token");
            }

            if (!Guid.TryParse(fkClientString, out Guid fkClientId))
            {
                return Unauthorized("Invalid Client ID format");
            }

            // Get the user's role from claims
            var userRoleId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role)?.Value;
            if (string.IsNullOrEmpty(userRoleId))
            {
                return Unauthorized("Role not found in token");
            }

            // Admin role check (replace with your actual role check logic)
            var isAdmin = userRoleId.Equals("", StringComparison.OrdinalIgnoreCase);

            // If not an admin, ensure the client ID from the token matches the one provided in the request
            if (!isAdmin && licenseLog.FkClient != fkClientId)
            {
                return Unauthorized("User is not authorized to create a log for this client");
            }

            // Set the fkClient property to the Client ID from the token if not admin
            if (isAdmin)
            {
                licenseLog.FkClient = fkClientId;
            }

            try
            {
                _licenseLogsService.Create(licenseLog);
                return Ok("License log created successfully.");
            }
            catch (DbUpdateException ex)
            {
                // Log the exception details for further investigation
                return StatusCode(StatusCodes.Status500InternalServerError, "Database update error");
            }
        }
        #endregion

        #region Update License Log (UNUSED)
        [HttpPut("Update")]
        private IActionResult Update([FromBody] LicenseLog licenseLog)
        {
            _licenseLogsService.Update(licenseLog);
            return Ok();
        }
        #endregion

        #region Get License Logs by Client ID
        [HttpGet("GetByClientId")]
        public IActionResult GetLicenseLogs()
        {
            // Get the authenticated user's Client ID from claims
            var fkClientString = User.Claims.FirstOrDefault(c => c.Type == "FkClient")?.Value;
            if (string.IsNullOrEmpty(fkClientString))
            {
                return Unauthorized("Client ID not found in token");
            }

            if (!Guid.TryParse(fkClientString, out Guid clientId))
            {
                return Unauthorized("Invalid Client ID format");
            }

            // Retrieve the license logs for the client ID
            var licenseLogs = _licenseLogsService.GetByClientId(clientId);

            // Check if any logs are found
            if (licenseLogs == null || !licenseLogs.Any())
            {
                return NotFound("No license logs found for this client");
            }

            return Ok(licenseLogs);
        }
        #endregion

    }
}
