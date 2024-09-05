# License Manager Dashboard

This project, developed as part of my internship for the Citeforma .NET developer course certification, is a License Manager Dashboard. It enables clients to manage licenses for a proprietary ERP software web application. The dashboard supports role-based access for clients, regular users, and technical administrators, each with tailored features to streamline license management, billing, and platform administration.

### Important notice:
This is part of a larger ERP software web application. The code provided here represents the similar components code I was directly involved in developing during my internship. **Please note that the available files do not represent the real andl final runnable application code** as this repository contains only the code specific to my contributions. To run the full application, other project components would need to be integrated.

## Video Presentation

[![IMAGE ALT TEXT HERE](https://img.youtube.com/vi/h3iOI6brIro/0.jpg)](https://www.youtube.com/watch?v=h3iOI6brIro)

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

**User Dashboard**
![User Dashboard](https://github.com/joaocba/outsystems_expenses-manager-app/blob/main/screenshots/User_View_Dashboard.png?raw=true)


## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
