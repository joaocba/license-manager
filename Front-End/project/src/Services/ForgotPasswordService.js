class ForgotPassword {
    constructor(httpClient) {
        this.httpClient = httpClient;
    }


    async postEmail(data) {
        try {
            const response = await this.httpClient.post(
                "http://localhost:7116/api/User/ForgotPassword",
                data
            );
            return response.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async postPassword(data) {
        try {
            const response = await this.httpClient.post(
                "http://localhost:7116/api/User/ResetPassword",
                data
            );
            return response.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

export default ForgotPassword;