const ClientFetchClient = {
    async get(url, options = {}) {
        return await fetch(url, options);
    },

    async post(url, body) {
        const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("There was an error. Please try again later.");
        }

        return response;
    },
};

export default ClientFetchClient;