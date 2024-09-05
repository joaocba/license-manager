using project_main.Models;
using project_main.Repository;

namespace project_main.Service
{
    public class ForgotPasswordService : IForgotPasswordService
    {
        private IForgotPasswordRepository _forgotPasswordRepository;

        public ForgotPasswordService(IForgotPasswordRepository forgotPasswordRepository)
        {
            _forgotPasswordRepository = forgotPasswordRepository;
        }

        public void SaveToken(User user)
        {
            _forgotPasswordRepository.SaveToken(user);
        }

        public project_main.Models.User CheckTokens(string token)
        {
            return _forgotPasswordRepository.CheckTokens(token);
        }

        public void ChangePassword(ResetPasswordModel requestData, User userData)
        {
            _forgotPasswordRepository.ChangePassword(requestData, userData);
        }

        public void MailSender(string email, string token, string subject)
        {
            _forgotPasswordRepository.MailSender(email, token, subject);
        }

        public User GetUserByToken(string token)
        {
            return _forgotPasswordRepository.GetUserByToken(token);
        }
    }
}
