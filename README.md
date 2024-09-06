# License Manager Dashboard

This project, developed as part of my internship for the Citeforma .NET developer course certification, is a License Manager Dashboard. It enables clients to manage licenses for a proprietary ERP software web application. The dashboard supports role-based access for clients, regular users, and technical administrators, each with tailored features to streamline license management, billing, and platform administration.

### Important notice:
This is part of a larger ERP software web application. The code provided here represents the similar components code I was directly involved in developing during my internship. **Please note that the available files do not represent the real and final runnable application code** as this repository contains only the code specific to my contributions.

### Tech Stack
![React](https://img.shields.io/badge/ReactJs-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![C#](https://img.shields.io/badge/C%23-239120?style=for-the-badge&logo=c-sharp&logoColor=white)
![ASP.NET](https://img.shields.io/badge/ASP.NET-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)
![SQL Server](https://img.shields.io/badge/Microsoft%20SQL%20Server-CC2927?style=for-the-badge&logo=microsoft%20sql%20server&logoColor=white)

## Video Presentation

[![Video Demo](https://img.youtube.com/vi/h3iOI6brIro/0.jpg)](https://www.youtube.com/watch?v=h3iOI6brIro)

## Features

### General Features:
- **Responsive UI/UX**: A dynamic and fluid interface that adapts to various screen sizes and user roles.
- **Authentication System**: 
  - Login system with role-based dashboard rendering.
  - Account creation and password recovery system.
- **Home Page with Metrics**: Summary cards and key performance indicators tailored to each user’s role.
- **Role-Based Dashboards**: Rendered based on user type (Client, Tech Admin, or Regular User).

### 1. **Client Dashboard**
- **License Management**:
  - Purchase licenses of different types (Basic, Medium, Pro), each offering a specific package of ERP software modules.
  - Upgrade or downgrade licenses with automatic calculations for payment or refund (refunds added to wallet credits).
  - Enable or disable licenses temporarily without unassigning users.
  - Assign or unassign licenses to users, with bulk actions for handling multiple licenses.
  - View license metrics, including total and remaining licenses, type, expiration, and assigned users.
  - Separate panels for non-assigned licenses and expired licenses, with the option to manage them.

- **User Invitations**:
  - Invite users via email to use specific licenses.
  - Manage user assignments from the license manager panel.

- **Billing and Payments**:
  - Simulate license pricing with detailed cost summaries for purchases or upgrades.
  - Track wallet credits, default payment methods, and transaction records.
  - Access transaction history and billing records, with detailed payment options and logs.

- **Activity Tracking**:
  - View logs and metrics for all license-related actions.
  - Filter logs by event type, date, or other parameters to monitor specific activities.

### 2. **Tech Admin Dashboard** (Platform Administrator)
- **License Inspector**:
  - Inspect and filter details of all licenses across clients and companies.
  - Temporarily disable specific licenses for certain clients or companies.

- **User Management**:
  - Administer platform-wide user management, including adding, editing, or assigning roles.

- **Package Manager**:
  - Manage the ERP software modules associated with each license package, including modifying and updating settings.

- **Platform Settings**:
  - Configure general platform settings (e.g., language, time, maintenance options).
  - Adjust license settings (e.g., base prices, discounts for bulk purchases, disable/enable licenses for specific clients).
  - Manage payment settings (e.g., available payment methods, invoice templates).

### 3. **Regular User Dashboard** (Invited by Client)
- **License Overview**:
  - View the license(s) assigned to the user, including license type, usage, and expiration.
  
- **Profile Management**:
  - Manage account details such as passwords, notification preferences, and other personal settings.

- **Notifications & Messages**:
  - Receive platform-wide notifications and messages from administrators or clients.

## Project Architecture

### Frontend
- **ReactJs**: A fully responsive, dynamic UI, with tailored dashboards for clients, technical administrators, and regular users.

### Backend
- **ASP.NET with Controller-Based APIs**: 
  - Handles all core business logic, including authentication, license management, payments, and user roles.

## Screenshots

**Login, Sign-Up and Forgot Password**

![Login](https://github.com/joaocba/license-manager/blob/main/screenshots/login.png?raw=true)
![Sign-Up](https://github.com/joaocba/license-manager/blob/main/screenshots/sign_up.png?raw=true)
![Forgot Password](https://github.com/joaocba/license-manager/blob/main/screenshots/forgot_password.png?raw=true)

**Client Dashboard**

![Client Dashboard](https://github.com/joaocba/license-manager/blob/main/screenshots/client_dashboard_license_manager_alerts.png?raw=true)
![Client Dashboard](https://github.com/joaocba/license-manager/blob/main/screenshots/client_dashboard_license_manager.png?raw=true)
![Client Dashboard](https://github.com/joaocba/license-manager/blob/main/screenshots/client_dashboard_license_manager_invite.png?raw=true)
![Client Dashboard](https://github.com/joaocba/license-manager/blob/main/screenshots/client_dashboard_license_manager_upgrade_single.png?raw=true)
![Client Dashboard](https://github.com/joaocba/license-manager/blob/main/screenshots/client_dashboard_license_manager_downgrade_bulk.png?raw=true)
![Client Dashboard](https://github.com/joaocba/license-manager/blob/main/screenshots/client_dashboard_license_manager_logs.png?raw=true)
![Client Dashboard](https://github.com/joaocba/license-manager/blob/main/screenshots/client_dashboard_transactions.png?raw=true)
![Client Dashboard](https://github.com/joaocba/license-manager/blob/main/screenshots/client_dashboard_transactions_all.png?raw=true)
![Client Dashboard](https://github.com/joaocba/license-manager/blob/main/screenshots/dashboard_responsive_small.png?raw=true)

**Tech Admin (TA) Dashboard**
![TA Dashboard](https://github.com/joaocba/license-manager/blob/main/screenshots/ta_dashboard_home.png?raw=true)
![TA Dashboard](https://github.com/joaocba/license-manager/blob/main/screenshots/ta_dashboard_license_inspector.png?raw=true)
![TA Dashboard](https://github.com/joaocba/license-manager/blob/main/screenshots/ta_dashboard_settings_manager.png?raw=true)
![TA Dashboard](https://github.com/joaocba/license-manager/blob/main/screenshots/ta_dashboard_settings_manager_global.png?raw=true)
![TA Dashboard](https://github.com/joaocba/license-manager/blob/main/screenshots/ta_dashboard_settings_manager_license.png?raw=true)
![TA Dashboard](https://github.com/joaocba/license-manager/blob/main/screenshots/ta_dashboard_settings_manager_billing.png?raw=true)
![TA Dashboard](https://github.com/joaocba/license-manager/blob/main/screenshots/ta_dashboard_responsive_small_sidebar_open.png?raw=true)
![TA Dashboard](https://github.com/joaocba/license-manager/blob/main/screenshots/ta_dashboard_responsive_small.png?raw=true)

**Invited User Dashboard**
![User Dashboard](https://github.com/joaocba/license-manager/blob/main/screenshots/user_dashboard_home_full.png?raw=true)
![User Dashboard](https://github.com/joaocba/license-manager/blob/main/screenshots/user_dashboard_home_messages.png?raw=true)
![User Dashboard](https://github.com/joaocba/license-manager/blob/main/screenshots/user_dashboard_home_notifications.png?raw=true)
![User Dashboard](https://github.com/joaocba/license-manager/blob/main/screenshots/user_dashboard_home_profile.png?raw=true)

**Other Screens**

![Dashboard Loader](https://github.com/joaocba/license-manager/blob/main/screenshots/dashboard_loader.png?raw=true)
![401](https://github.com/joaocba/license-manager/blob/main/screenshots/dashboard_401.png?raw=true)
![Homepage Navbar](https://github.com/joaocba/license-manager/blob/main/screenshots/home_menu.png?raw=true)

**ERP Web Application with enhanced UI**
![ERP](https://github.com/joaocba/license-manager/blob/main/screenshots/app/app_backoffice_menu.png?raw=true)
![ERP](https://github.com/joaocba/license-manager/blob/main/screenshots/app/app_lead_create_full.png?raw=true)
![ERP](https://github.com/joaocba/license-manager/blob/main/screenshots/app/app_shortcuts_create.png?raw=true)
![ERP](https://github.com/joaocba/license-manager/blob/main/screenshots/app/app_shortcuts_edit.png?raw=true)
![ERP](https://github.com/joaocba/license-manager/blob/main/screenshots/app/app_support_create_ticket_full.png?raw=true)
![ERP](https://github.com/joaocba/license-manager/blob/main/screenshots/app/app_responsive_small_screen.png?raw=true)
![ERP](https://github.com/joaocba/license-manager/blob/main/screenshots/app/app_responsive_small_screen_sidebar_open.png?raw=true)


## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
