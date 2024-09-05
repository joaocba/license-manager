import "react";
import PropTypes from "prop-types";
import { FaUser, FaDoorOpen } from "react-icons/fa6";
import { useNavigate, useLocation } from "react-router-dom";

const UserAvatarDropdown = ({ isOpen, onClose, handleLogout }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleNavigation = (path) => {
        onClose(); // Close the dropdown
        navigate(path);
    };

    return (
        <div className={`relative ${isOpen ? "" : "hidden"}`}>
            <div className="absolute right-0 w-48 p-2 mt-2 bg-white rounded-lg shadow-lg">
                <div className={`flex items-center px-4 py-2 text-gray-600 transition-colors duration-200 cursor-pointer hover:bg-sky-100 ${location.pathname === "/dashboard/profile" ? "bg-sky-100" : ""}`} onClick={() => handleNavigation("/dashboard/profile")}>
                    <FaUser className="mr-2" />
                    <span>Profile</span>
                </div>
                <div className="flex items-center px-4 py-2 text-gray-600 transition-colors duration-200 border-t cursor-pointer hover:bg-sky-100" onClick={handleLogout}>
                    <FaDoorOpen className="mr-2" />
                    <span>Sign Out</span>
                </div>
            </div>
        </div>
    );
};

UserAvatarDropdown.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    handleLogout: PropTypes.func.isRequired,
};

export default UserAvatarDropdown;
