import { useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { FaHouse, FaUserGear, FaUsers, FaCreditCard, FaAngleLeft, FaAngleRight, FaKey, FaGear, FaGlobe, FaClipboardList, FaWrench, FaDollarSign, FaBox } from "react-icons/fa6";
import NavItem from "./SidebarComponents/NavItem";
import NavItemDropdown from "./SidebarComponents/NavItemDropdown";
import UserContext from "../Context/UserContext";

const Sidebar = ({ isOpen, toggleSidebar, toggleDropdown, isDropdownOpen }) => {
    const { user } = useContext(UserContext);
    const [shouldCollapse, setShouldCollapse] = useState(isOpen);
    const [isDropdownAnimating, setIsDropdownAnimating] = useState(false);
    const isSmallDevice = window.innerWidth < 768;

    useEffect(() => {
        if (!isOpen && isDropdownOpen) {
            setIsDropdownAnimating(true);
            setTimeout(() => setShouldCollapse(false), 300);
        } else {
            setShouldCollapse(isOpen);
            if (isOpen) {
                setIsDropdownAnimating(false);
            }
        }
    }, [isOpen, isDropdownOpen]);

    const handleLinkClick = () => {
        if (isSmallDevice && isOpen) {
            toggleSidebar();
        }
    };

    const handleDropdownItemClick = () => {
        if (isSmallDevice) {
            toggleSidebar();
        }
    };

    const userRole = user?.role?.role1;

    const navItems = [
        /* Order here reflects descending display order on sidebar */
        { to: "/dashboard", icon: FaHouse, label: "Home", roles: ["Client User", "Client Admin", "Tech Admin"] },
        { to: "/dashboard/user-manager", icon: FaUserGear, label: "User Manager", roles: ["Tech Admin"] },
        { to: "/dashboard/client-manager", icon: FaUsers, label: "Client Manager", roles: ["Tech Admin"] },
        { to: "/dashboard/package-manager", icon: FaBox, label: "Package Manager", roles: ["Tech Admin"] },
        { to: "/dashboard/license-manager", icon: FaKey, label: "License Manager", roles: ["Client Admin"] },
        { to: "/dashboard/billing", icon: FaCreditCard, label: "Billing", roles: ["Client Admin"] },
        { to: "/dashboard/license-inspector", icon: FaClipboardList, label: "License Inspector", roles: ["Tech Admin"] },
    ];

    const settingsManagerItems = [
        { to: "/dashboard/settings-manager/global", label: "Global Settings", icon: FaGlobe, roles: ["Tech Admin"] },
        { to: "/dashboard/settings-manager/license", label: "License Settings", icon: FaWrench, roles: ["Tech Admin"] },
        { to: "/dashboard/settings-manager/billing", label: "Billing Settings", icon: FaDollarSign, roles: ["Tech Admin"] },
    ];

    return (
        <div className="flex h-full">
            <div className={`flex flex-col h-full ${shouldCollapse ? (isOpen ? "md:w-64 w-screen" : "w-16") : "w-16"} transition-width duration-300 ease-in-out dashboard-sidebar-nav rounded-tr-lg shadow-lg overflow-y-auto custom-scrollbar`}>
                <div className="flex items-center p-4 border-b">
                    <div className={`flex ${isOpen ? "w-full" : "w-16"} items-center ${isOpen ? "justify-start" : "justify-center"} transition-all duration-300`}>
                        {isOpen && <div className="ml-4 text-sm text-gray-400">Menu</div>}
                        <button onClick={toggleSidebar} className="ml-auto mr-2 text-gray-500 focus:outline-none">
                            {isOpen ? <FaAngleLeft className="text-lg" /> : <FaAngleRight className="text-lg" />}
                        </button>
                    </div>
                </div>
                <nav className="flex flex-col p-4 space-y-2 border-b dashboard-sidebar-nav-items">
                    {navItems
                        .filter((item) => item.roles.includes(userRole))
                        .map((item) => (
                            <NavItem key={item.label} to={item.to} icon={item.icon} label={item.label} isOpen={isOpen} onClick={handleLinkClick} />
                        ))}
                    {userRole === "Tech Admin" && <NavItemDropdown label="Settings Manager" icon={FaGear} isOpen={isOpen} items={settingsManagerItems} toggleDropdown={toggleDropdown} isDropdownOpen={isDropdownOpen} isDropdownAnimating={isDropdownAnimating} onItemClick={handleDropdownItemClick} />}
                </nav>
                <nav className="flex flex-col p-4 space-y-2 dashboard-sidebar-nav-items">{isOpen && <button className="px-6 py-2 text-white transition-all duration-300 ease-in-out transform rounded-full shadow-md bg-gradient-to-r from-sky-500 to-sky-700 hover:from-sky-600 hover:to-sky-800 hover:scale-105">Access App</button>}</nav>
            </div>
        </div>
    );
};

Sidebar.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    toggleSidebar: PropTypes.func.isRequired,
    toggleDropdown: PropTypes.func.isRequired,
    isDropdownOpen: PropTypes.bool.isRequired,
};

export default Sidebar;
