# License Manager Dashboard

This project, developed as part of my internship for the Citeforma .NET developer course certification, is a License Manager Dashboard. It enables clients to manage licenses for a proprietary ERP software web application. The dashboard supports role-based access for clients, regular users, and technical administrators, each with tailored features to streamline license management, billing, and platform administration.

### Important notice:
This project is part of a larger ERP software web application. The code provided here represents the components I was directly involved in developing during my internship so please note that the available files may not represent the complete runnable application as this repository contains only the code specific to my contributions. To run the full application, other project components would need to be integrated.

## Video Presentation

[![Video Presentation](https://img.youtube.com/vi/7z-pDWiCJIw/0.jpg)](https://www.youtube.com/watch?v=7z-pDWiCJIw)

## Features

### 1. **Client Dashboard**
- **License Management**:
  - Purchase licenses (types: Basic, Medium, Pro), each offering a specific package of ERP modules.
  - Upgrade or downgrade licenses, with automatic payment adjustments or wallet refunds for downgrades.
  - Enable or disable licenses temporarily without unassigning users.
  - Assign or unassign licenses to users, including bulk actions for multiple licenses.
  - View detailed information for each license, including type, expiration, and assigned users.
  - Monitor non-assigned licenses and expired licenses in separate lists.

- **User Invitations**:
  - Invite users via email to access specific licenses.
  - Manage user assignments directly from the license panel.

- **Billing and Payments**:
  - Simulate license pricing and view detailed summaries before confirming transactions.
  - Track wallet credits (from downgrades or other refunds) and default payment methods.
  - Access a full transaction history and billing records.

- **Activity Tracking**:
  - View comprehensive logs for all actions performed on the license manager panel, with filters for specific events and time ranges.

### 2. **Tech Admin Dashboard**
- **License Inspector**:
  - Inspect details of all licenses across the platform, with filters and search options for efficient navigation.

- **User Management**:
  - Administer users across the platform, with options for creating, editing, and assigning roles.

- **Package Manager**:
  - Manage the available ERP software modules within each license package, and adjust settings as necessary.

- **Platform Settings**:
  - Configure platform-wide settings, including:
    - General settings: language, time, maintenance options.
    - License settings: base prices, quantity-based discounts, temporarily disable licenses for specific clients or companies.
    - Payment settings: available payment methods, invoice templates, and transaction settings.

### 3. **Regular User Dashboard**
- **License Overview**:
  - View metrics for the license(s) assigned to the user, including type, usage, and expiration date.
  
- **Profile Management**:
  - Manage personal account settings, including password, notification preferences, and account details.

- **Notifications & Messages**:
  - Receive and review platform notifications and messages.

## Project Architecture

### Frontend
- **ReactJs**: A fully responsive, dynamic, and fluid UI designed to work seamlessly across all device types. Tailored dashboards are rendered based on the user's role (Client, Tech Admin, Regular User).

### Backend
- **ASP.NET with Controller-Based APIs**: 
  - Manages authentication, authorization, and all core business logic, including license actions, payments, and user management.

## Screenshots

**User Dashboard**
![User Dashboard](https://github.com/joaocba/outsystems_expenses-manager-app/blob/main/screenshots/User_View_Dashboard.png?raw=true)


## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
