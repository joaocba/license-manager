using Microsoft.EntityFrameworkCore.Metadata;
using project_main.Models;
using System.Security.Cryptography.X509Certificates;

namespace project_main.ViewModel
{
    public class UserViewModel
    {
        public User User { get; set; } = new User();
        public Client Client { get; set; } = new Client();
        public UserPreference UserPreference { get; set; } = new UserPreference();
        public bool emailNewsletter { get; set; }
    }
}
