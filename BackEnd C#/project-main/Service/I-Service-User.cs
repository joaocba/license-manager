using project_main.Models;
using project_main.ViewModel;

namespace project_main.Services
{
    public interface IUserService
    {
        public List<User> GetAll();
        public void Create(UserViewModel user);
        public project_main.Models.User CheckUsers(User user);
        public bool EmailExists(string email);
        public User GetUserByEmail(string email);
        public User GetUserByVerificationToken(string token);
        public void updateUser(User user);
        public string GenerateToken(User user);
        public void Update(User user);
    }
}