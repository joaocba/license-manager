/* TODO:
- Improve the buttons of upgrade/downgrade license
- Remove unnecessary code
*/

import { useState } from "react";
import PropTypes from "prop-types";
import userAvatar from "../../../../../Resources/blank_avatar_person.png";
import { FaRegPenToSquare, FaBan, FaCheck, FaUserPlus, FaUserXmark } from "react-icons/fa6";
import { LuPackagePlus } from "react-icons/lu";
import LicenseService from "../../../../../Services/LicenseService";

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

// Capitalize the first letter of a string
const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

const LicenseListItem = ({ license, isSelected, onSelectLicense, triggerAlert, refreshLicenses, isEditing, onEdit, onCancel, users, onUpgradeDowngrade }) => {
    const [selectedUser, setSelectedUser] = useState(license.assignedTo ? license.assignedTo.id : "");

    const handleSave = async () => {
        const previousUserId = license.assignedTo ? license.assignedTo.id : "";

        if (!selectedUser) {
            triggerAlert("error", "Error", "Please select a user before saving the license.");
            return;
        }

        try {
            const licenseService = new LicenseService();

            // Log previous user unassignment action
            if (previousUserId) {
                await licenseService.registerLicenseLogWithClient({
                    actionType: 2, // Unassignment
                    fkUser: previousUserId,
                });
            } else {
                console.warn("Previous user ID is undefined");
            }

            await licenseService.updateLicenseUser(license.id, selectedUser);

            // Log user assignment action
            if (selectedUser) {
                await licenseService.registerLicenseLogWithClient({
                    actionType: 1, // Assignment
                    fkUser: selectedUser,
                });
            }

            triggerAlert("success", "Success", "User assigned to license successfully.");
            refreshLicenses(); // Refresh licenses after saving
            onEdit(null); // Exit edit mode
        } catch (error) {
            console.error("Failed to update license user", error);
            triggerAlert("error", "Error", "Unable to save changes. Please try again.");
        }
    };

    const handleDropdownChange = (event) => {
        setSelectedUser(event.target.value);
    };

    const handleEnableDisable = async (actionType) => {
        try {
            const status = actionType === "activate" ? 1 : 4;
            const licenseService = new LicenseService();
            await licenseService.licenseEnableDisable(license.id, status);

            // Log the enable or disable license action
            await licenseService.registerLicenseLogWithClient({
                actionType: actionType === "activate" ? 3 : 4, // Enable = 3, Disable = 4
                fkUser: license.assignedTo ? license.assignedTo.id : "",
            });

            triggerAlert("success", "Success", `License ${actionType}d successfully.`);
            refreshLicenses(); // Refresh licenses after the action
        } catch (error) {
            console.error(`Failed to ${actionType} license`, error);
            triggerAlert("error", "Error", `Unable to ${actionType} the license. Please try again.`);
        }
    };

    const handleUnassign = async () => {
        const previousUserId = license.assignedTo ? license.assignedTo.id : "";

        try {
            const licenseService = new LicenseService();

            await licenseService.unassignUserLicense(license.id);

            // Log previous user unassignment action
            if (previousUserId) {
                await licenseService.registerLicenseLogWithClient({
                    actionType: 2, // Unassignment
                    fkUser: previousUserId,
                });
            } else {
                console.warn("Previous user ID is undefined");
            }

            triggerAlert("success", "Success", "User unassigned from license successfully.");
            refreshLicenses();
        } catch (error) {
            console.error("Failed to unassign user", error);
            triggerAlert("error", "Error", "Unable to unassign the user. Please try again.");
        }
    };

    const getAssignedToText = () => {
        if (isEditing) {
            return (
                <select value={selectedUser} onChange={handleDropdownChange} className="py-2 pl-4 pr-4 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Select user</option>
                    {users.map((user) => (
                        <option key={user.idUser} value={user.idUser}>
                            {user.name}
                        </option>
                    ))}
                </select>
            );
        }
        if (license.status === "not assigned") return <span className="text-sm text-gray-400">Not assigned to a user</span>;
        if (license.assignedTo && typeof license.assignedTo === "object") {
            return (
                <div className="flex items-center">
                    <img src={userAvatar} alt="User Avatar" className="mr-3 rounded-full w-9 h-9 opacity-60" />
                    <div className="flex flex-col">
                        <span className="font-medium">{license.assignedTo.name}</span>
                        <span className="text-sm text-gray-400">{license.assignedTo.email}</span>
                    </div>
                </div>
            );
        }
        return <span className="text-sm text-gray-400">-</span>;
    };

    const getActionButtons = () => {
        if (isEditing) {
            return (
                <>
                    <button className="flex items-center px-3 py-1 font-semibold text-white bg-teal-400 rounded-lg focus:outline-none hover:bg-teal-500" onClick={handleSave}>
                        <FaCheck className="mr-2" />
                        Save
                    </button>
                    <button className="flex items-center px-3 py-1 font-semibold text-white bg-gray-400 rounded-lg focus:outline-none hover:bg-gray-500" onClick={onCancel}>
                        Cancel
                    </button>
                </>
            );
        }

        if (!license.assignedTo) return null; // No buttons if there's no assigned user

        switch (license.status) {
            case "not assigned":
                return (
                    <button className="flex items-center px-3 py-1 font-semibold text-white rounded-lg bg-sky-500 focus:outline-none hover:bg-sky-600">
                        <FaUserPlus className="mr-2" />
                        Assign To
                    </button>
                );
            case "active":
                return (
                    <>
                        <button className="flex items-center px-3 py-1 font-semibold text-white rounded-lg bg-sky-500 focus:outline-none hover:bg-sky-600" onClick={() => onEdit(license.id)}>
                            <FaRegPenToSquare className="mr-2" />
                            Edit
                        </button>
                        <button className="flex items-center px-3 py-1 font-semibold text-white bg-red-400 rounded-lg focus:outline-none hover:bg-red-500" onClick={() => handleEnableDisable("disable")}>
                            <FaBan className="mr-2" />
                            Disable
                        </button>
                        <button className="flex items-center px-3 py-1 font-semibold text-white bg-yellow-400 rounded-lg focus:outline-none hover:bg-yellow-500" onClick={handleUnassign}>
                            <FaUserXmark className="mr-2" />
                            Unassign
                        </button>
                        <button className="flex items-center px-3 py-1 font-semibold text-white bg-teal-400 rounded-lg focus:outline-none hover:bg-teal-500" onClick={onUpgradeDowngrade}>
                            <LuPackagePlus className="mr-2" />
                            Upgrade/Downgrade
                        </button>
                    </>
                );
            case "inactive":
                return (
                    <>
                        <button className="flex items-center px-3 py-1 font-semibold text-white bg-teal-400 rounded-lg focus:outline-none hover:bg-teal-500" onClick={() => handleEnableDisable("activate")}>
                            <FaCheck className="mr-2" />
                            Enable
                        </button>
                        <button className="flex items-center px-3 py-1 font-semibold text-white bg-yellow-400 rounded-lg focus:outline-none hover:bg-yellow-500" onClick={handleUnassign}>
                            <FaUserXmark className="mr-2" />
                            Unassign
                        </button>
                        <button className="flex items-center px-3 py-1 font-semibold text-white bg-teal-400 rounded-lg focus:outline-none hover:bg-teal-500" onClick={onUpgradeDowngrade}>
                            <LuPackagePlus className="mr-2" />
                            Upgrade/Downgrade
                        </button>
                    </>
                );
            default:
                return null;
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case "active":
                return "bg-green-200 text-green-700";
            case "inactive":
                return "bg-red-200 text-red-700";
            case "not assigned":
                return "bg-yellow-200 text-yellow-700";
            case "expired":
                return "bg-gray-200 text-gray-700";
            default:
                return "bg-gray-200 text-gray-700";
        }
    };

    return (
        <>
            <tr className="h-20 border-b hover:bg-gray-100">
                <td className="px-4 align-middle">
                    <input type="checkbox" className="form-checkbox" checked={isSelected} onChange={onSelectLicense} />
                </td>
                <td className="px-4 align-middle">
                    <div className="flex flex-col">
                        <span className="font-medium">{license.packageParentData.packageParentName}</span>
                        <span className="text-xs text-gray-400">ID: {license.id}</span>
                    </div>
                </td>
                <td className="px-4 align-middle">{formatDate(license.purchaseDate)}</td>
                <td className="px-4 align-middle">{formatDate(license.expirationDate)}</td>
                <td className="px-4 align-middle">{getAssignedToText()}</td>
                <td className="px-4 align-middle">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusClass(license.status)}`}>{capitalizeFirstLetter(license.status)}</span>
                </td>
                <td className="px-4 align-middle">
                    <div className="flex space-x-2">{getActionButtons()}</div>
                </td>
            </tr>
        </>
    );
};

LicenseListItem.propTypes = {
    license: PropTypes.object.isRequired,
    isSelected: PropTypes.bool.isRequired,
    onSelectLicense: PropTypes.func.isRequired,
    triggerAlert: PropTypes.func.isRequired,
    refreshLicenses: PropTypes.func.isRequired,
    isEditing: PropTypes.bool.isRequired,
    onEdit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    users: PropTypes.array.isRequired,
    onUpgradeDowngrade: PropTypes.func.isRequired,
};

export default LicenseListItem;
