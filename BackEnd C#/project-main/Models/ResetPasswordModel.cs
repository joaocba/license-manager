namespace project_main.Models
{
    public class ResetPasswordModel
    {
        public string ResetToken { get; set; }
        public string Password { get; set; }
        public string ConfirmPassword { get; set; }
    }
}
