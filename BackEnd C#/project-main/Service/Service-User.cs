using project_main.Models;
using project_main.Repository;
using project_main.ViewModel;

namespace project_main.Services
{
    public class UserService : IUserService
    {
        private IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public List<User> GetAll()
        {
            return _userRepository.GetAll();
        }

        public void Create(UserViewModel user)
        {
            _userRepository.Create(user);
        }

        public project_main.Models.User CheckUsers(User user)
        {
            return _userRepository.CheckUsers(user);
        }

        public bool EmailExists(string email)
        {
            return _userRepository.EmailExists(email);
        }

        public User GetUserByEmail(string email)
        {
            return _userRepository.GetUserByEmail(email);
        }

        public User GetUserByVerificationToken(string token)
        {
            return _userRepository.GetUserByVerificationToken(token);
        }

        public void updateUser(User user)
        {
            _userRepository.updateUser(user);
        }

        public string GenerateToken(User user)
        {
            return _userRepository.GenerateToken(user);
        }

        public void Update(User user)
        {
            _userRepository.Update(user);
        }
    }
}
