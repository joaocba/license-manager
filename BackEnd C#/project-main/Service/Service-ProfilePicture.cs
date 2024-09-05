using project_main.Models;
using project_main.Repository;

namespace project_main.Service
{
    public class ProfilePictureService : IProfilePictureService
    {
        private IProfilePictureRepository _profilePictureRepository;

        public ProfilePictureService(IProfilePictureRepository profilePictureRepository)
        {
            _profilePictureRepository = profilePictureRepository;
        }

        public List<ProfilePicture> GetAll()
        {
            return _profilePictureRepository.GetAll();
        }

        public ProfilePicture GetUserPictureByUserId(Guid id)
        {
            return _profilePictureRepository.GetUserPictureByUserId(id);
        }

        public void Update(ProfilePicture profilePicture)
        {
            _profilePictureRepository.Update(profilePicture);
        }

        public void Create(ProfilePicture profilePicture)
        {
            _profilePictureRepository.Create(profilePicture);
        }
    }
}
