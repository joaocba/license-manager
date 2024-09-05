import { useEffect, useState } from "react";
import Logo from "../../Resources/_logo.png";
import "../../css/dashboard.css";

const DashboardLoader = () => {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoaded(true);
        }, 100); // Delay to ensure CSS is applied

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-transparent">
            <div className={`flex flex-col items-center transition-opacity duration-1000 ${isLoaded ? "opacity-100" : "opacity-0"}`}>
                <img src={Logo} alt="Company Logo" className="mb-6" />
                <div className="flex items-center space-x-3">
                    <div className="loader"></div>
                    <p className="text-xl font-semibold text-gray-700">Loading Dashboard...</p>
                </div>
            </div>
        </div>
    );
};

export default DashboardLoader;
