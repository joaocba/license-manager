
using project_main.Models;
using MailKit.Net.Smtp;
using MailKit;
using MimeKit;
using MailKit.Security;
using System.Web;
using project_main.Helper;

namespace project_main.Repository
{
    public class ForgotPasswordRepository : IForgotPasswordRepository
    {
        private readonly project_mainContext _context;
        private readonly string _jwtSecret;

        public ForgotPasswordRepository(project_mainContext context, string jwtSecret)
        {
            _context = context;
            _jwtSecret = jwtSecret;
        }

        public void SaveToken(User user)
        {
            using (var context = new project_mainContext())
            {
                context.Users.Update(user);
                context.SaveChanges();
            }
        }

        public User CheckTokens(string token)
        {
            using (var context = new project_mainContext())
            {
                return context.Users.Where(u => u.PasswordRecoveryToken == token).FirstOrDefault();
            }
        }

        public void MailSender(string email, string token, string subject)
        {
            //Create a new instance of SmtpConfig
            SmtpConfig smtpConfig = new SmtpConfig();
            //Call values in table 'smtp_config' of DB to the instance
            using (var context = new project_mainContext())
            {
                smtpConfig = context.SmtpConfigs.FirstOrDefault();
            }

            //create a new mime messagem object which we are going to use to fill the message data
            MimeMessage message = new MimeMessage();

            //add sender info that will appear in the email message
            message.From.Add(new MailboxAddress("", smtpConfig.Sendusername));

            //add the receiver email address
            message.To.Add(MailboxAddress.Parse(email));

            //add the message subject from parameters
            message.Subject = subject;

            //add the message body as plain text the "plain" string passed to the TextPart indicates that its plain
            message.Body = new TextPart("plain")
            {
                Text = @"This is your requested email to change your password, click in the link below to change continue: " + "http://localhost:5173/ResetPassword/?token=" + HttpUtility.UrlEncode(token)
            };

            //create a new SMTP client
            SmtpClient client = new SmtpClient();

            try
            {
                //connect to the mail smtp server using port 587
                client.Connect(smtpConfig.Smtpserver, smtpConfig.Smtpserverport, SecureSocketOptions.StartTls);

                client.Authenticate(smtpConfig.Sendusername, smtpConfig.Sendpassword);
                client.Send(message);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
            finally
            {
                client.Disconnect(true);

                client.Dispose();
            }
        }

        public void ChangePassword(ResetPasswordModel requestData, User userData)
        {
            PasswordHash passwordHash = new PasswordHash();
            // Hash the password before storing it
            userData.Password = passwordHash.HashPassword(requestData.Password);

            userData.PasswordRecoveryToken = null;
            userData.PasswordRecoveryTokenExpires = null;

            using (var context = new project_mainContext())
            {
                context.Users.Update(userData);
                context.SaveChanges();
            }
        }

        public User GetUserByToken(string token)
        {
            using (var context = new project_mainContext())
            {
                return context.Users.Where(u => u.PasswordRecoveryToken == token).FirstOrDefault();
            }
        }
    }
}
