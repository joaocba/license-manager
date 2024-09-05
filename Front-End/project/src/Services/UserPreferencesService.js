class UserPreferencesService {
    constructor(httpClient) {
        this.httpClient = httpClient;
    }

    async getUserPreferences() {
        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            if (!token) {
                throw new Error('Token not found');
            }

            const response = await this.httpClient.get(
                `https://localhost:7116/api/UserPreference/GetByUserId`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error('Failed to fetch user preferences');
            }

            return response.json();
        } catch (error) {
            console.error("Error fetching user preferences:", error);
            throw error;
        }
    }

    async updateUserPreferences(preferences) {
        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            if (!token) {
                throw new Error('Token not found');
            }

            const response = await this.httpClient.post(
                `https://localhost:7116/api/UserPreference/Update`,
                preferences,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (!response.ok) {
                throw new Error('Failed to update user preferences');
            }

            return response.json();
        } catch (error) {
            console.error("Error updating user preferences:", error);
            throw error;
        }
    }
}

export default UserPreferencesService;
