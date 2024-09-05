using Microsoft.Extensions.Primitives;
using project_main.Models;

namespace project_main.Repository
{
    public interface IForgotPasswordRepository
    {
        public void SaveToken(User user);
        public project_main.Models.User CheckTokens(string token);
        public void ChangePassword(ResetPasswordModel requestData, User userData);
        public void MailSender(string email, string token, string subject);
        public User GetUserByToken(string token);
    }
}
