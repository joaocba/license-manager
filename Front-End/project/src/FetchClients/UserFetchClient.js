const UserFetchClient = {
    async get(url, options = {}) {
        return await fetch(url, options);
    },

    async post(url, body) {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        });

        if (!response.ok) {
            if (response.status === 409) {
                throw new Error("Conflict: Email already exists");
            } else {
                throw new Error("There was an error. Please try again later.");
            }
        }

        return response;
    },
};

export default UserFetchClient;