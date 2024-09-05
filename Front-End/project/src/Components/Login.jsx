import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserService from "../Services/UserService";
import FetchClient from "../FetchClients/ReleaseFetchClient";
import Logo from "../Resources/_logo.png";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // Check if the user is already logged in
    useEffect(() => {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        if (token) {
            navigate("/dashboard");
        }
    }, [navigate]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!email || !password) {
            setError("Please fill in all fields");
            return;
        }

        try {
            const userService = new UserService(FetchClient);
            const response = await userService.Login({ email, password });

            // Check if the response contains a token
            if (response) {
                console.log("Login successful");
                if (rememberMe) {
                    localStorage.setItem("token", response);
                } else {
                    sessionStorage.setItem("token", response);
                }
                window.location = "/dashboard";
            } else {
                console.error("Login failed. No token in response");
                setError("Login failed");
            }
        } catch (error) {
            console.error("Login error:", error);
            setError("An error occurred during login");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-sky-100 via-sky-200 to-sky-300">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex justify-center mb-6">
                        <Link to="/" className="flex justify-center my-2">
                            <img src={Logo} id="logo" alt="Logo" className="h-20 cursor-pointer" />
                        </Link>
                    </div>
                    <h1 className="mb-6 text-xl font-bold text-center text-sky-800" id="title">
                        Login
                    </h1>

                    <div className="space-y-6">
                        <div className="flex flex-col items-center space-y-3">
                            <div className="w-[300px]">
                                <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <input type="email" id="email" className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            </div>

                            <div className="w-[300px]">
                                <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <input type="password" id="password" className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            </div>

                            {error && (
                                <div className="text-center text-red-500">
                                    <label>{error}</label>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-center mb-6">
                            <label className="flex items-center text-sm text-gray-700">
                                <input type="checkbox" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} className="w-4 h-4 border-gray-300 rounded text-sky-600 focus:ring-sky-500" />
                                <span className="ml-2">Keep me logged in</span>
                            </label>
                        </div>

                        <div className="flex items-center justify-center">
                            <button type="submit" className="w-[300px] py-3 text-sm font-semibold text-center text-white rounded-lg bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500">
                                LOGIN
                            </button>
                        </div>

                        <div className="flex justify-center">
                            <p className="text-sm text-gray-600">
                                Forgot your password?{" "}
                                <Link to="/ForgotPassword" className="text-sky-500 hover:underline">
                                    Click Here
                                </Link>
                            </p>
                        </div>

                        <div className="flex justify-center">
                            <p className="text-sm text-gray-600">
                                Don't have an account?{" "}
                                <Link to="/register" className="text-sky-500 hover:underline">
                                    Sign Up
                                </Link>
                            </p>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
