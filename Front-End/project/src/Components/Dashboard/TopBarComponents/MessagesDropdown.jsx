import { FaInbox, FaEnvelope } from "react-icons/fa6";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";

const MessagesDropdown = ({ messageOpen, toggleMessageDropdown }) => {
    const navigate = useNavigate();

    const messages = [
        { sender: "John Doe", content: "Hey, how are you doing?", time: "2m ago" },
        { sender: "Jane Smith", content: "Don't forget our meeting tomorrow.", time: "10m ago" },
        { sender: "Mike Johnson", content: "Can you review the document I sent?", time: "1h ago" },
        { sender: "Sarah Williams", content: "Happy Birthday!", time: "3h ago" },
        { sender: "Chris Lee", content: "Let's catch up soon.", time: "1d ago" },
    ];

    const truncateText = useCallback((text, maxLength) => {
        return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
    }, []);

    const handleNavigation = (path) => {
        toggleMessageDropdown(); // Close the dropdown
        navigate(path);
    };

    return (
        <div>
            <FaInbox className="text-lg transition duration-200 transform cursor-pointer text-sky-600 hover:text-sky-500" title="Messages" onClick={toggleMessageDropdown} role="button" aria-expanded={messageOpen} aria-controls="messages-dropdown" />
            {messageOpen && (
                <div id="messages-dropdown" className="absolute mt-4 bg-white rounded-lg shadow-lg right-4 w-80">
                    <div className="p-4 border-b border-gray-200">
                        <p className="font-semibold text-gray-800">Messages</p>
                    </div>
                    <div className="p-2 space-y-2 overflow-y-auto text-gray-700 max-h-80 custom-scrollbar">
                        {messages.map((message, index) => (
                            <div key={index} className="flex items-start p-2 space-x-3 transition-colors duration-200 ease-in-out border-b border-gray-200 cursor-pointer hover:bg-sky-100" onClick={() => handleNavigation("/dashboard/inbox")}>
                                <div className="flex-shrink-0 mt-1">
                                    <FaEnvelope className="text-sky-500" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-900">{message.sender}</p>
                                    <p className="text-sm text-gray-500">{truncateText(message.content, 25)}</p>
                                </div>
                                <div className="text-xs text-gray-400 whitespace-nowrap">{message.time}</div>
                            </div>
                        ))}
                    </div>
                    <div className="p-2 text-center border-t border-gray-200">
                        <span onClick={() => handleNavigation("/dashboard/inbox")} className="text-sm font-semibold text-gray-600 transition duration-200 cursor-pointer hover:text-sky-600">
                            View all
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

MessagesDropdown.propTypes = {
    messageOpen: PropTypes.bool.isRequired,
    toggleMessageDropdown: PropTypes.func.isRequired,
};

export default MessagesDropdown;
