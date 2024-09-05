import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHouse } from "react-icons/fa6";
import PropTypes from "prop-types";

const Breadcrumbs = ({ currentPageTitle }) => {
    const location = useLocation();
    const pathnames = location.pathname.split("/").filter((x) => x);

    // Titles for the different paths (parents with childs) in the dashboard
    const pathTitles = {
        "/dashboard/user-manager": "User Manager",
        "/dashboard/client-manager": "Client Manager",
        "/dashboard/license-manager": "License Manager",
        "/dashboard/settings-manager": "Settings Manager",
    };

    const breadcrumbs = [{ path: "/dashboard", title: "Home" }];

    let fullPath = "";

    pathnames.forEach((segment, index) => {
        fullPath += `/${segment}`;

        if (index > 0) {
            breadcrumbs.push({
                path: fullPath,
                title: pathTitles[fullPath] || capitalizeFirstLetter(segment),
            });
        }
    });

    return (
        <nav aria-label="breadcrumb" className="flex items-center space-x-2">
            <Link to="/" className="text-gray-500 hover:text-gray-700">
                <FaHouse className="text-lg" />
            </Link>
            {breadcrumbs.map((breadcrumb, index) => (
                <React.Fragment key={breadcrumb.path}>
                    {index > 0 && <span className="text-gray-400">/</span>}
                    {index === breadcrumbs.length - 1 ? (
                        <span className="text-gray-600">{currentPageTitle || breadcrumb.title}</span>
                    ) : (
                        <Link to={breadcrumb.path} className="text-gray-500 hover:text-gray-700">
                            {breadcrumb.title}
                        </Link>
                    )}
                </React.Fragment>
            ))}
        </nav>
    );
};

const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

// Prop types validation
Breadcrumbs.propTypes = {
    currentPageTitle: PropTypes.string,
};

export default Breadcrumbs;
