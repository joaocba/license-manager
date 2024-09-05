import QuantityManagementFetchClient from "../FetchClients/QuantityManagementFetchClient";

class QuantityManagementService {
    constructor() {
        this.httpClient = QuantityManagementFetchClient;
    }

    async GetAll() {
        try {
            const response = await this.httpClient.get(
                "https://localhost:7116/api/QuantityManagement/GetAll"
            );
            return response.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async GetAllActive() {
        try {
            const response = await this.httpClient.get(
                "https://localhost:7116/api/QuantityManagement/GetAllActive"
            );
            return response.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async UpdateDiscounts(changes) {
        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            if (!token) {
                throw new Error('Token not found');
            }

            const response = await this.httpClient.post("https://localhost:7116/api/QuantityManagement/UpdateDiscounts", changes, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Failed to update Quantity Management');
            }
            return response.json();
        } catch (error) {
            console.error("Error updating Quantity Management:", error);
            throw error;
        }
    }
}

export default QuantityManagementService;
