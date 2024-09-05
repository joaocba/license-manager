import { Navigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import UserContext from "./Context/UserContext";
import DashboardLayout from "./Dashboard/DashboardLayout";
import DashboardLoader from "./Dashboard/DashboardLoader";
import "../css/index.css";
import "../css/dashboard.css";

const DashboardGateway = () => {
    const { loading, user } = useContext(UserContext);
    const [showLoader, setShowLoader] = useState(true);

    useEffect(() => {
        if (loading) {
            setShowLoader(true);
        } else {
            const delay = setTimeout(() => {
                setShowLoader(false);
            }, 3000);

            return () => clearTimeout(delay);
        }
    }, [loading]);

    if (loading || showLoader) {
        return <DashboardLoader />;
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    const userRole = user?.role?.role1;

    switch (userRole) {
        case "Client Admin":
            return <DashboardLayout />;
        case "Tech Admin":
            return <DashboardLayout />;
        case "Client User":
            return <DashboardLayout />;
        default:
            return <Navigate to="/error" />;
    }
};

export default DashboardGateway;
