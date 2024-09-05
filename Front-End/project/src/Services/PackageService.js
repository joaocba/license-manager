import PackageFetchClient from "../FetchClients/PackageFetchClient";

class PackageService {
    constructor() {
        this.httpClient = PackageFetchClient;
    }

    async GetAllActive() {
        try {
            const response = await this.httpClient.get(
                "https://localhost:7116/api/Package/GetAllActive"
            );
            return response.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async Create(packages) {
        try {
            const response = await this.httpClient.post(
                "http://localhost:7116/api/Package/Create",
                packages
            );
            return response.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    // Get package prices
    async GetPackagePrices() {
        try {
            const response = await this.httpClient.get("https://localhost:7116/api/Package/GetPackagePrices");
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Failed to fetch package prices:", error);
            throw error;
        }
    }
}

export default PackageService;
