
using Microsoft.AspNetCore.Mvc;
using project_main.Helper;
using project_main.Models;
using project_main.Service;
using project_main.Services;
using project_main.ViewModel;
using System.Security.Claims;
using System.Text.RegularExpressions;


namespace project_main.Controllers
{

    [Produces("application/json")]
    [Route("api/[controller]")]
    [ApiController]

    public class UserController : Controller
    {
        private readonly IUserService _userService;
        private readonly IConfiguration _configuration;
        private readonly IClientService _clientService;
        private readonly IForgotPasswordService _forgotPasswordService;
        private readonly ISmtpConfigService _smtpConfigService;
        private readonly ILicensesService _licenseService;
        private readonly IUserPreferenceService _userPreferenceService;
        private readonly IProfilePictureService _profilePictureService;
        private readonly project_mainContext _context;

        public UserController(IUserService userService, IConfiguration configuration, IForgotPasswordService forgotPasswordService, ILicensesService licenseService, IClientService clientService, IUserPreferenceService userPreferenceService, project_mainContext context, IProfilePictureService profilePictureService)
        {
            _userService = userService;
            _configuration = configuration;
            _forgotPasswordService = forgotPasswordService;
            _licenseService = licenseService;
            _clientService = clientService;
            _userPreferenceService = userPreferenceService;
            _context = context;
            _profilePictureService = profilePictureService;
        }

        #region Get All Users (UNUSED)
        [HttpGet("GetAll")]
        private IActionResult GetAll()
        {
            var users = _userService.GetAll();
            return Ok(users);
        }
        #endregion

        #region Create User
        [HttpPost("Create")]
        public IActionResult Create([FromBody] UserViewModel user)
        {
            
            bool emailExists = _userService.EmailExists(user.User.Email);
            var invite = _licenseService.GetAll().FirstOrDefault(l => l.IdLicenses == user.User.FkLicense);
            
            HttpRequest request = HttpContext.Request;
            VerifyAccount verifyAccount = new VerifyAccount();

            
            //Test if front end send the licenseId 
            if (invite == null) //Not invite
            {
                if (user == null)
                {
                    return BadRequest("User object is null");
                }

                // Check if the email already exists
                if (emailExists)
                {
                    // Email already exists, return a conflict response
                    return Conflict("This email is already registered on project");
                }


                var allClients = _clientService.GetAll();
                var clientExists = allClients.FirstOrDefault(c => c.Vat == user.Client.Vat);

                //If client do not exist yet, user will be admin
                if (clientExists == null)
                {
                    // Set the FkRole property of the user to the specified Guid value
                    user.User.FkRole = new Guid(""); //Client Admin

                   
                    //There is no create function in client
                    _clientService.Create(user.Client);


                    //Save in User the client that he belong
                    var clientData = _clientService.GetAll().Where(c => c.ClientName == user.Client.ClientName).FirstOrDefault();
                    user.User.FkClient = new Guid(clientData.IdClient.ToString().ToUpper());

                    //Create user
                    _userService.Create(user);

                    //Update client Admin
                    var userData = _userService.GetUserByEmail(user.User.Email);
                    user.Client.FkUser = new Guid(userData.IdUser.ToString().ToUpper());
                    _clientService.Update(user.Client);

                }
                else //If client exists, user will be a normal user
                {
                    user.User.FkRole = new Guid(""); //Client User
                    user.User.FkClient = clientExists.IdClient;

                    //Create user
                    _userService.Create(user);
                }
            }
            else //Invite
            {
                if (user == null)
                {
                    return BadRequest("User object is null");
                }

                // Check if the email already exists
                if (emailExists)
                {
                    // Email already exists, return a conflict response
                    return Conflict("This email is already registered on project");
                }

                //Give Normal User role to user
                user.User.FkRole = new Guid("");
                //Add client to user
                var clientData = _clientService.GetClientByName(user.Client.ClientName);
                user.User.FkClient = clientData.IdClient;

                _userService.Create(user);

                //Update the license with user info
                License updateLicense = new License();
                var licenseData = _licenseService.GetLicenseById(new Guid(user.User.FkLicense.ToString().ToUpper()));
                updateLicense = licenseData;

                var actualUser = _userService.GetUserByEmail(user.User.Email);
                updateLicense.FkIdUser = actualUser.IdUser;
                updateLicense.FkStatus = 1; //Update license to active 
            
                _licenseService.Update(updateLicense);
            }

            //If checkbox from front-end is checked create an user with email notifications true
            if (user.emailNewsletter)
            {
                user.UserPreference.IdUser = _userService.GetUserByEmail(user.User.Email).IdUser;
                user.UserPreference.NotificationMessageEmail = true;
                user.UserPreference.NotificationSecurityEmail = true;
                user.UserPreference.NotificationBillingEmail = true;
                user.UserPreference.NotificationSystemEmail = true;
            }
            else //If not create with everything false
            {
                user.UserPreference.IdUser = _userService.GetUserByEmail(user.User.Email).IdUser;
            }
            _userPreferenceService.Create(user.UserPreference);

            
            //Sends verification email
            verifyAccount.VerifyUser(user.User.Email, user.User.Name, user.User.VerificationToken, request);
            
            
            //Create new Folder in Server to save ProfilePictures
            Ftp ftpClass = new Ftp();
            string userFolderPath = "" + user.User.Name + "/";

            if (!ftpClass.CreateDirectory(userFolderPath))
            {
                return Problem("Error creating Directory");
            }

            //Create ProfilePicture Field for user
            var profilePictureField = new ProfilePicture
            {
                FkIdUser = user.User.IdUser,
                FileName = "avatar",
                FileType = "jpg",
                FilePath = $"",
                Base64 = ""
            };

            _profilePictureService.Create(profilePictureField);

            return Ok("User created successfully");
        }
        #endregion

