import "react";
import PropTypes from "prop-types";
import { Link, useLocation } from "react-router-dom";

const NavItem = ({ to, icon: Icon, label, isOpen, onClick }) => {
    const location = useLocation();
    const isActive = (location.pathname === to || location.pathname === to + "/all-transactions");

    return (
        <Link to={to} className={`flex items-center ${isOpen ? "px-4" : "px-2"} py-2 space-x-4 transition-all duration-300 rounded text-gray-600 hover:bg-sky-600 ${isActive && "bg-sky-100"}`} onClick={onClick}>
            <Icon className="text-lg" />
            {isOpen && <span className={`${isOpen ? "opacity-100 w-full" : "opacity-0 w-0"} transition-opacity duration-300 overflow-hidden`}>{label}</span>}
        </Link>
    );
};

NavItem.propTypes = {
    to: PropTypes.string.isRequired,
    icon: PropTypes.elementType.isRequired,
    label: PropTypes.string.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
};

export default NavItem;
