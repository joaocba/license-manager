
import UserFetchClient from '../FetchClients/UserFetchClient';

class LicenseService {
    constructor() {
        this.httpClient = UserFetchClient;
    }

    // Get all licenses associated with the current user
    async getUserLicenses() {
        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            if (!token) {
                throw new Error('Token not found');
            }

            const response = await this.httpClient.get(
                `https://localhost:7116/api/Licenses/GetAllByUserId`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error('Failed to fetch user licenses');
            }

            return response.json();
        } catch (error) {
            console.error("Error fetching user licenses:", error);
            throw error;
        }
    }

    // Update the status of a license
    async licenseEnableDisable(idLicense, status) {
        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            if (!token) {
                throw new Error('Token not found');
            }

            const response = await this.httpClient.post(
                `https://localhost:7116/api/Licenses/EnableDisable`,
                { IdLicense: idLicense, Status: status },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (!response.ok) {
                throw new Error('Failed to update license status');
            }

            return response.json();
        } catch (error) {
            console.error("Error updating license status:", error);
            throw error;
        }
    }

    // Update the status of multiple licenses
    async multipleLicenseEnableDisable(licenses) {
        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            if (!token) {
                throw new Error('Token not found');
            }

            const response = await this.httpClient.post(
                `https://localhost:7116/api/Licenses/EnableDisableMultiple`,
                { Licenses: licenses },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (!response.ok) {
                throw new Error('Failed to update multiple license statuses');
            }

            return response.json();
        } catch (error) {
            console.error("Error updating multiple license statuses:", error);
            throw error;
        }
    }

    // Get all users associated with the current client
    async getUsersByClientId() {
        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            if (!token) {
                throw new Error('Token not found');
            }

            const response = await this.httpClient.get(
                `https://localhost:7116/api/Licenses/GetUsersByClientId`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }

            return response.json();
        } catch (error) {
            console.error("Error fetching users:", error);
            throw error;
        }
    }

    // Get all users associated with the current client
    async getNonAssignedUsersByClientId() {
        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            if (!token) {
                throw new Error('Token not found');
            }

            const response = await this.httpClient.get(
                `https://localhost:7116/api/Licenses/GetNonAssignedUsersByClientId`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }

            return response.json();
        } catch (error) {
            console.error("Error fetching users:", error);
            throw error;
        }
    }

    // Update the assigned user of a license
    async updateLicenseUser(idLicense, idUser) {
        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            if (!token) {
                throw new Error('Token not found');
            }

            const response = await this.httpClient.post(
                `https://localhost:7116/api/Licenses/UpdateLicense`,
                { idLicenses: idLicense, fkIdUser: idUser },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (!response.ok) {
                throw new Error('Failed to update license user');
            }

            return response.json();
        } catch (error) {
            console.error("Error updating license user:", error);
            throw error;
        }
    }

    // Unassign a license to a user
    async unassignUserLicense(idLicense) {
        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            if (!token) {
                throw new Error('Token not found');
            }

            const response = await this.httpClient.post(
                `https://localhost:7116/api/Licenses/UnassignUser`,
                { idLicense },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (!response.ok) {
                throw new Error('Failed to update license user');
            }

            return response.json();
        } catch (error) {
            console.error("Error updating license user:", error);
            throw error;
        }
    }

    // Assign a license to a user
    async assignUserLicense(licenseTypeId, fkIdUser) {
        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            if (!token) {
                throw new Error('Token not found');
            }

            const response = await this.httpClient.post(
                `https://localhost:7116/api/Licenses/AssignUser`,
                { LicenseType: licenseTypeId, FkIdUser: fkIdUser },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (!response.ok) {
                throw new Error('Failed to update license user');
            }

            return response.json();
        } catch (error) {
            console.error("Error updating license user:", error);
            throw error;
        }
    }

    // Send an invite to a user
    async sendInvite(email, licenseId) {
        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            if (!token) {
                throw new Error('Token not found');
            }

            const response = await this.httpClient.post(
                `https://localhost:7116/api/Licenses/SendInvite`,
                { email, licenseId },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (!response.ok) {
                throw new Error('Failed to send invite');
            }

            return response.json();
        } catch (error) {
            console.error("Error sending invite:", error);
            throw error;
        }
    }

    // Get license logs by client ID
    async getLicenseLogsByClientId() {
        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            if (!token) {
                throw new Error('Token not found');
            }

            const response = await this.httpClient.get(
                `https://localhost:7116/api/LicenseLogs/GetByClientId`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error('Failed to fetch license logs');
            }

            return response.json();
        } catch (error) {
            console.error("Error fetching license logs:", error);
            throw error;
        }
    }

    // Register a license log with client ID
    async registerLicenseLogWithClient(licenseLog) {
        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            if (!token) {
                throw new Error('Token not found');
            }

            const response = await this.httpClient.post(
                `https://localhost:7116/api/LicenseLogs/CreateWithClient`,
                licenseLog,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (!response.ok) {
                throw new Error('Failed to create license log');
            }

            return response.json();
        } catch (error) {
            console.error("Error creating license log:", error);
            throw error;
        }
    }

    // Get all clients
    async getClientsList() {
        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            if (!token) {
                throw new Error('Token not found');
            }

            const response = await this.httpClient.get(
                `https://localhost:7116/api/Licenses/GetClientsList`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error('Failed to fetch clients');
            }

            return response.json();
        } catch (error) {
            console.error("Error fetching clients:", error);
            throw error;
        }
    }

    // Get licenses by client ID
    async getLicensesDataByClientId(clientId) {
        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            if (!token) {
                throw new Error('Token not found');
            }

            // Encode the clientId to ensure it is URL-safe
            const encodedClientId = encodeURIComponent(clientId);

            // Make the GET request with clientId as a query parameter
            const response = await this.httpClient.get(
                `https://localhost:7116/api/Licenses/GetLicensesDataByClientId?clientId=${encodedClientId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (!response.ok) {
                throw new Error('Failed to fetch licenses');
            }

            return await response.json();
        } catch (error) {
            console.error("Error fetching licenses:", error);
            throw error;
        }
    }


}

export default LicenseService;
