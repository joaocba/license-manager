import { useState } from "react";
import PropTypes from "prop-types";
import { FaAward, FaUserCheck } from "react-icons/fa6";
import { LuPackagePlus } from "react-icons/lu";
import LicenseService from "../../../../../Services/LicenseService";

// Define the icon with different colors for each license type
const iconMap = {
    Basic: <FaAward className="text-4xl text-sky-400 opacity-20" />,
    Medium: <FaAward className="text-4xl text-teal-400 opacity-20" />,
    Pro: <FaAward className="text-4xl text-yellow-500 opacity-20" />,
};

// Helper function to extract base license type
const getBaseLicenseType = (type) => {
    return type.split(" ")[0]; // Split by space and take the first part (e.g., "Basic V2" -> "Basic")
};

// Format date for display in "YYYY-MM-DD" format
const formatDate = (dateString) => {
    if (!dateString) {
        return <span className="text-sm text-gray-400">-</span>;
    }
    const date = new Date(dateString);
    if (isNaN(date)) {
        return <span className="text-sm text-gray-400">-</span>;
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

const LicenseListNotAssignedItem = ({ license, triggerAlert, refreshLicenses, isEditing, onEdit, onCancel, users, onUpgradeDowngradeClick }) => {
    const [selectedUser, setSelectedUser] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleSave = async (userId) => {
        // Ensure a user is selected before saving
        if (!userId) {
            triggerAlert("error", "Error", "Please select a user before saving.");
            return;
        }

        try {
            const licenseService = new LicenseService();
            await licenseService.assignUserLicense(license.typeId, userId);

            // Log the user assignment action
            await licenseService.registerLicenseLogWithClient({
                actionType: 1,
                fkUser: userId,
            });

            triggerAlert("success", "Success", "License assigned successfully!");
            refreshLicenses(); // Refresh licenses after saving
            onCancel(); // Exit edit mode
            setIsDropdownOpen(false); // Close dropdown
        } catch (error) {
            console.error("Failed to assign license user", error);
            triggerAlert("error", "Error", "Failed to save changes.");
        }
    };

    const handleDropdownChange = (event) => {
        const userId = event.target.value;
        setSelectedUser(userId);
        handleSave(userId); // Automatically save after selecting a user
    };

    const handleCancel = () => {
        setIsDropdownOpen(false);
        onCancel();
    };

    const getAssignedToText = () => {
        if (isEditing) {
            return (
                <div className="relative flex items-center space-x-2">
                    <select value={selectedUser} onChange={handleDropdownChange} className="w-full px-4 py-2 overflow-auto text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm max-h-60 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">Select user</option>
                        {users.map((user) => (
                            <option key={user.idUser} value={user.idUser}>
                                {user.name}
                            </option>
                        ))}
                    </select>
                    <button onClick={handleCancel} className="flex items-center px-3 py-1 font-semibold text-white bg-gray-400 rounded-lg focus:outline-none hover:bg-gray-500">
                        Cancel
                    </button>
                </div>
            );
        } else {
            return (
                <div className="flex space-x-2">
                    <button
                        className="flex items-center px-3 py-1 font-semibold text-white rounded-lg bg-sky-500 focus:outline-none hover:bg-sky-600"
                        onClick={() => {
                            onEdit(license.id);
                            setIsDropdownOpen(true);
                        }}
                    >
                        <FaUserCheck className="mr-2" />
                        Assign To
                    </button>
                    <button
                        className="flex items-center px-3 py-1 font-semibold text-white bg-teal-400 rounded-lg focus:outline-none hover:bg-teal-500"
                        onClick={() => onUpgradeDowngradeClick(license)} // Open the modal
                    >
                        <LuPackagePlus className="mr-2" />
                        Upgrade/Downgrade
                    </button>
                </div>
            );
        }
    };

    // Use the helper function to get the correct icon
    const baseType = getBaseLicenseType(license.type);
    const icon = iconMap[baseType] || <FaAward className="text-4xl text-gray-400 opacity-20" />;

    return (
        <tr className="border-b hover:bg-gray-50">
            <td className="px-4 py-4">
                <div className="flex items-center space-x-2">
                    {icon}
                    <span className="font-medium">{license.type}</span>
                </div>
            </td>
            <td className="px-4 py-4">
                <span className="">{formatDate(license.purchaseDate)}</span>
            </td>
            <td className="px-4 py-4">
                <span className="">{formatDate(license.expirationDate)}</span>
            </td>
            <td className="px-4 py-4">
                <span className="">{license.quantity}</span>
            </td>
            <td className="px-6 py-4 text-center">{getAssignedToText()}</td>
        </tr>
    );
};

LicenseListNotAssignedItem.propTypes = {
    license: PropTypes.shape({
        id: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        typeId: PropTypes.string.isRequired,
        purchaseDate: PropTypes.string,
        expirationDate: PropTypes.string,
        quantity: PropTypes.number.isRequired,
    }).isRequired,
    triggerAlert: PropTypes.func.isRequired,
    refreshLicenses: PropTypes.func.isRequired,
    isEditing: PropTypes.bool.isRequired,
    onEdit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    users: PropTypes.arrayOf(
        PropTypes.shape({
            idUser: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
        })
    ).isRequired,
    onUpgradeDowngradeClick: PropTypes.func.isRequired,
};

export default LicenseListNotAssignedItem;
