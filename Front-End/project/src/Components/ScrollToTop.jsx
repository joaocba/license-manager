import { useState, useEffect } from "react";

const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
        if (window.scrollY > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    useEffect(() => {
        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    return (
        <div className="fixed bottom-5 right-5 md:bottom-10 md:right-10">
            <div className={`transition-opacity duration-500 ${isVisible ? "opacity-100" : "opacity-0 pointer-events-none"} md:block hidden`}>
                <button onClick={scrollToTop} className="p-4 text-white transition-all duration-300 ease-in-out transform rounded-full shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-2xl hover:scale-110">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default ScrollToTop;
