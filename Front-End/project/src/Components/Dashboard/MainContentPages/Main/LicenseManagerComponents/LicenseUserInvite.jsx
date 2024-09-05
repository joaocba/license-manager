import { useState } from "react";
import PropTypes from "prop-types";
import LicenseService from "../../../../../Services/LicenseService";
import { FaRegPaperPlane, FaXmark } from "react-icons/fa6";

const licenseService = new LicenseService();

const LicenseUserInvite = ({ isVisible, onClose, license }) => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    // Reset state to initial values
    const resetState = () => {
        setEmail("");
        setError(null);
        setSuccess(false);
        setLoading(false);
    };

    // Handle the invite submission
    const handleInvite = async () => {
        if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            setError("Please enter a valid email address.");
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            await licenseService.sendInvite(email, license.id);

            // Log the invite action
            await licenseService.registerLicenseLogWithClient({
                actionType: 6,
                logMessage: `Invited user with email: ${email} to license ID: ${license.id}`,
            });

            console.log(`Inviting ${email} to license ID: ${license.id}`);
            setSuccess(true);
            setTimeout(() => {
                resetState();
                onClose();
            }, 2000); // Close the modal after 2 seconds
        } catch (err) {
            setError("Failed to send invite");
            console.error("Error sending invite:", err);
        } finally {
            setLoading(false);
        }
    };

    // Close the modal and reset the state
    const handleClose = () => {
        resetState();
        onClose();
    };

    if (!isVisible) return null;

    return (
        <div role="dialog" aria-labelledby="invite-modal-title" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="relative w-full p-6 bg-white rounded-lg shadow-lg sm:w-4/12 min-w-96">
                <div className="flex items-center justify-between mb-4">
                    <h2 id="invite-modal-title" className="text-2xl font-bold text-gray-800">
                        Send License Invitation
                    </h2>
                    <button onClick={handleClose} aria-label="Close" className="text-gray-600 hover:text-gray-900">
                        <FaXmark className="text-2xl" />
                    </button>
                </div>
                <div className="p-6 mb-6 border border-gray-200 rounded-lg bg-gray-50">
                    <h3 className="mb-4 text-xl font-semibold text-gray-700">How It Works</h3>
                    <ol className="space-y-3 text-gray-700 list-decimal list-inside">
                        <li>Enter a valid email address of the user you want to invite.</li>
                        <li>An email will be sent to the target address with a registration URL.</li>
                        <li>The user must register using the provided link.</li>
                        <li>After successful registration, the user will be assigned to the license ID mentioned in this invite.</li>
                        <li>The license will be set to active, and the user will gain access to the package features.</li>
                    </ol>
                </div>
                <div className="mb-4">
                    <p className="text-sm text-gray-600">
                        <strong>License Type:</strong> {license.type}
                    </p>
                    <p className="text-sm text-gray-600">
                        <strong>License ID:</strong> {license.id}
                    </p>
                </div>
                {success && <div className="p-3 mb-4 text-green-600 bg-green-100 border border-green-300 rounded-lg">Invite sent successfully!</div>}
                {error && <div className="p-3 mb-4 text-red-600 bg-red-100 border border-red-300 rounded-lg">{error}</div>}
                <input type="email" placeholder="e.g., user@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 mb-4 transition duration-300 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" disabled={loading} />
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
                        <div className="w-8 h-8 border-4 border-t-4 border-gray-300 rounded-full border-t-blue-500 animate-spin"></div>
                    </div>
                )}
                <div className="flex justify-end space-x-2">
                    <button onClick={handleInvite} className={`flex items-center px-4 py-2 font-semibold text-white rounded-lg ${loading ? "bg-sky-400" : "bg-sky-600"} focus:outline-none hover:bg-sky-700 active:bg-sky-800 transition duration-300`} disabled={loading} aria-live="assertive">
                        <FaRegPaperPlane className="mr-2" /> {loading ? "Sending..." : "Send Invite"}
                    </button>
                    <button onClick={handleClose} className="px-4 py-2 text-gray-700 transition duration-300 border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300" disabled={loading}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

LicenseUserInvite.propTypes = {
    isVisible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    license: PropTypes.shape({
        id: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
    }).isRequired,
};

export default LicenseUserInvite;
