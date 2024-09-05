using project_main.Models;

namespace project_main.Service
{
    public interface IForgotPasswordService
    {
        public void SaveToken(User user);
        public project_main.Models.User CheckTokens(string token);
        public void ChangePassword(ResetPasswordModel requestData, User userData);
        public void MailSender(string email, string token, string subject);
        public User GetUserByToken(string token);
    }
}
