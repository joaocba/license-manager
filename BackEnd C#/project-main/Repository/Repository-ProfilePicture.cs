using project_main.Models;

namespace project_main.Repository
{
    public class ProfilePictureRepository : IProfilePictureRepository
    {
        private readonly project_mainContext _context;
        public ProfilePictureRepository(project_mainContext context)
        {
            _context = context;
        }

        public List<ProfilePicture> GetAll()
        {
            using (var context = new project_mainContext())
            {
                var profilePicture = (from u in context.ProfilePictures
                                   select new ProfilePicture
                                   {
                                       FkIdUser = u.FkIdUser,
                                       FileName = u.FileName,
                                       FileType = u.FileType,
                                       FilePath = u.FilePath,
                                       Base64 = u.Base64
                                   }).ToList();

                return profilePicture;
            }
        }
        public ProfilePicture GetUserPictureByUserId(Guid id)
        {
            using (var context = new project_mainContext())
            {
                return context.ProfilePictures.FirstOrDefault(u => u.FkIdUser == id);
            }
        }
        public void Update(ProfilePicture profilePicture)
        {
            using (var context = new project_mainContext())
            {
                context.ProfilePictures.Update(profilePicture);
                context.SaveChanges();
            }
        }

        public void Create(ProfilePicture profilePicture)
        {
            using (var context = new project_mainContext())
            {
                context.ProfilePictures.Add(profilePicture);
                context.SaveChanges();
            }
        }
    }
}
