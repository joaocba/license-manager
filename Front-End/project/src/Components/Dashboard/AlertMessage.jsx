import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { FiCheckCircle, FiAlertTriangle, FiXCircle, FiInfo } from "react-icons/fi";

const AlertMessage = ({ type, title, message, onClose }) => {
    const [visible, setVisible] = useState(true);
    const [progress, setProgress] = useState(100);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            onClose();
        }, 5000);

        const progressInterval = setInterval(() => {
            setProgress((prev) => Math.max(prev - 2, 0));
        }, 100);

        return () => {
            clearTimeout(timer);
            clearInterval(progressInterval);
        };
    }, [onClose]);

    if (!visible) return null;

    const getColorClasses = () => {
        switch (type) {
            case "success":
                return "bg-green-500";
            case "warning":
                return "bg-yellow-500";
            case "error":
                return "bg-red-500";
            default:
                return "bg-blue-500";
        }
    };

    const getIcon = () => {
        switch (type) {
            case "success":
                return <FiCheckCircle className="text-2xl" />;
            case "warning":
                return <FiAlertTriangle className="text-2xl" />;
            case "error":
                return <FiXCircle className="text-2xl" />;
            default:
                return <FiInfo className="text-2xl" />;
        }
    };

    return (
        <div
            className={`fixed top-20 right-6 rounded-lg px-4 py-4 text-white shadow-lg ${getColorClasses()}`}
            style={{
                transition: "opacity 0.5s ease-in-out",
                animation: visible ? "fadein 0.5s" : "fadeout 0.5s",
            }}
        >
            <div className="flex items-center">
                <div className="mr-4">{getIcon()}</div>
                <div>
                    <h5 className="text-xl font-semibold">{title}</h5>
                    <p className="mt-2">{message}</p>
                </div>
                <button
                    onClick={() => {
                        setVisible(false);
                        onClose();
                    }}
                    className="ml-auto text-white hover:text-gray-300"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-white bg-opacity-30">
                <div className="h-1 bg-white" style={{ width: `${progress}%`, transition: "width 0.1s linear" }} />
            </div>
        </div>
    );
};

AlertMessage.propTypes = {
    type: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default AlertMessage;
