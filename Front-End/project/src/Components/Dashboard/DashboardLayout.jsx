import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import TopBar from "./TopBar";
import Sidebar from "./Sidebar";
import Home from "./MainContentPages/Main/Home";
import HomeClientUser from "./MainContentPages/Main/HomeClientUser";
import UserManager from "./MainContentPages/Main/UserManager";
import ClientManager from "./MainContentPages/Main/ClientManager";
import PackageManager from "./MainContentPages/Main/PackageManager";
import SettingsManager from "./MainContentPages/Main/SettingsManager";
import GlobalSettings from "./MainContentPages/Main/SettingsManagerComponents/GlobalSettings";
import LicenseSettings from "./MainContentPages/Main/SettingsManagerComponents/LicenseSettings";
import BillingSettings from "./MainContentPages/Main/SettingsManagerComponents/BillingSettings";
import LicenseInspector from "./MainContentPages/Main/LicenseInspector";
import LicenseManager from "./MainContentPages/Main/LicenseManager";
import LicenseManagerLogs from "./MainContentPages/Main/LicenseManagerLogs";
import Billing from "./MainContentPages/Main/Billing";
import AllTransactions from "./MainContentPages/Main/BillingComponents/AllTransactions";
import Recruitment from "./MainContentPages/Modules/Recruitment";
import RecruitmentFinancial from "./MainContentPages/Modules/RecruitmentFinancial";
import Business from "./MainContentPages/Modules/Business";
import Profile from "./MainContentPages/Main/Profile";
import Settings from "./MainContentPages/Main/Settings";
import Notifications from "./MainContentPages/Main/Notifications";
import InboxMessages from "./MainContentPages/Main/InboxMessages";
import MainContentWrapper from "./MainContentWrapper";
import Spinner from "./MainContentPages/Layout/Spinner";
import UserContext from "../Context/UserContext";
import Alert from "./AlertMessage";
import RouteGuard from "../RouteGuard";
import Checkout from "./MainContentPages/Main/Checkout";
import CheckoutPageTest from "./MainContentPages/Main/LicenseManagerComponents/CheckoutPageTest";

const DashboardLayout = () => {
    const { user } = useContext(UserContext);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const handleResize = () => {
            const newIsSidebarOpen = window.innerWidth >= 768;
            setIsSidebarOpen(newIsSidebarOpen);
            if (!newIsSidebarOpen) {
                setIsDropdownOpen(false);
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    useEffect(() => {
        setLoading(true);
        setLoading(false);
    }, [location]);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
        if (isSidebarOpen) {
            setIsDropdownOpen(false);
        }
    };

    const toggleDropdown = () => {
        if (!isSidebarOpen) {
            setIsSidebarOpen(true);
        }
        setIsDropdownOpen(!isDropdownOpen);
    };

    const triggerAlert = (type, title, message) => {
        setAlert({ type, title, message });
    };

    // Handle redirection for Client User specific dashboard home page
    const userRole = user?.role?.role1;
    if ((userRole === "Client User" && location.pathname === "/dashboard") || (userRole === "Client User" && location.pathname === "/dashboard/")) {
        return <Navigate to="/dashboard/user-home" />;
    }
    return (
        <div className="flex flex-col h-screen dashboard-body">
            <TopBar user={user} toggleSidebar={toggleSidebar} />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} toggleDropdown={toggleDropdown} isDropdownOpen={isDropdownOpen} />
                <MainContentWrapper isSidebarOpen={isSidebarOpen} loading={loading}>
                    {loading ? (
                        <Spinner />
                    ) : (
                        <Routes>
                            {/* Shared Routes */}
                            <Route path="" element={<RouteGuard element={<Home />} allowedRoles={["Client Admin", "Tech Admin"]} />} />
                            <Route path="profile" element={<RouteGuard element={<Profile triggerAlert={triggerAlert} />} allowedRoles={["Client User", "Client Admin", "Tech Admin"]} />} />
                            <Route path="settings" element={<RouteGuard element={<Settings />} allowedRoles={["Client User", "Client Admin", "Tech Admin"]} />} />
                            <Route path="notifications" element={<RouteGuard element={<Notifications />} allowedRoles={["Client User", "Client Admin", "Tech Admin"]} />} />
                            <Route path="inbox" element={<RouteGuard element={<InboxMessages />} allowedRoles={["Client User", "Client Admin", "Tech Admin"]} />} />

                            {/* Tech Admin Routes */}
                            <Route path="user-manager" element={<RouteGuard element={<UserManager />} allowedRoles={["Tech Admin"]} />} />
                            <Route path="client-manager" element={<RouteGuard element={<ClientManager />} allowedRoles={["Tech Admin"]} />} />
                            <Route path="package-manager" element={<RouteGuard element={<PackageManager />} allowedRoles={["Tech Admin"]} />} />
                            <Route path="license-inspector" element={<RouteGuard element={<LicenseInspector />} allowedRoles={["Tech Admin"]} />} />
                            <Route path="settings-manager" element={<RouteGuard element={<SettingsManager />} allowedRoles={["Tech Admin"]} />} />
                            <Route path="settings-manager/global" element={<RouteGuard element={<GlobalSettings triggerAlert={triggerAlert} />} allowedRoles={["Tech Admin"]} />} />
                            <Route path="settings-manager/license" element={<RouteGuard element={<LicenseSettings triggerAlert={triggerAlert} />} allowedRoles={["Tech Admin"]} />} />
                            <Route path="settings-manager/billing" element={<RouteGuard element={<BillingSettings triggerAlert={triggerAlert} />} allowedRoles={["Tech Admin"]} />} />

                            {/* Client Admin Routes */}
                            <Route path="license-manager" element={<RouteGuard element={<LicenseManager triggerAlert={triggerAlert} />} allowedRoles={["Client Admin"]} />} />
                            <Route path="license-manager/logs" element={<RouteGuard element={<LicenseManagerLogs triggerAlert={triggerAlert} />} allowedRoles={["Client Admin"]} />} />
                            <Route path="billing" element={<RouteGuard element={<Billing triggerAlert={triggerAlert} />} allowedRoles={["Client Admin"]} />} />
                            <Route path="billing/all-transactions" element={<RouteGuard element={<AllTransactions triggerAlert={triggerAlert} />} allowedRoles={["Client Admin"]} />} />
                            <Route path="recruitment" element={<RouteGuard element={<Recruitment />} allowedRoles={["Client Admin"]} />} />
                            <Route path="recruitment-financial" element={<RouteGuard element={<RecruitmentFinancial />} allowedRoles={["Client Admin"]} />} />
                            <Route path="business" element={<RouteGuard element={<Business />} allowedRoles={["Client Admin"]} />} />
                            <Route path="checkout" element={<RouteGuard element={<Checkout />} allowedRoles={["Client Admin"]} />} />

                            {/* Client User Routes */}
                            <Route path="user-home" element={<RouteGuard element={<HomeClientUser />} allowedRoles={["Client User"]} />} />

                            {/* Test Page for Checkout Page Test (license upgrade data) -  To be deleted later */}
                            <Route path="checkout-test" element={<RouteGuard element={<CheckoutPageTest />} allowedRoles={["Client Admin"]} />} />
                        </Routes>
                    )}
                </MainContentWrapper>
            </div>
            {alert && <Alert {...alert} onClose={() => setAlert(null)} />}
        </div>
    );
};

export default DashboardLayout;
