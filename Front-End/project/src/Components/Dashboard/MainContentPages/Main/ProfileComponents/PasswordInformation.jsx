import { useState } from "react";
import PropTypes from "prop-types";
import { FaPenToSquare, FaCircleExclamation } from "react-icons/fa6";
import UserService from "../../../../../Services/UserService";
import UserFetchClient from "../../../../../FetchClients/UserFetchClient";

const PasswordInformation = ({ triggerAlert }) => {
    const [isEditingPassword, setIsEditingPassword] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [passwordErrors, setPasswordErrors] = useState({});

    const handlePasswordEditToggle = () => {
        setIsEditingPassword(!isEditingPassword);
        if (!isEditingPassword) {
            setPasswordErrors({}); // Clear errors when disabling edit mode
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "currentPassword") setCurrentPassword(value);
        else if (name === "newPassword") setNewPassword(value);
        else if (name === "confirmNewPassword") setConfirmNewPassword(value);
    };

    const validatePasswordInputs = () => {
        const newErrors = {};
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

        if (!currentPassword.trim()) newErrors.currentPassword = "Current password is required.";
        if (!newPassword.trim()) newErrors.newPassword = "New password is required.";
        if (newPassword === currentPassword) newErrors.newPassword = "New password cannot be the same as the current password.";
        if (!passwordRegex.test(newPassword)) newErrors.newPassword = "New password must be at least 8 characters long and include a letter, a number, and a special character.";
        if (newPassword !== confirmNewPassword) newErrors.confirmNewPassword = "Passwords do not match.";

        return newErrors;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const newErrors = validatePasswordInputs();

        if (Object.keys(newErrors).length > 0) {
            setPasswordErrors(newErrors);
            return;
        }

        const payload = {
            currentPassword: currentPassword,
            newPassword: newPassword,
            confirmNewPassword: confirmNewPassword,
        };

        try {
            const userService = new UserService(UserFetchClient);
            await userService.changePassword(payload);
            triggerAlert("success", "Success", "Password changed successfully.");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmNewPassword("");
            setPasswordErrors({});
        } catch (error) {
            triggerAlert("error", "Error", error.message || "An error occurred while changing your password.");
        }
    };

    return (
        <div className="flex flex-col flex-1 p-8 space-y-6 bg-white border rounded-lg shadow-sm h-fit">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-600">Password information</h2>
                <button onClick={handlePasswordEditToggle} className="text-gray-500 hover:text-sky-600 focus:outline-none">
                    <FaPenToSquare size={18} />
                </button>
            </div>
            <hr className="border-gray-200" />
            <form onSubmit={handleSubmit} className="flex flex-col space-y-4 grow">
                <div className="flex flex-col space-y-4 lg:flex-row lg:space-x-4 lg:space-y-0">
                    <PasswordInput label="New Password" name="newPassword" value={newPassword} onChange={handleChange} error={passwordErrors.newPassword} disabled={!isEditingPassword} />
                    <PasswordInput label="Confirm New Password" name="confirmNewPassword" value={confirmNewPassword} onChange={handleChange} error={passwordErrors.confirmNewPassword} disabled={!isEditingPassword} />
                </div>
                <div className="flex flex-col space-y-4 lg:mr-4 lg:flex-row lg:space-x-4 lg:space-y-0">
                    <PasswordInput label="Current Password" name="currentPassword" value={currentPassword} onChange={handleChange} error={passwordErrors.currentPassword} disabled={!isEditingPassword} />
                </div>
                <div className="w-full">
                    <h3 className="text-lg font-semibold text-gray-700">Password requirements</h3>
                    <ul className="mt-2 text-sm text-gray-600 list-disc list-inside">
                        <li>At least 8 characters (and up to 25 characters)</li>
                        <li>At least one lowercase character</li>
                        <li>At least a number</li>
                        <li>Inclusion of at least one special character or symbol, e.g., ! @ # ?</li>
                    </ul>
                </div>
                <div className="mt-auto">
                    <button type="submit" disabled={!isEditingPassword} className={`px-4 py-2 mt-4 font-semibold rounded-lg shadow-md focus:outline-none ${isEditingPassword ? "text-white bg-sky-500 hover:bg-sky-600" : "text-gray-400 bg-gray-200 cursor-not-allowed"}`}>
                        Change Password
                    </button>
                </div>
            </form>
        </div>
    );
};

// PasswordInput sub-component to ease the rendering of password inputs
const PasswordInput = ({ label, name, value, onChange, error, disabled }) => (
    <div className="w-full lg:w-1/2">
        <label className="block text-sm font-semibold text-gray-700">{label}</label>
        <input type="password" name={name} value={value} onChange={onChange} className={`w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 ${error ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"} ${disabled ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""}`} disabled={disabled} />
        {error && (
            <div className="flex items-center mt-1 text-xs text-red-500">
                <div className="w-2 mr-2">
                    <FaCircleExclamation />
                </div>
                {error}
            </div>
        )}
    </div>
);

PasswordInput.propTypes = {
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    error: PropTypes.string,
    disabled: PropTypes.bool.isRequired,
};

PasswordInformation.propTypes = {
    triggerAlert: PropTypes.func.isRequired,
};

export default PasswordInformation;
