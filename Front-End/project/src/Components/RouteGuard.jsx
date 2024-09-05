import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import UserContext from "./Context/UserContext";

const RouteGuard = ({ element, allowedRoles }) => {
    const { user, loading } = useContext(UserContext);
    const location = useLocation();

    if (loading) return <div></div>;

    const isAuthenticated = !!user;
    const userRole = user?.role?.role1; // Get role name from user object

    // Check if user is authenticated
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} />;
    }

    // Check if user has the required role
    if (!allowedRoles.includes(userRole)) {
        return <Navigate to="/401" state={{ from: location, message: "Access Denied" }} />;
    }

    return element;
};

RouteGuard.propTypes = {
    element: PropTypes.element.isRequired,
    allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default RouteGuard;
