import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { FaPenToSquare } from "react-icons/fa6";
import QuantityManagementService from "../../../../../../Services/QuantityManagementService";
import QuantityManagementFetchClient from "../../../../../../FetchClients/QuantityManagementFetchClient"
const DiscountRates = ({ triggerAlert }) => {
    const [isEditingDiscountRates, setIsEditingDiscountRates] = useState(false);
    const [errors, setErrors] = useState({});
    const [componentSettings, setComponentSettings] = useState({});
    const service = new QuantityManagementService(QuantityManagementFetchClient);

    useEffect(() => {
        const fetchQuantityManagementData = async() => {
            const data = await service.GetAllActive();
            setComponentSettings(data);
        }

        fetchQuantityManagementData();
    }, []);



    const handleEditToggle = () => {
        setIsEditingDiscountRates(!isEditingDiscountRates);
        if (!isEditingDiscountRates) {
            setErrors({});
        }
    };

    const handleSliderChange = (e, name, componentKey) => {
        const { value } = e.target;
        setComponentSettings(prevSettings => ({
            ...prevSettings,
            [componentKey]: {
                ...prevSettings[componentKey],
                [name]: parseFloat(value)
            }
        }));
    };

    const handleNumberInputChange = (e, name, componentKey) => {
        const { value } = e.target;
        setComponentSettings(prevSettings => ({
            ...prevSettings,
            [componentKey]: {
                ...prevSettings[componentKey],
                [name]: parseFloat(value)
            }
        }));
    };

    const validateInputs = () => {
        const newErrors = {};
        // Add validation logic here
        Object.keys(componentSettings).forEach((range) => {
            const value = componentSettings[range].discountPercentage;
            if (value < 0 || value > 100) {
                newErrors[`discountRates${range}`] = "Discount rate must be between 0 and 100.";
            }
        });
        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = validateInputs();

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const sendData = () => {
            Object.keys(componentSettings).forEach(async (range) => {
                await service.UpdateDiscounts(componentSettings[range]);
            })
        }
        sendData();

        triggerAlert("success", "Discount Rates updated", "Discount rates have been updated successfully.");
        setIsEditingDiscountRates(false);
    };

    return (
        <div className="p-8 space-y-6 bg-white border rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-gray-600">Discount Rates</h2>
                    <h3 className="text-sm font-normal text-gray-400">Small description here</h3>
                </div>
                <button onClick={handleEditToggle} className="text-gray-500 hover:text-sky-600 focus:outline-none">
                    <FaPenToSquare size={18} />
                </button>
            </div>
            <hr className="border-gray-200" />
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {
                        Object.entries(componentSettings).map(([key, prop]) => (
                            <div key={key} className="flex flex-col">
                                <label className="text-sm font-semibold text-gray-800">Tier {prop.minQuantity}-{prop.maxQuantity !== null ? prop.maxQuantity : "\u{221E}"}</label>
                                <input type="range" name={`discountRates.${key}`} value={prop.discountPercentage} min="0" max="100" step="0.01" onChange={(e) => handleSliderChange(e, "discountPercentage", key)} disabled={!isEditingDiscountRates} className="w-full accent-sky-500" />
                                <div className="flex items-center mt-2">
                                    <input type="number" name={`discountRates.${key}`} value={prop.discountPercentage} onChange={(e) => handleNumberInputChange(e, "discountPercentage", key)} disabled={!isEditingDiscountRates} step="0.01" min="0" max="100" className={`px-4 py-2 w-28 border rounded-lg focus:outline-none focus:ring-2 ${errors[`discountRates${key}`] ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-sky-500"} ${!isEditingDiscountRates && "bg-gray-100 text-gray-500 cursor-not-allowed"}`} />
                                    <span className="ml-2">%</span>
                                </div>
                            </div>))
                    }
                </div>
                <button type="submit" disabled={!isEditingDiscountRates} className={`px-4 py-2 font-semibold rounded-lg shadow-md focus:outline-none ${isEditingDiscountRates ? "text-white bg-sky-500 hover:bg-sky-600" : "text-gray-400 bg-gray-200 cursor-not-allowed"}`}>
                    Save Changes
                </button>
            </form>
        </div>
    );
};

DiscountRates.propTypes = {
    triggerAlert: PropTypes.func.isRequired,
};

export default DiscountRates;
