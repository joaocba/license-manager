import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "../css/index.css";
import "../css/navbar.css";
import Logo from "../Resources/_logo.png";
import UserService from "../Services/UserService";
import UserFetchClient from "../FetchClients/UserFetchClient";
import NavItem from "./NavbarComponents/NavItem";
import AuthLinks from "./NavbarComponents/AuthLinks";
import Sidebar from "./NavbarComponents/Sidebar";
import ModuleFetchClient from "../FetchClients/ModuleFetchClient";
import ModuleService from "../Services/ModuleService";

const Navbar = () => {
    const location = useLocation();
    const [authenticated, setAuthenticated] = useState(false);
    const [userEmail, setUserEmail] = useState("");
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
    const [modules, setModules] = useState([]);
    const [sidebarModules, setSidebarModules] = useState([]);

    // Check if user is authenticated on page load
    useEffect(() => {
        const checkAuthentication = async () => {
            // Attempt to get the token from localStorage first
            let token = localStorage.getItem("token");
            // If not found in localStorage, try getting it from sessionStorage
            if (!token) {
                token = sessionStorage.getItem("token");
            }
            if (token) {
                try {
                    const userService = new UserService(UserFetchClient);
                    const userData = await userService.getUserData(token);
                    setAuthenticated(true);
                    setUserEmail(userData.email);
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            }
            setLoading(false);
        };

        checkAuthentication();
    }, []);

    // Fetch modules data (AKA products) on page load
    useEffect(() => {
        const fetchData = async () => {
            const moduleService = new ModuleService(ModuleFetchClient);
            try {
                let modules = await moduleService.GetAll();
                // Sort modules by name
                modules.sort((a, b) => a.name.localeCompare(b.name));
                setModules(modules);
                setSidebarModules(modules.map((module) => ({ text: module.name, link: `/product/${module.name}` }))); // Adjust link as needed
            } catch (error) {
                console.error("Error fetching modules:", error);
            }
        };

        fetchData();
    }, []);

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        setAuthenticated(false);
        setUserEmail("");
    };

    // Toggle sidebar
    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    // Hide navbar on login and register pages
    if (location.pathname === "/login" || location.pathname === "/register" || location.pathname === "/ForgotPassword" || location.pathname === "/ForgotPassword/sendEmail" || location.pathname === "/ResetPassword/" || location.pathname === "/ResetPassword/changedPassword" || location.pathname === "/dashboard") {
        return null;
    }

    // CURRENT TEMPORARY STATIC/DYNAMIC METHOD: Submenu items for the Products menu item
    const staticFeatures = [
        { title: "Feature 1", description: "Description of Feature 1" },
        { title: "Feature 2", description: "Description of Feature 2" },
        { title: "Feature 3", description: "Description of Feature 3" },
        { title: "Feature 4", description: "Description of Feature 4" },
        { title: "Feature 5", description: "Description of Feature 5" },
        { title: "Feature 6", description: "Description of Feature 6" },
    ];

    const productsSubMenuItems = modules.map((module) => ({
        category: module.name,
        features: staticFeatures,
        image: "https://placehold.co/600x400/png",
        description: "Description for: " + module.description,
    }));

    return (
        <nav className={`sticky top-0 z-50 bg-white ${isSubMenuOpen ? "nav-shadow-none" : "nav-shadow-lg"}`}>
            <div className="container flex items-center justify-between px-4 py-4 mx-auto">
                <div className="flex items-center space-x-4">
                    <Link to="/" className="mr-2">
                        <img src={Logo} id="logo" alt="Logo" className="w-auto" />
                    </Link>
                    <div className="hidden space-x-6 show-above-1268">
                        <NavItem text="Products" subMenuItems={productsSubMenuItems} onSubMenuToggle={(isOpen) => setIsSubMenuOpen(isOpen)} />
                        <NavItem text="Teams" />
                        <NavItem text="Platform" />
                        <NavItem text="Resources" />
                    </div>
                </div>
                <div className="hidden show-above-1268">
                    <AuthLinks loading={loading} authenticated={authenticated} userEmail={userEmail} handleLogout={handleLogout} />
                </div>
                <button className="hidden p-4 text-gray-800 show-below-1268 focus:outline-none" onClick={toggleSidebar}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                    </svg>
                </button>
            </div>

            <Sidebar isOpen={sidebarOpen} closeSidebar={toggleSidebar} authenticated={authenticated} handleLogout={handleLogout} userEmail={userEmail} modules={sidebarModules} />
        </nav>
    );
};

export default Navbar;
