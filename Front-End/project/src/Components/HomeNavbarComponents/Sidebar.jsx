import "react";
import PropTypes from "prop-types";
import NavItem from "./NavItem";

const Sidebar = ({ isOpen, closeSidebar, authenticated, handleLogout, userEmail, modules }) => {
    const sidebarClasses = `fixed top-0 left-0 w-full h-full bg-white shadow-lg transform ${isOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out z-50`;

    return (
        <div className={sidebarClasses} aria-label="Sidebar Menu">
            <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
                <button className="text-gray-800 focus:outline-none" onClick={closeSidebar} aria-label="Close Sidebar">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
            <div className="flex flex-col p-4 space-y-4">
                <NavItem text="Home" isSidebar={true} closeSidebar={closeSidebar} />
                <NavItem text="Products" subMenuItems={modules} isSidebar={true} closeSidebar={closeSidebar} />
                <NavItem text="Teams" isSidebar={true} closeSidebar={closeSidebar} />
                <NavItem text="Platform" isSidebar={true} closeSidebar={closeSidebar} />
                <NavItem text="Resources" isSidebar={true} closeSidebar={closeSidebar} />
                <NavItem text="Prices" isSidebar={true} closeSidebar={closeSidebar} />
                <NavItem text="Contact us" isSidebar={true} closeSidebar={closeSidebar} />
                {authenticated ? (
                    <>
                        <span className="block px-4 py-2 text-gray-800">{userEmail}</span>
                        <button
                            className="block px-4 py-2 text-lg text-gray-800 hover:bg-blue-100"
                            onClick={() => {
                                handleLogout();
                                closeSidebar();
                            }}
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <NavItem text="Login" isSidebar={true} closeSidebar={closeSidebar} />
                        <NavItem text="Get Started" isSidebar={true} closeSidebar={closeSidebar} />
                    </>
                )}
            </div>
        </div>
    );
};

Sidebar.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    closeSidebar: PropTypes.func.isRequired,
    authenticated: PropTypes.bool.isRequired,
    handleLogout: PropTypes.func.isRequired,
    userEmail: PropTypes.string.isRequired,
    modules: PropTypes.array.isRequired, // New prop type
};

export default Sidebar;
