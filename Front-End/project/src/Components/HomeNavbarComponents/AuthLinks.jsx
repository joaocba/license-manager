/**
 * Renders the authentication links component for the navbar.
 */

import "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const AuthLinks = ({ loading, authenticated, userEmail, handleLogout }) => {
    const navLinkClasses = "px-2 py-1 text-lg text-gray-800 transition-colors duration-300 rounded-md hover:text-blue-500 hover:bg-blue-100";
    const buttonClasses = "relative px-4 py-2 text-lg transition-all duration-300 rounded-full";

    return (
        <div className="flex items-center space-x-6">
            <Link to="/pricing" className={navLinkClasses} style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Prices
            </Link>
            <a href="#" className={navLinkClasses} style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Contact us
            </a>
            {loading ? (
                <span>Loading...</span>
            ) : authenticated ? (
                <>
                    <span className={navLinkClasses}>{userEmail}</span>
                    <button className={navLinkClasses} onClick={handleLogout} style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        Logout
                    </button>
                </>
            ) : (
                <>
                    <Link to="/login" className={navLinkClasses} style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        Login
                    </Link>
                    <Link to="/register" className={`${buttonClasses} text-white bg-blue-600 hover:bg-blue-900`} style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        Get Started
                    </Link>
                </>
            )}
        </div>
    );
};

AuthLinks.propTypes = {
    loading: PropTypes.bool.isRequired,
    authenticated: PropTypes.bool.isRequired,
    userEmail: PropTypes.string.isRequired,
    handleLogout: PropTypes.func.isRequired,
};

export default AuthLinks;
