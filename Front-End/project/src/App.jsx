import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./Components/Navbar.jsx";
import Login from "./Components/Login.jsx";
import Home from "./Components/Home/Home.jsx";
import "./css/index.css";
import Register from "./Components/Register.jsx";
import Pricing from "./Components/Pricing.jsx";

import DashboardGateway from "./Components/DashboardGateway.jsx";
import { UserProvider } from "./Components/Context/UserContext";

import "./css/index.css";
import VerifyAccount from "./Components/VerifyAccount.jsx";
import ErrorPage from "./Components/Error500.jsx";
import Payment from "./Components/PaymentOld";
import ForgotPassword from "./Components/ForgotPassword/ForgotPassword.jsx";
import SendEmail from "./Components/ForgotPassword/SendEmail.jsx";
import ResetPassword from "./Components/ForgotPassword/ResetPassword.jsx";
import ChangedPassword from "./Components/ForgotPassword/ChangedPassword.jsx";

// Route Guard component allows to protect routes from unauthorized access, instantly redirecting to login page
import RouteGuard from "./Components/RouteGuard";

import UnauthorizedPage from "./Components/401";

function App() {
    const location = useLocation();
    return (
        <>
            {/* Hide navbar for defined urls */}
            {!location.pathname.startsWith("/dashboard") && !location.pathname.startsWith("/register") && !location.pathname.startsWith("/401") ? <Navbar /> : null}
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/register/:license" element={<Register />} />
                <Route path="/pricing" element={<Pricing />} />

                <Route path="/verifyAccount" element={<VerifyAccount />} />
                <Route path="/error" element={<ErrorPage />} />
                <Route path="/ForgotPassword" element={<ForgotPassword />} />
                <Route path="/ForgotPassword/sendEmail" element={<SendEmail />} />
                <Route path="/ResetPassword" element={<ResetPassword />} />
                <Route path="/ResetPassword/changedPassword" element={<ChangedPassword />} />
                <Route path="/payment" element={<Payment />} />

                {/* Protected Routes */}
                <Route path="/dashboard/*" element={<RouteGuard element={<DashboardGateway />} allowedRoles={["Client User", "Client Admin", "Tech Admin"]} />} />

                {/* Other Routes */}
                <Route path="/error" element={<ErrorPage />} />
                <Route path="/401" element={<UnauthorizedPage />} />
            </Routes>
        </>
    );
}

function AppWrapper() {
    return (
        <UserProvider>
            <Router>
                <App />
            </Router>
        </UserProvider>
    );
}

export default AppWrapper;
