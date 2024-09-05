/* TODO:
- Border ring of the input fields should be red when there is an error
*/

import { useState } from "react";
import PropTypes from "prop-types";
import { FaPenToSquare, FaCircleExclamation } from "react-icons/fa6";

const PackageNames = ({ packageNames, updateSettings, triggerAlert }) => {
    const [isEditingPackageNames, setIsEditing] = useState(false);
    const [errors, setErrors] = useState({});

    const handleEditToggle = () => {
        setIsEditing(!isEditingPackageNames);
        if (!isEditingPackageNames) {
            setErrors({});
        }
    };

    const validateInputs = () => {
        const newErrors = {};
        if (!packageNames.basic || packageNames.basic.length < 3) {
            newErrors.basic = "Tier 1 name is required and must be at least 3 characters.";
        }
        if (!packageNames.medium || packageNames.medium.length < 3) {
            newErrors.medium = "Tier 2 name is required and must be at least 3 characters.";
        }
        if (!packageNames.pro || packageNames.pro.length < 3) {
            newErrors.pro = "Tier 3 name is required and must be at least 3 characters.";
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

        triggerAlert("success", "Package Names updated", "Package names have been updated successfully.");
        setIsEditing(false);
    };

    return (
        <div className="p-8 space-y-6 bg-white border rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-gray-600">Names for Packages</h2>
                    <h3 className="text-sm font-normal text-gray-400">Small description here</h3>
                </div>
                <button onClick={handleEditToggle} className="text-gray-500 hover:text-sky-600 focus:outline-none">
                    <FaPenToSquare size={18} />
                </button>
            </div>
            <hr className="border-gray-200" />
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-800">Tier 1</label>
                        <input type="text" name="packageNames.basic" value={packageNames.basic} onChange={updateSettings} disabled={!isEditingPackageNames} className={`px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.isEditingPackageNames ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-sky-500"} ${!isEditingPackageNames ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""}`} />
                        {errors.basic && (
                            <div className="flex items-center mt-1 text-xs text-red-500">
                                <FaCircleExclamation className="mr-1" />
                                {errors.basic}
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-800">Tier 2</label>
                        <input type="text" name="packageNames.medium" value={packageNames.medium} onChange={updateSettings} disabled={!isEditingPackageNames} className={`px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.isEditingPackageNames ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-sky-500"} ${!isEditingPackageNames ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""}`} />
                        {errors.medium && (
                            <div className="flex items-center mt-1 text-xs text-red-500">
                                <FaCircleExclamation className="mr-1" />
                                {errors.medium}
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-800">Tier 3</label>
                        <input type="text" name="packageNames.pro" value={packageNames.pro} onChange={updateSettings} disabled={!isEditingPackageNames} className={`px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.isEditingPackageNames ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-sky-500"} ${!isEditingPackageNames ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""}`} />
                        {errors.pro && (
                            <div className="flex items-center mt-1 text-xs text-red-500">
                                <FaCircleExclamation className="mr-1" />
                                {errors.pro}
                            </div>
                        )}
                    </div>
                </div>
                <button type="submit" disabled={!isEditingPackageNames} className={`px-4 py-2 font-semibold rounded-lg shadow-md focus:outline-none ${isEditingPackageNames ? "text-white bg-sky-500 hover:bg-sky-600" : "text-gray-400 bg-gray-200 cursor-not-allowed"}`}>
                    Save Changes
                </button>
            </form>
        </div>
    );
};

PackageNames.propTypes = {
    packageNames: PropTypes.object.isRequired,
    updateSettings: PropTypes.func.isRequired,
    triggerAlert: PropTypes.func.isRequired,
};

export default PackageNames;