        #region Verify Account
        [HttpGet("VerifyAccount")]
        public IActionResult ConfirmRegistration([FromQuery] string token)
        {
            //If token is not empty
            if (string.IsNullOrEmpty(token))
            {
                return Redirect($"http://localhost:5173/error");
            }

            // Use the token to retrieve the user's data from the repository
            var user = _userService.GetUserByVerificationToken(token);

            // Check if user is null
            if (user == null)
            {
                // Handle case where user data is not found
                return Redirect($"http://localhost:5173/error");
            }

            //If verification tokens do not match
            if(user.VerificationToken != token)
            {
                return Redirect($"http://localhost:5173/error");
            }

            //If isVerified is already true
            if(user.IsVerified == true)
            {
                return Redirect($"http://localhost:5173/error"); 
            }

            //If not verified, turn true and save changes
            if(user.IsVerified == false || user.IsVerified == null)
            {
                user.IsVerified = true;
                _userService.updateUser(user);
            }

            //This line needs to be changed to the localhost that you are using for testing
            return Redirect($"http://localhost:5173/verifyAccount");

        }
        #endregion

        #region Login
        [HttpPost("Login")]
        public IActionResult Login([FromBody] User user)
        {
            PasswordHash passwordHash = new PasswordHash();

            if (user == null)
            {
                return BadRequest("User object is null");
            }

            var authenticatedUser = _userService.CheckUsers(user);

            if (authenticatedUser == null)
            {
                // No user found with the provided email
                return Unauthorized("Invalid email or password");
            }

            bool isPasswordCorrect = passwordHash.VerifyPassword(user.Password, authenticatedUser.Password);

            if (isPasswordCorrect)
            {
                // Authentication successful, generate JWT token using UserRepository
                var token = _userService.GenerateToken(authenticatedUser);
                return Ok(new { token });
            }
            else
            {
                // Authentication failed
                return Unauthorized("Invalid email or password");
            }
        }
        #endregion

