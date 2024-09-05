const ProfilePictureFetchClient = {
    async get(url, options = {}) {
        return await fetch(url, options);
    },

    async post(url, body) {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const response = await fetch(url, {
            method: "POST",
            body: body,
            headers: {
                "Authorization": `Bearer ${token}`
            },
        });

        if (!response.ok) {
            throw new Error("There was an error. Please try again later.");
        }

        return response;
    },
};

export default ProfilePictureFetchClient;