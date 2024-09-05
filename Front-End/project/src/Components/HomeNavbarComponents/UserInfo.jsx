/**
 * UserInfo component displays user information and logout button.
 */

import "react";
import PropTypes from "prop-types";

const UserInfo = ({ userEmail, handleLogout }) => {
    const navLinkClasses = "px-2 py-1 text-lg text-gray-800 transition-colors duration-300 rounded-md hover:text-blue-500 hover:bg-blue-100";

    return (
        <>
            <span className={navLinkClasses}>{userEmail}</span>
            <button className={navLinkClasses} onClick={handleLogout} style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Logout
            </button>
        </>
    );
};

UserInfo.propTypes = {
    userEmail: PropTypes.string.isRequired,
    handleLogout: PropTypes.func.isRequired,
};

export default UserInfo;
