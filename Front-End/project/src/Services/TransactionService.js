class TransactionService {
    constructor(httpClient) {
        this.httpClient = httpClient;
    }
    async getBalance(clientId) {
        try {
            const response = await this.httpClient.get(
                `https://localhost:7116/api/Transaction/GetCredit?clientId=${clientId}`
            );

            if (!response.ok) {
                throw new Error("Failed to fetch data");
            }

            return response.json();
        } catch (error) {
            throw error;
        }
    }

    async getTransactions() {
        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            if (!token) {
                throw new Error('Token not found');
            }

            const response = await this.httpClient.get(
                `https://localhost:7116/api/Transaction/GetTransactionsByClient`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error('Failed to fetch transactions');
            }

            return response.json();
        } catch (error) {
            console.error("Error fetching transactions:", error);
            throw error;
        }
    }

    async cancelTransaction(id) {
        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            if (!token) {
                throw new Error('Token not found');
            }

            const response = await this.httpClient.post(
                `https://localhost:7116/api/Transaction/CancelTransaction`,
                { id },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            )

            if (!response.ok) {
                throw new Error('Failed to update license status');
            }

            return response.json();
        }
        catch (error) {
            console.error("Error canceling transaction:", error);
            throw error;
        }

    }

    async createTransaction(transaction) {
        console.log(transaction)
        try {
            const response = await this.httpClient.post(
                "https://localhost:7116/api/Transaction/Create",
                transaction
            );
            if (!response.ok) {
                throw new Error('Failed to create transaction');
            }
            return response.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

}

export default TransactionService;