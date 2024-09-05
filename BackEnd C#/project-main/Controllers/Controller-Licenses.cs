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
using Microsoft.IdentityModel.Tokens;

namespace project_main.Controllers
{

    [Produces("application/json")]
    [Route("api/[controller]")]
    [ApiController]

    public class LicensesController : Controller
    {
        private readonly ILicensesService _licensesService;
        private readonly IUserService _userService;

        public LicensesController(ILicensesService licensesService, IUserService userService)
        {
            _licensesService = licensesService;
            _userService = userService;
        }

        private object GetDefaultValue(Type type)
        {
            return type.IsValueType ? Activator.CreateInstance(type) : null;
        }

        #region Get All Licenses
        [HttpGet("GetAll")]
        private IActionResult GetAll()
        {
            var licenses = _licensesService.GetAll();
            return Ok(licenses);
        }
        #endregion

        #region Create
        [HttpPost("Create")]
        public IActionResult Create([FromBody] License license)
        {
            if (!ModelState.IsValid) 
            {
                return BadRequest(ModelState);
            }
            //Make every created license starts with pending status (id 3 from 'license_status')
            license.FkStatus = 3;

            //Verification to empty Guid, if empty create an automatic Guid
            if(license.IdLicenses == Guid.Empty)
            {
                license.IdLicenses = Guid.NewGuid();
            }

            
            //Save all licenses from client id given
            var clientLicenses = _licensesService.GetAllByClientId(license.FkIdClient);

            
            //Verify if its the first license for the Client and if it is create a DB for the Client and safe the license in there
            if (clientLicenses.Count < 1)
            {
                //Código para criar a BD para a Empresa
            }
            

            //Create license            
            _licensesService.Create(license);


            return Ok("License created successfully");
        }
        #endregion

        #region Delete
        [HttpPost("Delete")]
        private IActionResult Delete(Guid idLicense) 
        {
            if (idLicense == null)
            {
                return BadRequest("IdLicense is null");
            }

            //Get license data from database
            var license = _licensesService.GetLicenseById(idLicense);

            if (license == null)
            {
                return NotFound("License Id not found");
            }

            //Delete license from database
            _licensesService.Delete(license);
            
            return Ok("License removed");
        }
        #endregion

        #region Update
        [HttpPost("Update")]
        private IActionResult Update(License license)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            //Save in var the user Role
            var userRole = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role)?.Value;
            if (string.IsNullOrEmpty(userRole))
            {
                return BadRequest("User Role not found in token");
            }

            //Get existing license data from database
            var existingLicense = _licensesService.GetLicenseById(license.IdLicenses);
            if (existingLicense == null)
            {
                return NotFound("Existing License not found");
            }
            

            //Verify role of the user
            //Tech admin can change another things that other roles cant
            if (userRole.ToUpper() == "")
            {
                var properties = typeof(License).GetProperties();
                foreach (var property in properties)
                {
                    var updatedValue = property.GetValue(license);
                    var existingValue = property.GetValue(existingLicense);

                    if (updatedValue != null && !updatedValue.Equals(GetDefaultValue(property.PropertyType)))
                    {
                        if (property.Name == "FkStatus")
                        {
                            property.SetValue(existingLicense, updatedValue);
                        }
                        else if(property.Name == "FkIdUser")
                        { 
                            property.SetValue(existingLicense, updatedValue);
                        }
                        else if (property.Name == "StartDate")
                        {
                            property.SetValue(existingLicense, updatedValue);
                        }
                        else if (property.Name == "FinishDate")
                        {
                            property.SetValue(existingLicense, updatedValue);
                        }
                    }
                }
            }
            else if(userRole.ToUpper() == "") //project Admin
            {
                var properties = typeof(License).GetProperties();
                foreach (var property in properties)
                {
                    var updatedValue = property.GetValue(license);
                    var existingValue = property.GetValue(existingLicense);

                    if (updatedValue != null && !updatedValue.Equals(GetDefaultValue(property.PropertyType)))
                    {
                        if (property.Name == "FkStatus")
                        {
                            property.SetValue(existingLicense, updatedValue);
                        }
                        else if (property.Name == "FkIdUser")
                        {
                            property.SetValue(existingLicense, updatedValue);
                        }
                        else
                        {
                            property.SetValue(existingLicense, updatedValue);
                        }
                    }
                }
            }
            else //User
            {
                //User permissions for license changes
            }


