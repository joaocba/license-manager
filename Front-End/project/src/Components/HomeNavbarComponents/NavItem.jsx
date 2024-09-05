import { useState, useRef } from "react";
import PropTypes from "prop-types";
import SubMenuBlock from "./SubMenuBlock";

const NavItem = ({ text, subMenuItems, isSidebar, closeSidebar, onSubMenuToggle }) => {
    const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
    const closeTimerRef = useRef();
    const submenuRef = useRef(null);

    const navLinkClasses = isSidebar ? "block px-4 py-2 text-lg text-gray-800 hover:bg-blue-100" : "relative px-2 py-1 text-lg text-gray-800 transition-colors duration-300 rounded-md hover:text-blue-500 hover:bg-blue-100";

    // Handle mouse enter and leave events for the submenu
    const handleMouseEnter = () => {
        clearTimeout(closeTimerRef.current);
        setIsSubMenuOpen(true);
        if (onSubMenuToggle) onSubMenuToggle(true);
    };

    const handleMouseLeave = () => {
        closeTimerRef.current = setTimeout(() => {
            setIsSubMenuOpen(false);
            if (onSubMenuToggle) onSubMenuToggle(false);
        }, 300);
    };

    // Handle toggling the submenu
    const handleToggleSubMenu = () => {
        setIsSubMenuOpen(!isSubMenuOpen);
    };

    const linkProps = isSidebar ? { onClick: closeSidebar } : {};

    return (
        <div className={isSidebar ? "" : "relative"} onMouseEnter={!isSidebar ? handleMouseEnter : null} onMouseLeave={!isSidebar ? handleMouseLeave : null}>
            <button className={`${navLinkClasses} flex items-center justify-between w-full`} style={{ fontFamily: "'Montserrat', sans-serif" }} {...linkProps} onClick={isSidebar ? handleToggleSubMenu : undefined}>
                <span>{text}</span>
                {subMenuItems && (
                    <svg className={`ml-2 transition-transform duration-300 ${isSubMenuOpen ? "rotate-180" : ""}`} width="14" height="9" viewBox="0 0 14 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1.64025 1.67773L7.00006 7.0001L12.3599 1.67773" stroke="currentColor" strokeWidth="2"></path>
                    </svg>
                )}
            </button>

            {subMenuItems && <SubMenuBlock isSubMenuOpen={isSubMenuOpen} subMenuItems={subMenuItems} isSidebar={isSidebar} submenuRef={submenuRef} closeSidebar={closeSidebar} />}
        </div>
    );
};

NavItem.propTypes = {
    text: PropTypes.string.isRequired,
    subMenuItems: PropTypes.array,
    isSidebar: PropTypes.bool,
    closeSidebar: PropTypes.func,
    onSubMenuToggle: PropTypes.func,
};

export default NavItem;
