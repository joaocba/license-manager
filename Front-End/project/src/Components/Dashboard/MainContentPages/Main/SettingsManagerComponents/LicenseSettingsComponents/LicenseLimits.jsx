import { useState } from "react";
import PropTypes from "prop-types";
import { FaPenToSquare, FaCircleExclamation } from "react-icons/fa6";

const LicenseLimits = ({ settings, updateSettings, triggerAlert }) => {
    const [isEditingLicenseLimits, setIsEditing] = useState(false);
    const [errors, setErrors] = useState({});

    const handleEditToggle = () => {
        setIsEditing(!isEditingLicenseLimits);
        if (!isEditingLicenseLimits) {
            setErrors({});
        }
    };

    const validateInputs = () => {
        const newErrors = {};

        if (settings.minLicensesToBuy <= 0) newErrors.minLicensesToBuy = "Minimum Licenses to Buy must be greater than 0.";
        if (settings.maxLicensesToBuy <= 0) newErrors.maxLicensesToBuy = "Maximum Licenses to Buy must be greater than 0.";
        if (settings.timeOffsetDays <= 0) newErrors.timeOffsetDays = "Time Offset Days must be greater than 0.";

        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = validateInputs();

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        triggerAlert("success", "License Limits updated", "License limits have been updated successfully.");
        setIsEditing(false);
    };

    return (
        <div className="p-8 space-y-6 bg-white border rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-gray-600">License Limits</h2>
                    <h3 className="text-sm font-normal text-gray-400">Small description here</h3>
                </div>
                <button onClick={handleEditToggle} className="text-gray-500 hover:text-sky-600 focus:outline-none">
                    <FaPenToSquare size={18} />
                </button>
            </div>
            <hr className="border-gray-200" />
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex flex-col">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
                        <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-800">Minimum Licenses to Buy</label>
                            <input type="number" name="minLicensesToBuy" value={settings.minLicensesToBuy} onChange={updateSettings} disabled={!isEditingLicenseLimits} className={`px-4 py-2 w-28 mt-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.minLicensesToBuy ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-sky-500"} ${!isEditingLicenseLimits && "bg-gray-100 text-gray-500 cursor-not-allowed"}`} />
                            {errors.minLicensesToBuy && (
                                <div className="flex items-center mt-1 text-xs text-red-500">
                                    <FaCircleExclamation className="mr-1" />
                                    {errors.minLicensesToBuy}
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-800">Maximum Licenses to Buy</label>
                            <input type="number" name="maxLicensesToBuy" value={settings.maxLicensesToBuy} onChange={updateSettings} disabled={!isEditingLicenseLimits} className={`px-4 py-2 w-28 mt-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.maxLicensesToBuy ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-sky-500"} ${!isEditingLicenseLimits && "bg-gray-100 text-gray-500 cursor-not-allowed"}`} />
                            {errors.maxLicensesToBuy && (
                                <div className="flex items-center mt-1 text-xs text-red-500">
                                    <FaCircleExclamation className="mr-1" />
                                    {errors.maxLicensesToBuy}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-800">How many Days a Monthly License has</label>
                    <input type="number" name="timeOffsetDays" value={settings.timeOffsetDays} onChange={updateSettings} disabled={!isEditingLicenseLimits} className={`px-4 py-2 mt-2 w-28 border rounded-lg focus:outline-none focus:ring-2 ${errors.timeOffsetDays ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-sky-500"} ${!isEditingLicenseLimits && "bg-gray-100 text-gray-500 cursor-not-allowed"}`} />
                    {errors.timeOffsetDays && (
                        <div className="flex items-center mt-1 text-xs text-red-500">
                            <FaCircleExclamation className="mr-1" />
                            {errors.timeOffsetDays}
                        </div>
                    )}
                </div>

                <div className="flex items-center mt-4">
                    <input type="checkbox" name="allowMultiplePackages" checked={settings.allowMultiplePackages} onChange={updateSettings} disabled={!isEditingLicenseLimits} className="w-5 h-5 border-gray-300 rounded text-sky-500" />
                    <label className="ml-3 text-sm font-semibold text-gray-800">Allow Multiple Packages Types per User</label>
                </div>
                <button type="submit" disabled={!isEditingLicenseLimits} className={`px-4 py-2 font-semibold rounded-lg shadow-md focus:outline-none ${isEditingLicenseLimits ? "text-white bg-sky-500 hover:bg-sky-600" : "text-gray-400 bg-gray-200 cursor-not-allowed"}`}>
                    Save Changes
                </button>
            </form>
        </div>
    );
};

LicenseLimits.propTypes = {
    settings: PropTypes.object.isRequired,
    updateSettings: PropTypes.func.isRequired,
    triggerAlert: PropTypes.func.isRequired,
};

export default LicenseLimits;
