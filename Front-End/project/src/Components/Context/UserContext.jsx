import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import UserService from "../../Services/UserService";
import UserFetchClient from "../../FetchClients/UserFetchClient";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem("token") || sessionStorage.getItem("token");
            if (token) {
                try {
                    const userService = new UserService(UserFetchClient);
                    const userData = await userService.getUserData(token);
                    setUser(userData);
                } catch (error) {
                    console.error("Error fetching user data:", error);
                    setUser(null);
                }
            }
            setLoading(false);
        };

        fetchUserData();
    }, []);

    return <UserContext.Provider value={{ user, setUser, loading }}>{children}</UserContext.Provider>;
};

UserProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default UserContext;
