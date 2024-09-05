using project_main.Models;

namespace project_main.Service
{
    public interface IProfilePictureService
    {
        public List<ProfilePicture> GetAll();
        public void Update(ProfilePicture profilePicture);
        public ProfilePicture GetUserPictureByUserId(Guid id);
        public void Create(ProfilePicture profilePicture);
    }
}
