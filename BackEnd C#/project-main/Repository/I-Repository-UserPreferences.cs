using project_main.Models;

namespace project_main.Repository
{
    public interface IUserPreferenceRepository
    {
        public List<UserPreference> GetAll();
        public void Update(UserPreference userPreference);
        public UserPreference GetUserById(Guid id);
        public void Create(UserPreference userPreference);
    }
}
