import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { FaPenToSquare, FaCircleExclamation, FaCircleInfo } from "react-icons/fa6";

const timezones = ["UTC", "GMT"];
const languages = ["English", "Spanish", "French", "German", "Portuguese"];

const Tooltip = ({ message, show }) => <div className="relative flex items-center">{show && <div className="absolute w-48 p-2 text-sm text-white bg-gray-700 rounded-md left-10">{message}</div>}</div>;

Tooltip.propTypes = {
    message: PropTypes.string.isRequired,
    show: PropTypes.bool.isRequired,
};

const GlobalSettingsMain = ({ triggerAlert }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [showTooltip, setShowTooltip] = useState({
        notifications: false,
        maintenance: false,
    });
    const [settings, setSettings] = useState({
        siteName: "",
        enableNotifications: false,
        maintenanceMode: false,
        timezone: "",
        defaultLanguage: "",
        maintenanceStartDate: "",
        maintenanceEndDate: "",
        maintenanceMessage: "",
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest(".tooltip-wrapper")) {
                setShowTooltip({ notifications: false, maintenance: false });
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleTooltipToggle = (tooltip) => {
        setShowTooltip((prev) => ({
            notifications: false,
            maintenance: false,
            [tooltip]: !prev[tooltip],
        }));
    };

    const handleChange = (e) => {
        const { name, type, checked, value } = e.target;
        setSettings((prevSettings) => ({
            ...prevSettings,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
        if (isEditing) {
            setErrors({});
        }
    };

    const validateInputs = () => {
        const newErrors = {};

        if (!settings.siteName.trim()) newErrors.siteName = "Site name is required.";
        if (!settings.timezone.trim()) newErrors.timezone = "Timezone is required.";
        if (!settings.defaultLanguage.trim()) newErrors.defaultLanguage = "Default language is required.";
        if (settings.maintenanceMode) {
            if (!settings.maintenanceStartDate) newErrors.maintenanceStartDate = "Start date is required.";
            if (!settings.maintenanceEndDate) newErrors.maintenanceEndDate = "End date is required.";
            if (!settings.maintenanceMessage.trim()) newErrors.maintenanceMessage = "Custom message is required.";
        }

        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = validateInputs();

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        triggerAlert("success", "Settings updated", "Global settings have been updated successfully.");
        setIsEditing(false);
    };

    return (
        <div className="p-8 space-y-6 bg-white border rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-600">Global Settings</h2>
                <button onClick={handleEditToggle} className="text-gray-500 hover:text-sky-600 focus:outline-none">
                    <FaPenToSquare size={18} />
                </button>
            </div>
            <hr className="border-gray-200" />
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {/* Site Name */}
                    <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-800">Site Name</label>
                        <input type="text" name="siteName" value={settings.siteName} onChange={handleChange} disabled={!isEditing} className={`px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.siteName ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-sky-500"} ${!isEditing && "bg-gray-100 text-gray-500 cursor-not-allowed"}`} />
                        {errors.siteName && (
                            <div className="flex items-center mt-1 text-xs text-red-500">
                                <FaCircleExclamation className="mr-1" />
                                {errors.siteName}
                            </div>
                        )}
                    </div>

                    {/* Timezone */}
                    <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-800">Timezone</label>
                        <select name="timezone" value={settings.timezone} onChange={handleChange} disabled={!isEditing} className={`px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.timezone ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-sky-500"} ${!isEditing && "bg-gray-100 text-gray-500 cursor-not-allowed"}`}>
                            <option value="" disabled>
                                Select a timezone
                            </option>
                            {timezones.map((zone) => (
                                <option key={zone} value={zone}>
                                    {zone}
                                </option>
                            ))}
                        </select>
                        {errors.timezone && (
                            <div className="flex items-center mt-1 text-xs text-red-500">
                                <FaCircleExclamation className="mr-1" />
                                {errors.timezone}
                            </div>
                        )}
                    </div>

                    {/* Default Language */}
                    <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-800">Default Language</label>
                        <select name="defaultLanguage" value={settings.defaultLanguage} onChange={handleChange} disabled={!isEditing} className={`px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.defaultLanguage ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-sky-500"} ${!isEditing && "bg-gray-100 text-gray-500 cursor-not-allowed"}`}>
                            <option value="" disabled>
                                Select a language
                            </option>
                            {languages.map((language) => (
                                <option key={language} value={language}>
                                    {language}
                                </option>
                            ))}
                        </select>
                        {errors.defaultLanguage && (
                            <div className="flex items-center mt-1 text-xs text-red-500">
                                <FaCircleExclamation className="mr-1" />
                                {errors.defaultLanguage}
                            </div>
                        )}
                    </div>
                </div>

                {/* Checkbox Options */}
                <div className="flex flex-col space-y-4">
                    <div className="flex items-center space-x-3">
                        <input type="checkbox" name="enableNotifications" checked={settings.enableNotifications} onChange={handleChange} disabled={!isEditing} className="w-5 h-5 border-gray-300 rounded form-checkbox text-sky-500 focus:ring-sky-500" />
                        <div className="flex items-center tooltip-wrapper" onClick={() => handleTooltipToggle("notifications")}>
                            <label className="text-sm font-semibold text-gray-800">Enable Notifications</label>
                            <FaCircleInfo className="ml-2 text-gray-500 cursor-pointer" />
                            <Tooltip message="When enabled, you will receive notifications about important events." show={showTooltip.notifications} />
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <input type="checkbox" name="maintenanceMode" checked={settings.maintenanceMode} onChange={handleChange} disabled={!isEditing} className="w-5 h-5 border-gray-300 rounded form-checkbox text-sky-500 focus:ring-sky-500" />
                        <div className="flex items-center tooltip-wrapper" onClick={() => handleTooltipToggle("maintenance")}>
                            <label className="text-sm font-semibold text-gray-800">Maintenance Mode</label>
                            <FaCircleInfo className="ml-2 text-gray-500 cursor-pointer" />
                            <Tooltip message="When enabled, you can set a start and end date for maintenance periods and display a custom message." show={showTooltip.maintenance} />
                        </div>
                    </div>
                </div>

                {/* Maintenance Mode Details */}
                {settings.maintenanceMode && (
                    <div className="pt-4 mt-4 border-t border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-700">Maintenance Mode Details</h3>
                        <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2">
                            <div className="flex flex-col">
                                <label className="text-sm font-semibold text-gray-800">Start Date</label>
                                <input type="date" name="maintenanceStartDate" value={settings.maintenanceStartDate} onChange={handleChange} disabled={!isEditing} className={`px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.maintenanceStartDate ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-sky-500"} ${!isEditing && "bg-gray-100 text-gray-500 cursor-not-allowed"}`} />
                                {errors.maintenanceStartDate && (
                                    <div className="flex items-center mt-1 text-xs text-red-500">
                                        <FaCircleExclamation className="mr-1" />
                                        {errors.maintenanceStartDate}
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col">
                                <label className="text-sm font-semibold text-gray-800">End Date</label>
                                <input type="date" name="maintenanceEndDate" value={settings.maintenanceEndDate} onChange={handleChange} disabled={!isEditing} className={`px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.maintenanceEndDate ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-sky-500"} ${!isEditing && "bg-gray-100 text-gray-500 cursor-not-allowed"}`} />
                                {errors.maintenanceEndDate && (
                                    <div className="flex items-center mt-1 text-xs text-red-500">
                                        <FaCircleExclamation className="mr-1" />
                                        {errors.maintenanceEndDate}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col mt-4">
                            <label className="text-sm font-semibold text-gray-800">Custom Message</label>
                            <textarea name="maintenanceMessage" value={settings.maintenanceMessage} onChange={handleChange} disabled={!isEditing} rows="4" className={`px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.maintenanceMessage ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-sky-500"} ${!isEditing && "bg-gray-100 text-gray-500 cursor-not-allowed"}`} />
                            {errors.maintenanceMessage && (
                                <div className="flex items-center mt-1 text-xs text-red-500">
                                    <FaCircleExclamation className="mr-1" />
                                    {errors.maintenanceMessage}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <button type="submit" disabled={!isEditing} className={`px-4 py-2 font-semibold rounded-lg shadow-md focus:outline-none ${isEditing ? "text-white bg-sky-500 hover:bg-sky-600" : "text-gray-400 bg-gray-200 cursor-not-allowed"}`}>
                    Save Changes
                </button>
            </form>
        </div>
    );
};

GlobalSettingsMain.propTypes = {
    triggerAlert: PropTypes.func.isRequired,
};

export default GlobalSettingsMain;
