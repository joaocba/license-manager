import { Link } from "react-router-dom";
import { useState } from "react";
import ForgotPasswordService from "../../Services/ForgotPasswordService";
import FetchClient from "../../FetchClients/ReleaseFetchClient";
import Logo from "../../Resources/_logo.png";

function ForgotPassword() {
    const [error, setError] = useState("");

    //Função que chamamos ao submeter o input para enviar o email inserido para o back-end
    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const email = data.get("email");

        //Check if email is empty
        if (!email) {
            setError("Email can't be empty");
            return;
        }

        // Regular expression for email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Check if the email is in the correct format
        if (!emailRegex.test(email)) {
            setError("Please enter a valid email address");
            return;
        }
        console.log(data);
        try {
            const forgotService = new ForgotPasswordService(FetchClient);
            const response = await forgotService.postEmail(email);

            //Test if server found an user
            if (response === "User not found") {
                setError("User not found, please write a valid email");
                return;
            }

            //Send user to an info page saying that email has been send
            window.location.href = "/ForgotPassword/sendEmail";
        } catch (e) {
            setError("Insert an email");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-sky-100 via-sky-200 to-sky-300">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-xl">
                <div className="flex justify-center mb-6">
                    <Link to="/" className="flex justify-center my-2">
                        <img src={Logo} id="logo" alt="Logo" className="h-20 cursor-pointer" />
                    </Link>
                </div>
                <h1 className="mb-4 text-2xl font-bold text-center text-sky-800">Forgot your password?</h1>
                <p className="mb-6 text-center text-gray-600">If you don't remember your password, insert your email and we will send you a recovery email.</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">
                            Email Address
                        </label>
                        <input type="email" id="email" name="email" className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500" placeholder="Enter your email" required />
                    </div>

                    <div className="flex gap-4">
                        <Link to="/login" className="w-full">
                            <button type="button" className="w-full px-4 py-2 text-sm font-medium text-black bg-white border border-black rounded-md shadow-sm hover:bg-gray-200">
                                Back
                            </button>
                        </Link>
                        <button type="submit" className="w-full px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500">
                            Submit
                        </button>
                    </div>

                    {error && <p className="mt-4 text-center text-red-600">{error}</p>}
                </form>
            </div>
        </div>
    );
}

export default ForgotPassword;
