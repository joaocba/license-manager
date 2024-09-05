using project_main.Models;
using project_main.Repository;

namespace project_main.Service
{
    public class UserPreferenceService : IUserPreferenceService
    {
        private IUserPreferenceRepository _userPreferenceRepository;

        public UserPreferenceService(IUserPreferenceRepository userPreferenceRepository)
        {
            _userPreferenceRepository = userPreferenceRepository;
        }

        public List<UserPreference> GetAll()
        {
            return _userPreferenceRepository.GetAll();
        }

        public UserPreference GetUserById(Guid id)
        {
            return _userPreferenceRepository.GetUserById(id);
        }

        public void Update(UserPreference userPreference)
        {
            _userPreferenceRepository.Update(userPreference);
        }

        public void Create(UserPreference userPreference)
        {
            _userPreferenceRepository.Create(userPreference);
        }
    }
}
