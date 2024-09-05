using project_main.Models;

namespace project_main.Service
{
    public interface IUserPreferenceService
    {
        public List<UserPreference> GetAll();
        public void Update(UserPreference userPreference);
        public UserPreference GetUserById(Guid id);
        public void Create(UserPreference userPreference);
    }
}
