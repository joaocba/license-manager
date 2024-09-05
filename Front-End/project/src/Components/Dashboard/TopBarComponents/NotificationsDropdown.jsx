import { FaBell, FaCreditCard, FaTriangleExclamation, FaCircleInfo } from "react-icons/fa6";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const NotificationsDropdown = ({ notificationOpen, toggleNotificationDropdown }) => {
    const navigate = useNavigate();

    const notifications = [
        { type: "billing", title: "Billing Update", content: "Your invoice for July is available.", time: "5m ago" },
        { type: "system", title: "System Update", content: "System maintenance is scheduled for tonight.", time: "10m ago" },
        { type: "alert", title: "Security Alert", content: "New login detected from an unrecognized device.", time: "15m ago" },
        { type: "billing", title: "Payment Received", content: "Your payment has been received.", time: "20m ago" },
        { type: "system", title: "New Features", content: "Check out the new features in the latest update.", time: "25m ago" },
    ];

    const getIcon = (type) => {
        const iconClass = "flex-shrink-0 mt-1";
        switch (type) {
            case "billing":
                return <FaCreditCard className={`${iconClass} text-sky-500`} />;
            case "system":
                return <FaCircleInfo className={`${iconClass} text-teal-500`} />;
            case "alert":
                return <FaTriangleExclamation className={`${iconClass} text-red-500`} />;
            default:
                return <FaBell className={`${iconClass} text-sky-500`} />;
        }
    };

    const handleNavigation = (path) => {
        toggleNotificationDropdown();
        navigate(path);
    };

    return (
        <div>
            <FaBell className="text-lg transition duration-200 transform cursor-pointer text-sky-600 hover:text-sky-500" title="Notifications" onClick={toggleNotificationDropdown} />
            {notificationOpen && (
                <div className="absolute z-50 mt-4 bg-white rounded-lg shadow-lg right-4 w-80">
                    <div className="p-4 border-b border-gray-200">
                        <p className="font-semibold text-gray-800">Notifications</p>
                    </div>
                    <div className="p-2 space-y-2 overflow-y-auto text-gray-700 max-h-80 custom-scrollbar">
                        {notifications.map((notification, index) => (
                            <div key={index} className="flex items-start p-2 space-x-3 transition-colors duration-200 ease-in-out border-b border-gray-200 cursor-pointer hover:bg-sky-100" onClick={() => handleNavigation("/dashboard/notifications")}>
                                {getIcon(notification.type)}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-900">{notification.title}</p>
                                    <p className="text-sm text-gray-500">{notification.content}</p>
                                </div>
                                <div className="text-xs text-gray-400 whitespace-nowrap">{notification.time}</div>
                            </div>
                        ))}
                    </div>
                    <div className="p-2 text-center border-t border-gray-200">
                        <span onClick={() => handleNavigation("/dashboard/notifications")} className="text-sm font-semibold text-gray-600 transition duration-200 cursor-pointer hover:text-sky-600">
                            View all
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

NotificationsDropdown.propTypes = {
    notificationOpen: PropTypes.bool.isRequired,
    toggleNotificationDropdown: PropTypes.func.isRequired,
};

export default NotificationsDropdown;
