import "react";
import PropTypes from "prop-types";
import Breadcrumbs from "./Breadcrumbs";
import { useLocation } from "react-router-dom";

const Header = ({ title, subtitle }) => {
    const location = useLocation();

    // Check if the current path is not /dashboard
    const shouldShowBreadcrumbs = location.pathname !== "/dashboard" && location.pathname !== "/dashboard/user-home";

    return (
        <>
            {shouldShowBreadcrumbs && (
                <div className="mb-2">
                    <Breadcrumbs currentPageTitle={title} />
                </div>
            )}

            <div className="py-8 mb-6 border-b-2">
                <h1 className="text-3xl font-bold text-gray-600 md:text-4xl">{title}</h1>
                {subtitle && <p className="mt-2 text-gray-600">{subtitle}</p>}
            </div>
        </>
    );
};

Header.propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
};

Header.defaultProps = {
    subtitle: null,
};

export default Header;
