import { useState, useEffect, useRef } from "react";
import { FaGear, FaCircleQuestion } from "react-icons/fa6";
import { useNavigate, useLocation } from "react-router-dom";
import Logo from "../../Resources/_logo.png";
import NotificationsDropdown from "./TopBarComponents/NotificationsDropdown";
import MessagesDropdown from "./TopBarComponents/MessagesDropdown";
import UserAvatarDropdown from "./TopBarComponents/UserAvatarDropdown";
import PropTypes from "prop-types";

const TopBar = ({ user }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [messageOpen, setMessageOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();
    const [activeLink, setActiveLink] = useState(""); // State to track active link

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
        setNotificationOpen(false); // Close notification dropdown if open
        setMessageOpen(false); // Close message dropdown if open
    };

    const toggleNotificationDropdown = () => {
        setNotificationOpen(!notificationOpen);
        setMessageOpen(false); // Close message dropdown if open
        setDropdownOpen(false); // Close user dropdown if open
    };

    const toggleMessageDropdown = () => {
        setMessageOpen(!messageOpen);
        setNotificationOpen(false); // Close notification dropdown if open
        setDropdownOpen(false); // Close user dropdown if open
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setDropdownOpen(false);
            setNotificationOpen(false);
            setMessageOpen(false);
        }
    };

    const handleLogout = () => {
        // Clear any authentication tokens or user data
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        // Redirect to the home page
        navigate("/");
    };

    const handleNavigation = (path) => {
        setActiveLink(path); // Set active link state
        navigate(path); // Navigate programmatically to the selected path
        setDropdownOpen(false); // Close dropdown after navigation
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        setDropdownOpen(false);
        setNotificationOpen(false);
        setMessageOpen(false);
    }, [location]);

    return (
        <div className="flex items-center justify-between p-4 text-white">
            <div className="flex items-center space-x-4">
                <img src={Logo} alt="Logo" className="h-10 cursor-pointer" onClick={() => handleNavigation("/dashboard")} />
                <button className="flex items-center justify-center px-3 py-1.5 text-white transition-all duration-300 ease-in-out transform rounded-full shadow-md bg-gradient-to-r from-sky-500 to-sky-700 hover:from-sky-600 hover:to-sky-800">
                    <FaCircleQuestion className="text-lg md:mr-1.5" />
                    <span className="hidden text-sm md:inline">Support</span>
                </button>
            </div>
            <div className="flex items-center space-x-4">
                <NotificationsDropdown notificationOpen={notificationOpen} toggleNotificationDropdown={toggleNotificationDropdown} />
                <MessagesDropdown messageOpen={messageOpen} toggleMessageDropdown={toggleMessageDropdown} />
                <FaGear className="text-lg transition duration-200 cursor-pointer text-sky-600 hover:text-sky-500" title="Settings" onClick={() => handleNavigation("/dashboard/settings")} />
                <div className="relative">
                    <img src={user.profilePicture.base64} alt="User Avatar" className="w-10 h-10 transition-transform duration-200 transform rounded-full cursor-pointer hover:scale-105 hover:ring-2 hover:ring-blue-500" onClick={toggleDropdown} />
                    <UserAvatarDropdown isOpen={dropdownOpen} onClose={() => setDropdownOpen(false)} handleLogout={handleLogout} />
                </div>
            </div>
        </div>
    );
};

TopBar.propTypes = {
    user: PropTypes.object.isRequired,
};

export default TopBar;
