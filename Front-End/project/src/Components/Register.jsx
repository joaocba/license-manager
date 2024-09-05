import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import UserService from "../Services/UserService";
import UserFetchClient from "../FetchClients/UserFetchClient";
import ClientService from "../Services/ClientService.js";
import ClientFetchClient from "../FetchClients/ClientFetchClient.js";
import TermsAndConditions from "../assets/sample-terms-conditions-agreement.pdf";
import validator from "validator";
import Logo from "../Resources/_logo.png";

function Register() {
    const userService = new UserService(UserFetchClient);
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [redirectTimer, setRedirectTimer] = useState(4);
    const [loading, setLoading] = useState(false);
    const [highlight, setHighlight] = useState({});
    const [termsAndConditions, setTermsAndConditions] = useState(false);
    const [newsletter, setNewsletter] = useState(false);
    const formScroll = useRef(null);

    let urlParam = useParams();
    const idLicense = urlParam.license;
    const invite = idLicense !== undefined;
    const clientService = new ClientService(ClientFetchClient);
    sessionStorage.setItem("idLicense", idLicense);
    const [clientData, setClientData] = useState({
        clientName: "",
        vat: "",
        fiscalAdress: "",
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await clientService.GetClientInfo();
                setClientData({
                    clientName: result[0]["clientName"],
                    vat: result[0]["vat"],
                    fiscalAdress: result[0]["fiscalAdress"],
                });
            } catch (error) {
                console.log("Error fetching client data:", error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        let intervalId;
        if (showAlert) {
            intervalId = setInterval(() => {
                setRedirectTimer((prevTimer) => prevTimer - 1);
            }, 1000);
        }

        return () => {
            clearInterval(intervalId);
        };
    }, [showAlert]);

    useEffect(() => {
        if (setError || setHighlight) {
            formScroll.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [error, highlight]);

    const downloadTermsAndConditions = (e) => {
        e.preventDefault();
        window.open(TermsAndConditions);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const name = data.get("name");
        const email = data.get("email");
        const password = data.get("password");
        const confirmPassword = data.get("confirmPassword");
        const phoneNumber = data.get("phoneNumber");
        const clientName = data.get("clientName");
        const address = data.get("address");
        const nif = data.get("nif");

        const newErrors = {};
        if (!name) newErrors.name = "Name is required";
        if (!email) newErrors.email = "Email is required";
        if (!clientName && !invite) newErrors.clientName = "Company is required";
        if (!address && !invite) newErrors.address = "Fiscal Address is required";
        if (!password) newErrors.password = "Password is required";
        if (!nif && !invite) newErrors.nif = "VAT is required";

        if (Object.keys(newErrors).length !== 0) {
            setHighlight(newErrors);
            return;
        }

        if (email && !validator.isEmail(email)) {
            setError("Please enter a valid email address");
            return;
        }

        if (termsAndConditions === false) {
            setError("You must read and accept the terms and conditions");
            return;
        }

        if ((phoneNumber && phoneNumber.length !== 9) || isNaN(parseInt(phoneNumber))) {
            setError("Please enter a valid phone number");
            return;
        }

        if (!invite && ((nif && nif.length !== 9) || isNaN(parseInt(nif)))) {
            setError("Please enter a valid VAT");
            return;
        }

        if (!validator.isStrongPassword(password)) {
            setError("The password is not strong enough\nPlease include:\n\t-At least 8 characters long;\n\t-At least a number;\n\t-At least an upper and lower case character;\n\t-At least a special character.");
            return;
        }

        if (password !== confirmPassword) {
            setError("The passwords provided do not match!");
            return;
        }

        const userClient = {
            Client: {
                clientName: data.get("clientName") || clientData.clientName,
                fiscalAdress: data.get("address") || clientData.fiscalAdress,
                vat: data.get("nif") || clientData.vat,
            },
            User: {
                name: data.get("name"),
                email: data.get("email"),
                password: data.get("password"),
                phoneNumber: data.get("phoneNumber"),
                fkLicense: idLicense,
            },
            emailNewsletter: newsletter,
        };

        try {
            setLoading(true);
            await userService.Create(userClient);
            setShowAlert(true);
            setError("");
            setTimeout(() => {
                navigate("/");
            }, 4000);
        } catch (error) {
            if (error.message === "Conflict: Email already exists") {
                setError("The provided email is already registered. Please try logging in or use a different email.");
            } else {
                console.error(error);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-sky-100 via-sky-200 to-sky-300" ref={formScroll}>
            <div className="w-full max-w-4xl p-8 space-y-6 bg-white rounded-lg shadow-xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex justify-center mb-6">
                        <Link to="/" className="flex justify-center my-2">
                            <img src={Logo} id="logo" alt="Logo" className="h-20 cursor-pointer" />
                        </Link>
                    </div>
                    <h1 className="mb-6 text-xl font-bold text-center text-sky-800" id="title">
                        Sign Up for App
                    </h1>

                    {error && !showAlert && (
                        <Alert severity="error" className="whitespace-pre-wrap">
                            {error}
                        </Alert>
                    )}
                    {showAlert && (
                        <Alert severity="success" className="text-green-500">
                            Welcome to App! <br /> Please check your email to validate your account. <br />
                            You will be redirected to the homepage in {redirectTimer} seconds.
                        </Alert>
                    )}

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block mb-1 text-sm font-medium text-gray-700">
                                    Name
                                </label>
                                <input type="text" id="name" name="name" className={`w-full px-4 py-3 text-sm border ${highlight.name ? "border-red-500" : "border-gray-300"} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500`} placeholder="Enter your name" required />
                            </div>

                            <div>
                                <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <input type="email" id="email" name="email" className={`w-full px-4 py-3 text-sm border ${highlight.email ? "border-red-500" : "border-gray-300"} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500`} placeholder="Enter your email" required />
                            </div>

                            <div>
                                <label htmlFor="phoneNumber" className="block mb-1 text-sm font-medium text-gray-700">
                                    Phone Number
                                </label>
                                <input type="tel" id="phoneNumber" name="phoneNumber" className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500" placeholder="Enter your phone number" />
                            </div>

                            {!invite && (
                                <div>
                                    <label htmlFor="clientName" className="block mb-1 text-sm font-medium text-gray-700">
                                        Company Name
                                    </label>
                                    <input type="text" id="clientName" name="clientName" className={`w-full px-4 py-3 text-sm border ${highlight.clientName ? "border-red-500" : "border-gray-300"} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500`} placeholder="Enter your company name" required />
                                </div>
                            )}
                        </div>

                        <div className="space-y-6">
                            {!invite && (
                                <>
                                    <div>
                                        <label htmlFor="nif" className="block mb-1 text-sm font-medium text-gray-700">
                                            VAT
                                        </label>
                                        <input type="text" id="nif" name="nif" className={`w-full px-4 py-3 text-sm border ${highlight.nif ? "border-red-500" : "border-gray-300"} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500`} placeholder="Enter your VAT" required />
                                    </div>

                                    <div>
                                        <label htmlFor="address" className="block mb-1 text-sm font-medium text-gray-700">
                                            Fiscal Address
                                        </label>
                                        <input type="text" id="address" name="address" className={`w-full px-4 py-3 text-sm border ${highlight.address ? "border-red-500" : "border-gray-300"} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500`} placeholder="Enter your fiscal address" required />
                                    </div>
                                </>
                            )}

                            <div>
                                <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <input type="password" id="password" name="password" className={`w-full px-4 py-3 text-sm border ${highlight.password ? "border-red-500" : "border-gray-300"} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500`} placeholder="Enter your password" required />
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className="block mb-1 text-sm font-medium text-gray-700">
                                    Confirm Password
                                </label>
                                <input type="password" id="confirmPassword" name="confirmPassword" className={`w-full px-4 py-3 text-sm border ${highlight.confirmPassword ? "border-red-500" : "border-gray-300"} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500`} placeholder="Confirm your password" required />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-center space-x-4">
                        <div className="flex items-center">
                            <input id="termsAndConditions" name="termsAndConditions" type="checkbox" onChange={(e) => setTermsAndConditions(e.target.checked)} className="w-4 h-4 border-gray-300 rounded text-sky-600 focus:ring-sky-500" required />
                            <label htmlFor="termsAndConditions" className="ml-2 text-sm text-gray-900">
                                I agree to the{" "}
                                <a href="/" className="font-medium text-sky-600 hover:text-sky-500" onClick={downloadTermsAndConditions}>
                                    terms and conditions
                                </a>
                            </label>
                        </div>
                        <div className="flex items-center">
                            <input id="newsletter" name="newsletter" type="checkbox" onChange={(e) => setNewsletter(e.target.checked)} className="w-4 h-4 border-gray-300 rounded text-sky-600 focus:ring-sky-500" />
                            <label htmlFor="newsletter" className="ml-2 text-sm text-gray-900">
                                Sign me up for the newsletter
                            </label>
                        </div>
                    </div>
                    <div className="flex items-center justify-center">
                        <button type="submit" className="w-[300px] px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500" disabled={loading}>
                            {loading ? <CircularProgress size={24} color="inherit" /> : "Register"}
                        </button>
                    </div>

                    <p className="text-sm text-center text-gray-600">
                        Already have an account?{" "}
                        <Link to="/login" className="font-medium text-sky-600 hover:text-sky-500">
                            Login here
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Register;
