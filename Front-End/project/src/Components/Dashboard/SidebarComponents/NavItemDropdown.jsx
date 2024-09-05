import PropTypes from "prop-types";
import { Link, useLocation } from "react-router-dom";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const NavItemDropdown = ({ label, icon: Icon, isOpen, items, toggleDropdown, isDropdownOpen, isDropdownAnimating, onItemClick }) => {
    const location = useLocation();

    const isActive = items.some((item) => location.pathname === item.to);

    return (
        <div>
            <div className={`flex items-center justify-between ${isOpen ? "px-4" : "px-2"} py-2 transition-all duration-300 rounded text-gray-600 hover:bg-sky-600 hover:text-white cursor-pointer ${isActive ? "bg-sky-100" : ""}`} onClick={toggleDropdown}>
                <div className={`flex items-center ${isOpen ? "space-x-4" : "space-x-2"} ${isOpen ? "justify-start" : "justify-center"}`}>
                    <Icon className={`text-lg ${isOpen ? "" : "text-sm"}`} />
                    {isOpen && <span className={`${isOpen ? "opacity-100" : "opacity-0"} transition-opacity duration-300`}>{label}</span>}
                </div>
                {isOpen && (isDropdownOpen ? <FaChevronUp className="text-xs" /> : <FaChevronDown className="text-xs" />)}
            </div>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isDropdownAnimating ? "opacity-0" : "opacity-100"} ${isDropdownOpen ? "max-h-[300px]" : "max-h-0"}`}>
                <div className={`flex flex-col space-y-2 ${isOpen ? "pt-2 pl-4" : "pt-2 pl-2"}`}>
                    {items.map((item) => (
                        <Link key={item.label} to={item.to} className={`flex items-center py-2 px-4 text-gray-600 rounded transition-colors duration-200 hover:bg-sky-600 hover:text-white ${location.pathname === item.to ? "bg-sky-100" : ""}`} onClick={onItemClick}>
                            {item.icon && <item.icon className={`text-sm ${isOpen ? "mr-4" : "mr-2"}`} />}
                            {isOpen && <span>{item.label}</span>}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

NavItemDropdown.propTypes = {
    label: PropTypes.string.isRequired,
    icon: PropTypes.elementType.isRequired,
    isOpen: PropTypes.bool.isRequired,
    items: PropTypes.arrayOf(
        PropTypes.shape({
            to: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
            icon: PropTypes.elementType,
        })
    ).isRequired,
    toggleDropdown: PropTypes.func.isRequired,
    isDropdownOpen: PropTypes.bool.isRequired,
    isDropdownAnimating: PropTypes.bool.isRequired,
    onItemClick: PropTypes.func.isRequired,
};

export default NavItemDropdown;
