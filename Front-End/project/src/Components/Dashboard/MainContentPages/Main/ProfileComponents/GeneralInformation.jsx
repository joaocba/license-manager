import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import UserContext from "../../../../Context/UserContext";
import UserService from "../../../../../Services/UserService";
import UserFetchClient from "../../../../../FetchClients/UserFetchClient";
import { FaPenToSquare, FaCircleExclamation } from "react-icons/fa6";

const GeneralInformation = ({ triggerAlert }) => {
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();

    // State for editing and form values
    const [isEditing, setIsEditing] = useState(false);
    const [editableUser, setEditableUser] = useState({
        name: user?.name || "",
        email: user?.email || "",
        phoneNumber: user?.phoneNumber || "",
        address: user?.address || "",
        country: user?.country || "",
    });
    const [errors, setErrors] = useState({});
    
    // Effect to update editableUser when user context changes
    useEffect(() => {
        setEditableUser({
            name: user?.name || "",
            email: user?.email || "",
            phoneNumber: user?.phoneNumber || "",
        });
        setErrors({});
    }, [user]);

    // Toggle editing mode
    const handleEditToggle = () => {
        setIsEditing(!isEditing);
        if (!isEditing) {
            // Reset editableUser to current user data when entering edit mode
            setEditableUser({
                name: user?.name || "",
                email: user?.email || "",
                phoneNumber: user?.phoneNumber || "",
            });
        } else {
            // Reset editableUser and errors when exiting edit mode
            setEditableUser({
                name: user?.name || "",
                email: user?.email || "",
                phoneNumber: user?.phoneNumber || "",
            });
            setErrors({});
        }
    };

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditableUser((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Validate form inputs
    const validateInputs = () => {
        const newErrors = {};

        // Validate name
        if (!editableUser.name.trim()) newErrors.name = "Name is required.";

        // Validate email
        if (!editableUser.email.trim()) {
            newErrors.email = "Email is required.";
        } else if (!/\S+@\S+\.\S+/.test(editableUser.email)) {
            newErrors.email = "Email is invalid.";
        }

        // Validate phone number
        if (!editableUser.phoneNumber.trim()) {
            newErrors.phoneNumber = "Phone number is required.";
        } else if (!/^\d{9}$/.test(editableUser.phoneNumber)) {
            newErrors.phoneNumber = "Phone number is invalid.";
        }

        return newErrors;
    };

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();
        const newErrors = validateInputs();

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const changes = {};
        if (editableUser.name !== user.name) changes.name = editableUser.name;
        if (editableUser.email !== user.email) changes.email = editableUser.email;
        if (editableUser.phoneNumber !== user.phoneNumber) changes.phoneNumber = editableUser.phoneNumber;
        if (editableUser.address !== user.address) changes.address = editableUser.address;
        if (editableUser.country !== user.country) changes.country = editableUser.country;

        if (Object.keys(changes).length === 0) {
            setIsEditing(false);
            return;
        }

        try {
            const userService = new UserService(UserFetchClient);
            const updatedUser = await userService.updateUser(changes);
            const token = localStorage.getItem("token") || sessionStorage.getItem("token");

            setUser(updatedUser);
            setIsEditing(false);

            if (changes.email) {
                localStorage.removeItem("token");
                sessionStorage.removeItem("token");
                triggerAlert("success", "Success", "Email updated successfully. Please login again, redirecting...");
                setTimeout(() => navigate("/login"), 2500);
            } else {
                const userData = await userService.getUserData(token);
                setUser(userData);
                triggerAlert("success", "Success", "Profile updated successfully.");
            }
        } catch (error) {
            console.error("Error updating user:", error);
            triggerAlert("error", "Error", "An error occurred while updating your profile.");
        }
    };

    // Format date for display
    const formatDate = (dateString) => {
        return new Date(dateString)
            .toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            })
            .replace(/ /g, " ");
    };

    return (
        <div className="flex flex-col flex-1 p-8 space-y-6 bg-white border rounded-lg shadow-sm h-fit">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-600">General information</h2>
                <button onClick={handleEditToggle} className="text-gray-500 hover:text-sky-600 focus:outline-none">
                    <FaPenToSquare size={18} />
                </button>
            </div>
            <hr className="border-gray-200" />
            <div className="space-y-4">
                {[
                    { label: "Name", value: editableUser.name, name: "name", type: "text", error: errors.name },
                    { label: "Email", value: editableUser.email, name: "email", type: "email", error: errors.email },
                    { label: "Phone", value: editableUser.phoneNumber, name: "phoneNumber", type: "text", error: errors.phoneNumber },
                    { label: "Address", value: editableUser.address, name: "address", type: "text", error: "" },
                    { label: "Country", value: editableUser.country, name: "country", type: "text", error: "" },
                ].map(({ label, value, name, type, error }) => (
                    <div key={name} className="lg:flex lg:items-center lg:space-x-4">
                        <label className="py-2 text-sm font-semibold text-gray-800 lg:w-36">{label}</label>
                        <div className="w-full">
                            <input type={type} name={name} value={value} onChange={handleChange} className={`w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 ${error ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"} ${!isEditing && "bg-gray-100 text-gray-500 cursor-not-allowed"}`} disabled={!isEditing} />
                            {error && (
                                <div className="flex items-center mt-1 text-xs text-red-500">
                                    <FaCircleExclamation className="mr-1" />
                                    {error}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                <div className="lg:flex lg:items-center lg:space-x-4">
                    <label className="py-2 text-sm font-semibold text-gray-800 lg:w-36">Organization</label>
                    <div className="w-full">
                        <input type="text" value={user?.client?.clientName || ""} className="w-full px-4 py-2 mt-2 text-gray-500 bg-gray-100 border rounded-lg cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-200 lg:mt-0" disabled />
                    </div>
                </div>
                <div className="lg:flex lg:items-center lg:space-x-4">
                    <label className="py-2 text-sm font-semibold text-gray-800 lg:w-36">Role</label>
                    <div className="w-full">
                        <input type="text" value={user?.role?.role1 || ""} className="w-full px-4 py-2 mt-2 text-gray-500 bg-gray-100 border rounded-lg cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-200 lg:mt-0" disabled />
                    </div>
                </div>
                <div className="lg:flex lg:items-center lg:space-x-4">
                    <label className="py-2 text-sm font-semibold text-gray-800 lg:w-36">Member since</label>
                    <div className="w-full">
                        <input type="text" value={user?.insertDate ? formatDate(user.insertDate) : ""} className="w-full px-4 py-2 mt-2 text-gray-500 bg-gray-100 border rounded-lg cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-200 lg:mt-0" disabled />
                    </div>
                </div>
            </div>
            <div className="mt-auto">
                <button onClick={handleSubmit} disabled={!isEditing} className={`px-4 py-2 mt-4 font-semibold rounded-lg shadow-md focus:outline-none ${isEditing ? "text-white bg-sky-500 hover:bg-sky-600" : "text-gray-400 bg-gray-200 cursor-not-allowed"}`}>
                    Update Details
                </button>
            </div>
        </div>
    );
};

GeneralInformation.propTypes = {
    triggerAlert: PropTypes.func.isRequired,
};

export default GeneralInformation;
