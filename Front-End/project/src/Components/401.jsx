import "react";
import { useNavigate } from "react-router-dom";
import { FaExclamationCircle } from "react-icons/fa";

const UnauthorizedPage = () => {
    const navigate = useNavigate();

    const handleRedirect = () => {
        navigate("/");
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <FaExclamationCircle className="w-24 h-24 text-red-600" />
            <h1 className="mt-6 text-5xl font-bold text-red-600">401</h1>
            <h2 className="mt-4 text-3xl font-semibold text-gray-800">Unauthorized Access</h2>
            <p className="mt-2 text-lg text-gray-600">You do not have the necessary permissions to access this page.</p>
            <button onClick={handleRedirect} className="px-6 py-3 mt-6 text-lg font-semibold text-white transition duration-200 rounded bg-sky-500 hover:bg-sky-600">
                Go to Home
            </button>
        </div>
    );
};

export default UnauthorizedPage;