            //Update license from database
            try
            {
                _licensesService.Update(existingLicense);
            }
            catch (Exception)
            {
                return StatusCode(500, "An error occurred while updating the user.");
            }

            return Ok("License updated");
        }
        #endregion

        #region Update License (User assignment to a license for list item)
        public class UpdateLicenseRequest
        {
            public Guid IdLicenses { get; set; }
            public Guid FkIdUser { get; set; }
        }

        [HttpPost("UpdateLicense")]
        public IActionResult UpdateLicense([FromBody] UpdateLicenseRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Extract user role from claims
            var userRole = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role)?.Value;
            if (string.IsNullOrEmpty(userRole))
            {
                return BadRequest("User role not found in token.");
            }

            // Fetch the existing license details from the repository
            var existingLicense = _licensesService.GetLicenseById(request.IdLicenses);
            if (existingLicense == null)
            {
                return NotFound("License not found.");
            }

            // Extract current user ID from claims
            var currentUserId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            if (!Guid.TryParse(currentUserId, out Guid currentUserGuid))
            {
                return BadRequest("Invalid user ID format.");
            }

            // Admin role ID
            var adminRoleId = "";

            // Check if the current user is an admin and is trying to assign themselves
            if (userRole.Equals(adminRoleId, StringComparison.OrdinalIgnoreCase) && request.FkIdUser == currentUserGuid)
            {
                return BadRequest("Admin users cannot be assigned to any license.");
            }

            // Validate if the new user ID is already assigned to another license
            if (request.FkIdUser != existingLicense.FkIdUser)
            {
                var userLicenses = _licensesService.GetLicensesByUserId(request.FkIdUser);
                if (userLicenses.Any(l => l.IdLicenses != request.IdLicenses))
                {
                    return BadRequest("User is already assigned to another license.");
                }
            }

            // Proceed with the update
            try
            {
                existingLicense.FkIdUser = request.FkIdUser;
                _licensesService.Update(existingLicense);
            }
            catch (Exception ex)
            {
                // Log the exception details if needed
                return StatusCode(500, "An error occurred while updating the license.");
            }

            return Ok("License updated.");
        }
        #endregion

        #region Enable/Disable Single License (Status)
        // Request model for updating license status
        public class UpdateLicenseStatusRequest
        {
            public Guid IdLicense { get; set; }
            public int Status { get; set; }
        }

        [HttpPost("EnableDisable")]
        public IActionResult UpdateStatus([FromBody] UpdateLicenseStatusRequest request)
        {
            if (request == null || request.IdLicense == Guid.Empty)
            {
                return BadRequest("Invalid request data");
            }

            // Get the authenticated user's fk_client ID from claims
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

            // Check if the role ID is the special admin role
            if (userRoleId.Equals("", StringComparison.OrdinalIgnoreCase))
            {
                // Allow role-based access for admin
                return UpdateLicenseStatus(request, fkClientId);
            }

            // Get the license by ID
            var license = _licensesService.GetLicenseById(request.IdLicense);
            if (license == null)
            {
                return NotFound("License not found");
            }

            // Check if the user's fk_client ID matches the license's fk_client ID
            if (license.FkIdClient != fkClientId)
            {
                return Unauthorized("User not authorized to update this license");
            }

            // Validate the status of the request
            if (request.Status != 1 && request.Status != 4)
            {
                return BadRequest("Invalid status value. Valid values are 1 for enabling and 4 for disabling.");
            }

            // Allow the regular user to update the license status
            return UpdateLicenseStatus(request, fkClientId);
        }


        private IActionResult UpdateLicenseStatus(UpdateLicenseStatusRequest request, Guid fkClientId)
        {
            var license = _licensesService.GetLicenseById(request.IdLicense);
            if (license == null)
            {
                return NotFound("License not found");
            }

            // Update the license status
            try
            {
                license.FkStatus = request.Status;
                _licensesService.Update(license);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while updating the license status: {ex.Message}");
            }

            return Ok("License status updated successfully");
        }
        #endregion

        #region Enable/Disable Multiple Licenses (Status)
        // Request model for updating multiple license statuses
        public class UpdateMultipleLicensesStatusRequest
        {
            public List<UpdateLicenseStatusRequest> Licenses { get; set; }
        }

        [HttpPost("EnableDisableMultiple")]
        public IActionResult UpdateMultipleStatus([FromBody] UpdateMultipleLicensesStatusRequest request)
        {
            if (request == null || request.Licenses == null || !request.Licenses.Any())
            {
                return BadRequest("Invalid request data");
            }

            var fkClientString = User.Claims.FirstOrDefault(c => c.Type == "FkClient")?.Value;
            if (string.IsNullOrEmpty(fkClientString))
            {
                return Unauthorized("Client ID not found in token");
            }
            if (!Guid.TryParse(fkClientString, out Guid fkClientId))
            {
                return Unauthorized("Invalid Client ID format");
            }

            var userRoleId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role)?.Value;
            if (string.IsNullOrEmpty(userRoleId))
            {
                return Unauthorized("Role not found in token");
            }

            var notFoundLicenses = new List<Guid>();
            var unauthorizedLicenses = new List<Guid>();
            var invalidStatusLicenses = new List<Guid>();
            var errorMessages = new List<string>();

            foreach (var licenseRequest in request.Licenses)
            {
                var license = _licensesService.GetLicenseById(licenseRequest.IdLicense);
                if (license == null)
                {
                    notFoundLicenses.Add(licenseRequest.IdLicense);
                    continue;
                }

                if (license.FkIdClient != fkClientId && !userRoleId.Equals("", StringComparison.OrdinalIgnoreCase))
                {
                    unauthorizedLicenses.Add(licenseRequest.IdLicense);
                    continue;
                }

                // Validate the status of the request, not the current status of the license
                if (licenseRequest.Status != 1 && licenseRequest.Status != 4)
                {
                    invalidStatusLicenses.Add(licenseRequest.IdLicense);
                    continue;
                }

                try
                {
                    license.FkStatus = licenseRequest.Status;
                    _licensesService.Update(license);
                }
                catch (Exception ex)
                {
                    errorMessages.Add($"An error occurred while updating license {licenseRequest.IdLicense}: {ex.Message}");
                }
            }

            if (notFoundLicenses.Any())
            {
                return NotFound($"Licenses not found: {string.Join(", ", notFoundLicenses)}");
            }

            if (unauthorizedLicenses.Any())
            {
                return Unauthorized($"User not authorized to update licenses: {string.Join(", ", unauthorizedLicenses)}");
            }

            if (invalidStatusLicenses.Any())
            {
                return BadRequest($"Licenses with invalid status: {string.Join(", ", invalidStatusLicenses)}");
            }

            if (errorMessages.Any())
            {
                return StatusCode(500, $"Errors occurred while updating licenses: {string.Join("; ", errorMessages)}");
            }

            return Ok("License statuses updated successfully");
        }
        #endregion

        #region Unassign User from License
        public class UnassignLicenseRequest
        {
            public Guid IdLicense { get; set; }
        }

        [HttpPost("UnassignUser")]
        public IActionResult UnassignUserLicense([FromBody] UnassignLicenseRequest request)
        {
            if (request == null || request.IdLicense == Guid.Empty)
            {
                return BadRequest("Invalid request data");
            }

            // Get the authenticated user's fk_client ID from claims
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

            // Admin role bypass check
            var isAdmin = userRoleId.Equals("", StringComparison.OrdinalIgnoreCase);

            // Get the license by ID
            var license = _licensesService.GetLicenseById(request.IdLicense);
            if (license == null)
            {
                return NotFound("License not found");
            }

            // Check if the user's fk_client ID matches the license's fk_client ID
            if (!isAdmin && license.FkIdClient != fkClientId)
            {
                return Unauthorized("User not authorized to unassign this license");
            }

            // Unassign the license
            try
            {
                license.FkIdUser = null;
                license.FkStatus = 5; // Assuming 5 is the status for unassigned
                _licensesService.Update(license);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while unassigning the license: {ex.Message}");
            }

            return Ok("License unassigned successfully");
        }

        #endregion

        #region Assign User to License
        public class AssignLicenseRequest
        {
            public Guid LicenseType { get; set; }
            public Guid FkIdUser { get; set; }
        }

        [HttpPost("AssignUser")]
        public IActionResult AssignUserLicense([FromBody] AssignLicenseRequest request)
        {
            if (request == null || request.LicenseType == Guid.Empty || request.FkIdUser == Guid.Empty)
            {
                return BadRequest("Invalid request data");
            }

            // Get the authenticated user's fk_client ID from claims
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

            // Admin role bypass check
            var isAdmin = userRoleId.Equals("", StringComparison.OrdinalIgnoreCase);

            // Check if the user is already assigned to another license
            var existingLicenses = _licensesService.GetLicensesByUserId(request.FkIdUser);
            if (existingLicenses.Any(l => l.IdLicenses != request.LicenseType))
            {
                return BadRequest("User is already assigned to another license.");
            }


            // Get the first "not assigned" license of the specified type for the client's company
            var availableLicense = _licensesService.GetFirstAvailableLicense(fkClientId, request.LicenseType, 5);
            if (availableLicense == null)
            {
                return NotFound("No available licenses of the specified type");
            }

            // Check if the user's fk_client ID matches the license's fk_client ID
            if (!isAdmin && availableLicense.FkIdClient != fkClientId)
            {
                return Unauthorized("User not authorized to assign this license");
            }

            // Assign the license to the user
            try
            {
                availableLicense.FkIdUser = request.FkIdUser;
                availableLicense.FkStatus = 1; // Assuming 1 is the status for assigned
                _licensesService.Update(availableLicense);
            }
            catch (Exception ex)
            {
                // Log the exception details if needed
                return StatusCode(500, $"An error occurred while assigning the license: {ex.Message}");
            }

            return Ok("License assigned successfully");
        }
        #endregion

        #region Get All Licenses by Client ID (company)
        [HttpGet("GetAllByClientId")]
        public IActionResult Get()
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("ClientId is null");
            }

            var userIdString = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdString))
            {
                return BadRequest("User ID not found in token");
            }
            if (!Guid.TryParse(userIdString, out Guid userId))
            {
                return BadRequest("Invalid User ID format");
            }
            

            //Save in var all licenses from client
            var clientLicenses = _licensesService.GetAllByClientId(userId);

            return Ok(clientLicenses);
        }
        #endregion

        #region Get All Licenses by User ID
        [HttpGet("GetAllByUserId")]
        public IActionResult GetAllByClientId()
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid request");
            }

            var userIdString = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdString))
            {
                return BadRequest("User ID not found in token");
            }

            if (!Guid.TryParse(userIdString, out Guid userId))
            {
                return BadRequest("Invalid User ID format");
            }

            var fkClientString = User.Claims.FirstOrDefault(c => c.Type == "FkClient")?.Value;
            if (string.IsNullOrEmpty(fkClientString))
            {
                return BadRequest("Client ID not found in token");
            }

            if (!Guid.TryParse(fkClientString, out Guid fkClientId))
            {
                return BadRequest("Invalid Client ID format");
            }

            // Fetch all licenses for the client
            var clientLicenses = _licensesService.GetAllByClientId(fkClientId);

            return Ok(clientLicenses);
        }
        #endregion

        #region Get All Users from Client ID (company)
        [HttpGet("GetUsersByClientId")]
        public IActionResult GetUsersByClientId()
        {
            var fkClientString = User.Claims.FirstOrDefault(c => c.Type == "FkClient")?.Value;
            if (string.IsNullOrEmpty(fkClientString))
            {
                return Unauthorized("Client ID not found in token");
            }

            if (!Guid.TryParse(fkClientString, out Guid fkClientId))
            {
                return BadRequest("Invalid Client ID format");
            }

            var users = _licensesService.GetUsersByClientId(fkClientId);
            return Ok(users);
        }
        #endregion

        #region Get Non-Assigned Users from Client ID (company)
        [HttpGet("GetNonAssignedUsersByClientId")]
        public IActionResult GetNonAssignedUsersByClientId()
        {
            var fkClientString = User.Claims.FirstOrDefault(c => c.Type == "FkClient")?.Value;
            if (string.IsNullOrEmpty(fkClientString))
            {
                return Unauthorized("Client ID not found in token");
            }

            if (!Guid.TryParse(fkClientString, out Guid fkClientId))
            {
                return BadRequest("Invalid Client ID format");
            }

            var users = _licensesService.GetNonAssignedUsersByClientId(fkClientId);
            return Ok(users);
        }
        #endregion

        #region Get License History
        [HttpGet("LicenseHistory")]
        public IActionResult GetHistory()
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            //Require user token from login
            var userIdString = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdString))
            {
                return BadRequest("User not found in token");
            }
            if (!Guid.TryParse(userIdString, out Guid userId))
            {
                return BadRequest("Invalid User ID format");
            }
            
            var userData = _licensesService.GetUserById(userId);
            if(userData == null)
            {
                return BadRequest("Can't get user data");
            }
            

            //Save expired licenses list
            var expiredLicenses = _licensesService.GetLicenseHistory(userData.FkClient);
            if (expiredLicenses == null)
            {
                return NotFound("No expired licenses found");
            }

            return Ok(expiredLicenses);
        }
        #endregion

        #region SendInvite
        public class SendInviteRequestBody
        {
            public string Email { get; set; }
            public Guid LicenseId { get; set; }
        }

        [HttpPost("SendInvite")]
        public IActionResult SendInvite([FromBody] SendInviteRequestBody sentData)
        {
            // Require user token from login
            var userRole = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role)?.Value;
            if (string.IsNullOrEmpty(userRole))
            {
                return BadRequest("User not found in token");
            }
            if (userRole.ToUpper() == "") // Guid User of project App
            {
                return BadRequest("User role not accepted");
            }

            // Save user name from user claims
            var userName = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;

            // Check if email is already registered
            var emailExists = _userService.EmailExists(sentData.Email);
            if (emailExists)
            {
                return Conflict("Email already registered in project, can't send invite to a user who is already registered");
            }

            // Save Id user string in var and try to convert to Guid
            var userIdString = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            if (!Guid.TryParse(userIdString, out Guid userId))
            {
                return BadRequest("Invalid User ID format");
            }

            // Save userData from table
            var userData = _licensesService.GetUserById(userId);

            // Find the license by ID and check if it's not assigned
            var license = _licensesService.GetLicenseById(sentData.LicenseId);
            if (license == null || license.FkStatus != 5) // Set status 5 as "not assigned"
            {
                return NotFound("No valid licenses found");
            }
            if (license.FkIdUser != null)
            {
                return Conflict("License already has a user assigned");
            }

            _licensesService.SendInvite(sentData.Email, license.IdLicenses, userName);

            return Ok("Email sent successfully");
        }
        #endregion


        #region Role Authorization for Tech Admin
        private readonly string requiredRoleId = "";

        private bool UserHasRequiredRole()
        {
            return User.Claims.Any(c => c.Type == ClaimTypes.Role && c.Value == requiredRoleId);
        }
        #endregion

        #region Get Clients List
        [HttpGet("GetClientsList")]
        public IActionResult GetClientsList()
        {
            if (!UserHasRequiredRole())
            {
                return Unauthorized("Required role not found in token");
            }

            var clients = _licensesService.GetClientsList();
            return Ok(clients);
        }
        #endregion

        #region Get Licenses by Client ID
        [HttpGet("GetLicensesByClientId")]
        private IActionResult GetLicensesByClientId(Guid clientId)
        {
            if (!UserHasRequiredRole())
            {
                return Unauthorized("Required role not found in token");
            }

            var licenses = _licensesService.GetLicensesByClientId(clientId);
            return Ok(licenses);
        }
        #endregion

        #region Get Licenses Data by Client ID
        [HttpGet("GetLicensesDataByClientId")]
        public IActionResult GetLicensesDataByClientId(Guid clientId)
        {
            if (!UserHasRequiredRole())
            {
                return Unauthorized("Required role not found in token");
            }

            var licensesData = _licensesService.GetLicensesDataByClientId(clientId);
            return Ok(licensesData);
        }
        #endregion

    }
}