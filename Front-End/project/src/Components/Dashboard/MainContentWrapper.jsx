import PropTypes from "prop-types";
import Spinner from "./MainContentPages/Layout/Spinner";

const MainContentWrapper = ({ isSidebarOpen, children, loading }) => {
    return (
        <div className={`flex-1 p-6 overflow-auto bg-gray-100 rounded-tl-lg custom-scrollbar shadow-lg ms-4 dashboard-main-content ${isSidebarOpen ? "hidden md:block" : ""}`}>
            {loading ? (
                <div className="flex items-center justify-center h-full">
                    <Spinner />
                </div>
            ) : (
                children
            )}
        </div>
    );
};

MainContentWrapper.propTypes = {
    isSidebarOpen: PropTypes.bool.isRequired,
    children: PropTypes.node,
    loading: PropTypes.bool,
};

MainContentWrapper.defaultProps = {
    children: null,
    loading: false,
};

export default MainContentWrapper;
