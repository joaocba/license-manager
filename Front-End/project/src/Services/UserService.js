
class UserService {
    constructor(httpClient) {
        this.httpClient = httpClient;
    }

    async GetAll() {
        try {
            const response = await this.httpClient.get(
                "https://localhost:7116/api/User/GetAll"
            );
            return response.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async Create(user) {
        try {
            const response = await this.httpClient.post(
                "https://localhost:7116/api/User/Create",
                user
            );
            return response.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async verifyAccount(email, name, token, request) {
        try {
            const response = await this.httpClient.get(
                "https://localhost:7116/api/User/VerifyAccount",
                name, token, email, request
            );
            return response.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async Login(credentials) {
        try {
            const response = await this.httpClient.post(
                "https://localhost:7116/api/User/Login",
                credentials
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Login failed");
            }

            const { token } = await response.json();
            return token; // Return the JWT token
        } catch (error) {
            throw error;
        }
    }

    async getUserData(token) {
        try {
            const response = await this.httpClient.get(
                "https://localhost:7116/api/User/GetData",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch user data");
            }

            return response.json();
        } catch (error) {
            throw error;
        }
    }

    async updateUser(changes) {
        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            if (!token) {
                throw new Error('Token not found');
            }

            const response = await this.httpClient.post("https://localhost:7116/api/User/Update", changes, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to update user');
            }
            return response.json();
        } catch (error) {
            console.error("Error updating user:", error);
            throw error;
        }
    }

    async changePassword(changes) {
        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            if (!token) {
                throw new Error('Token not found');
            }

            const response = await this.httpClient.post("https://localhost:7116/api/User/ChangePassword", changes, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to change password');
            }
            return response.json();
        } catch (error) {
            console.error("Error changing password:", error);
            throw error;
        }
    }

    async changePicture(formData) {
        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            if (!token) {
                throw new Error('Token not found');
            }

            const response = await this.httpClient.post("https://localhost:7116/api/User/ChangePicture", formData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to update picture');
            }
            return response.json();
        } catch (error) {
            console.error("Error updating picture:", error);
            throw error;
        }
    }
}


export default UserService;
