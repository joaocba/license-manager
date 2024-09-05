using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using project_main.Helper;
using project_main.Models;
using project_main.Service;
using project_main.Services;
using System.Security.Claims;
using System.Text.RegularExpressions;

namespace project_main.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    [ApiController]
    public class UserPreferenceController : Controller
    {
        private readonly IUserPreferenceService _userPreferenceService;
        public UserPreferenceController(IUserPreferenceService userPreferencesService)
        {
            _userPreferenceService = userPreferencesService;
        }

        [HttpGet("GetAll")]
        public IActionResult GetAll()
        {
            var users = _userPreferenceService.GetAll();
            return Ok(users);
        }

        [HttpGet("GetByUserId")]
        public IActionResult Get()
        {
            var userIdString = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdString))
            {
                return BadRequest("User ID not found in token");
            }

            if (!Guid.TryParse(userIdString, out Guid userId))
            {
                return BadRequest("Invalid User ID format");
            }

            var userPreferences = _userPreferenceService.GetUserById(userId);
            if (userPreferences == null)
            {
                return NotFound("User preferences not found");
            }

            return Ok(userPreferences);
        }

        [HttpPost("Update")]
        public IActionResult Update([FromBody] UserPreference userPreferences)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
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

            var existingUser = _userPreferenceService.GetUserById(userId);
            if (existingUser == null)
            {
                return NotFound("User not found");
            }

            // Update user fields using reflection
            var properties = typeof(UserPreference).GetProperties();
            foreach (var property in properties)
            {
                var updatedValue = property.GetValue(userPreferences);
                var existingValue = property.GetValue(existingUser);

                if (updatedValue != null && property.CanWrite)
                {
                    switch (property.Name)
                    {
                        case "NotificationBillingApp":
                        case "NotificationBillingEmail":
                        case "NotificationBillingSms":
                        case "NotificationSystemApp":
                        case "NotificationSystemEmail":
                        case "NotificationSystemSms":
                        case "NotificationSecurityApp":
                        case "NotificationSecurityEmail":
                        case "NotificationSecuritySms":
                        case "NotificationMessageApp":
                        case "NotificationMessageEmail":
                        case "NotificationMessageSms":
                            property.SetValue(existingUser, updatedValue);
                            break;
                        default:
                            break;
                    }
                }
            }

            try
            {
                _userPreferenceService.Update(existingUser);
            }
            catch (Exception)
            {
                return StatusCode(500, "An error occurred while updating the user.");
            }

            return Ok("User Preferences updated");
        }
    }
}