        #region Get User Data
        [HttpGet("GetData")]
        public IActionResult GetUserData()
        {
            try
            {
                // Log all claims for debugging
                var claims = User.Claims.ToList();
                foreach (var claim in claims)
                {
                    Console.WriteLine($"Claim Type: {claim.Type}, Claim Value: {claim.Value}");
                }

                // Retrieve the user's email from the claims
                var userEmail = claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
                if (string.IsNullOrEmpty(userEmail))
                {
                    return Unauthorized("User data not found.");
                }

                // Use the email to retrieve the user's data from the repository
                var user = _userService.GetUserByEmail(userEmail);

                //Get client By ID
                var clientName = user.FkClientNavigation.ClientName;
                var client = _clientService.GetClientByName(clientName);
                //Get client country to fill form


                // Check if user is null
                if (user == null)
                {
                    // Handle case where user data is not found
                    return NotFound("User data not found.");
                }


                // Return the user's data including role clients and profilePicture data
                Ftp ftp=new Ftp();

                var userData = new
                {
                    user.IdUser,
                    user.Name,
                    user.Email,
                    user.PhoneNumber,
                    InsertDate = user.InsertDate?.ToString("yyyy-MM-dd HH:mm:ss"),
                    user.Status,
                    user.Address,
                    user.Country,
                    Client = user.FkClientNavigation == null ? null : new
                    {
                        user.FkClientNavigation.IdClient,
                        ClientName = user.FkClientNavigation.ClientName ?? "",
                        ClientVat = user.FkClientNavigation.Vat ?? "",
                        ClientAddress = user.FkClientNavigation.FiscalAdress ?? "",
                        CountryId = user.FkClientNavigation.FkCountry ?? null,
                        CountryName = _clientService.GetClientCountryName(user.FkClientNavigation.IdClient),
                    },
                    Role = new
                    {
                        user.FkRoleNavigation.IdRole,
                        user.FkRoleNavigation.Role1
                    },
                    ProfilePicture = new
                    {
                        user.FkProfilePictureNavigation.Base64,
                    }
                };

                return Ok(userData);
            }
            catch (Exception ex)
            {
                // Log the exception
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }


    #endregion



    #region ForgotPassword

    [HttpPost("ForgotPassword")]
        public IActionResult ForgotPassword([FromBody] string email)
        {
            // Confirms if email exists in database
            var exists = _userService.EmailExists(email);

            if (!exists)
            {
                return NotFound("User not found");
            }

            // Use the email to retrieve the user's data from the repository
            var user = _userService.GetUserByEmail(email);

            //Generate token and add it to user
            user.PasswordRecoveryToken = _userService.GenerateToken(user);

            //Defines an expiration time
            user.PasswordRecoveryTokenExpires = DateTime.Now.AddMinutes(15);

            //Save changes in dataBase
            _forgotPasswordService.SaveToken(user);

            //Send the email to user
            _forgotPasswordService.MailSender(email, user.PasswordRecoveryToken, "Password Recovery");

            // Return to front end
            return Ok("");
        }
    

        [HttpPost("Update")]
        public IActionResult Update([FromBody] User updatedUser)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userEmail = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
            if (string.IsNullOrEmpty(userEmail))
            {
                return BadRequest("User email not found in token");
            }

            var existingUser = _userService.GetUserByEmail(userEmail);
            if (existingUser == null)
            {
                return NotFound("User not found");
            }

            // Update user fields using reflection
            var properties = typeof(User).GetProperties();
            foreach (var property in properties)
            {
                var updatedValue = property.GetValue(updatedUser);
                var existingValue = property.GetValue(existingUser);

                if (updatedValue != null && !updatedValue.Equals(GetDefaultValue(property.PropertyType)))
                {
                    if (property.Name == "Email")
                    {
                        // Validate email format
                        string emailPattern = @"^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$";
                        if (Regex.IsMatch(updatedValue.ToString(), emailPattern))
                        {
                            existingUser.Email = updatedValue.ToString();
                        }
                        else
                        {
                            throw new ArgumentException("Invalid email format.");
                        }
                    }
                    else if (property.Name == "PhoneNumber")
                    {
                        // Validate phone number has 9 digits
                        if (updatedValue.ToString().Length == 9 && long.TryParse(updatedValue.ToString(), out _))
                        {
                            property.SetValue(existingUser, updatedValue);
                        }
                        else
                        {
                            throw new ArgumentException("Phone number must have exactly 9 digits.");
                        }
                    }
                    else if (property.Name == "Name")
                    {
                        // Validate name is not empty
                        if (!string.IsNullOrWhiteSpace(updatedValue.ToString()))
                        {
                            property.SetValue(existingUser, updatedValue);
                        }
                        else
                        {
                            throw new ArgumentException("Name cannot be empty.");
                        }
                    }
                    else if (property.Name == "Address")
                    {                        
                        property.SetValue(existingUser, updatedValue);
                        
                    }
                    else if (property.Name == "Country")
                    {
                        property.SetValue(existingUser, updatedValue);
                       
                    }
                    else
                    {
                        property.SetValue(existingUser, updatedValue);
                    }
                }
            }

                try
            {
                _userService.Update(existingUser);
            }
            catch (Exception)
            {
                return StatusCode(500, "An error occurred while updating the user.");
            }

            return Ok("User updated");
        }

