class ModuleService {
    constructor(httpClient) {
        this.httpClient = httpClient;
    }

    async GetAll() {
        try {
            const response = await this.httpClient.get(
                "https://localhost:7116/api/Module/GetAll"
            );
            return response.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async Create(module) {
        try {
            const response = await this.httpClient.post(
                "https://localhost:7116/api/Module/Create",
                module
            );
            return response.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

export default ModuleService;
