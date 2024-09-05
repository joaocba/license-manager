using Microsoft.EntityFrameworkCore;
using project_main.Models;

namespace project_main.Repository
{
    public class UserPreferenceRepository : IUserPreferenceRepository
    {
        private readonly project_mainContext _context;
        public UserPreferenceRepository(project_mainContext context)
        {
            _context = context;
        }

        public List<UserPreference> GetAll()
        {
            using (var context = new project_mainContext())
            {
                var userPreferences = (from u in context.UserPreferences
                                       select new UserPreference
                                       {
                                           IdUser = u.IdUser,
                                           NotificationBillingApp = u.NotificationBillingApp,
                                           NotificationBillingEmail = u.NotificationBillingEmail,
                                           NotificationBillingSms = u.NotificationBillingSms,
                                           NotificationSystemApp = u.NotificationSystemApp,
                                           NotificationSystemEmail = u.NotificationSystemEmail,
                                           NotificationSystemSms = u.NotificationSystemSms,
                                           NotificationSecurityApp = u.NotificationSecurityApp,
                                           NotificationSecurityEmail = u.NotificationSecurityEmail,
                                           NotificationSecuritySms = u.NotificationSecuritySms,
                                           NotificationMessageApp = u.NotificationMessageApp,
                                           NotificationMessageEmail = u.NotificationMessageEmail,
                                           NotificationMessageSms = u.NotificationMessageSms
                                       }).ToList();

                return userPreferences;
            }
        }
        public UserPreference GetUserById(Guid id)
        {
            using (var context = new project_mainContext())
            {
                return context.UserPreferences.Where(u => u.IdUser == id).FirstOrDefault();
            }
        }
        public void Update(UserPreference userPreference)
        {
            using (var context = new project_mainContext())
            {
                context.UserPreferences.Update(userPreference);
                context.SaveChanges();
            }
        }

        public void Create(UserPreference userPreference)
        {
            using (var context = new project_mainContext())
            {
                context.UserPreferences.Add(userPreference);
                context.SaveChanges();
            }
        }
    }
}
