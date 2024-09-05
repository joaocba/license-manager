using project_main.Models;

namespace project_main.Repository
{
    public interface IProfilePictureRepository
    {
        public List<ProfilePicture> GetAll();
        public void Update(ProfilePicture profilePicture);
        public ProfilePicture GetUserPictureByUserId(Guid id);
        public void Create(ProfilePicture profilePicture);
    }
}
