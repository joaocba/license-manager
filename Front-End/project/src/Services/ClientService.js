class ClientService {
    constructor(httpClient) {
        this.httpClient = httpClient;
    }

    async GetAll() {
        try {
            const response = await this.httpClient.get(
                "https://localhost:7116/api/Client/GetAll"
            );
            return response.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async GetClientInfo() {
        const idLicense = localStorage.getItem("idLicense") || sessionStorage.getItem("idLicense")
        try {
            const response = await this.httpClient.get(
                "https://localhost:7116/api/Client/GetClientInfo?idLicense=" + idLicense,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            return await response.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async SuspendClient(client) {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token")
        if (!token) {
            throw new Error('Token not found');
        }

        try {
            const response = await this.httpClient.post(
                "https://localhost:7116/api/Client/SuspendClient", client,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (!response.ok) {
                throw new Error('Failed to suspend Client');
            }

            return await response.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

export default ClientService;