        private object GetDefaultValue(Type type)
        {
            return type.IsValueType ? Activator.CreateInstance(type) : null;
        }


        [HttpPost("ChangePassword")]
        public IActionResult ChangePassword([FromBody] ChangePasswordModel model)
        {
            if (model == null)
            {
                return BadRequest("Invalid client request");
            }

            var userEmail = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
            if (string.IsNullOrEmpty(userEmail))
            {
                return BadRequest("User email not found in token");
            }

            var existingUser = _userService.GetUserByEmail(userEmail);
            if (existingUser == null)
            {
                return NotFound("User not found");
            }

         
            var passwordHash = new PasswordHash();

            if (!passwordHash.VerifyPassword(model.CurrentPassword, existingUser.Password))
            {
                return Unauthorized("Current password is incorrect");
            }

            existingUser.Password = passwordHash.HashPassword(model.NewPassword);

            if (model.NewPassword != model.ConfirmNewPassword)
            {
                return BadRequest("New password and confirmation do not match");
            }

            if (model.NewPassword == model.CurrentPassword)
            {
                return BadRequest("New password cannot be the same as the current password");
            }

            // Password must contain at least 8 characters, one number, and one special character
            var passwordStrengthRegex = new Regex(@"^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$");
            if (!passwordStrengthRegex.IsMatch(model.NewPassword))
            {
                return BadRequest("New password does not meet the required strength criteria");
            }

            _userService.Update(existingUser);


            return Ok("Password Succesfully reset");
        }


        [HttpPost("ResetPassword")]
        public IActionResult ResetPassword(ResetPasswordModel request)
        {
            var userData = _forgotPasswordService.GetUserByToken(request.ResetToken);
            
            //Test if token is valid/expired
            if(userData.PasswordRecoveryTokenExpires < DateTime.Now || userData.PasswordRecoveryToken != request.ResetToken)
            {
                return BadRequest("Invalid Token");
            }
            try
            {
                _forgotPasswordService.ChangePassword(request, userData);
                
                return Ok("Password changed successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while updating the password: " + ex.Message);
            }
        }

        // To integrate on the Models folder OR user model file ??
        public class ChangePasswordModel
        {
            public string CurrentPassword { get; set; }
            public string NewPassword { get; set; }
            public string ConfirmNewPassword { get; set; }
        }


        #endregion


        
        #region ChangePicture
        [HttpPost("ChangePicture")]
        public IActionResult ChangePicture([FromForm] IFormFile newPicture)
        {
            // Log all claims for debugging
            var claims = User.Claims.ToList();
            foreach (var claim in claims)
            {
                Console.WriteLine($"Claim Type: {claim.Type}, Claim Value: {claim.Value}");
            }

            // Retrieve the user's email from the claims
            var userEmail = claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
            if (string.IsNullOrEmpty(userEmail))
            {
                return Unauthorized("User data not found.");
            }
            var userData = _userService.GetUserByEmail(userEmail);


            //Add uploaded profile picture to user ProfilePicture folder
            Ftp ftpService = new Ftp();

            string userPicturePath = "" + userData.Name + "/" + newPicture.FileName;
            ftpService.Upload(newPicture, userPicturePath);



            string base64String;
            using (var stream = newPicture.OpenReadStream())
            {
                using (var ms = new MemoryStream())
                {
                    stream.CopyTo(ms);
                    var fileBytes = ms.ToArray();
                    base64String = Convert.ToBase64String(fileBytes);
                    // Do something with the base64 string
                }
            }

            //Change user field in table ProfilePicture
            var updatePicture = new ProfilePicture
            {
                IdProfilePicture = userData.FkProfilePicture,
                FkIdUser = userData.IdUser,
                FileName = newPicture.FileName.Substring(0, newPicture.FileName.IndexOf(".")),
                FileType = newPicture.FileName.Substring(newPicture.FileName.IndexOf(".")+1),
                FilePath = userPicturePath,
                Base64 = "data:image" + ";base64," + base64String,
            };
            _profilePictureService.Update(updatePicture);


            return Ok("Profile picture updated sucessfully");
        }
        #endregion
    }
}
