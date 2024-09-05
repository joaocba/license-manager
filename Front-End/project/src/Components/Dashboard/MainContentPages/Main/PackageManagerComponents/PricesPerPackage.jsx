import { useState } from "react";
import PropTypes from "prop-types";

const PricesPerPackage = ({ settings, triggerAlert }) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [pricesPerPackage, setPricesPerPackage] = useState(Array.isArray(settings.pricesPerPackage) ? settings.pricesPerPackage : settings.pricesPerPackage);
    const [newPrice, setNewPrice] = useState({
        type: "Monthly",
        prices: {
            basic: 10.0,
            medium: 20.0,
            pro: 30.0,
        },
        startDate: "",
        endDate: "",
    });
    const [errors, setErrors] = useState({});

    const handlePriceChange = (e) => {
        const { name, value } = e.target;
        setNewPrice((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handlePriceSliderChange = (e, tier) => {
        const { value } = e.target;
        setNewPrice((prev) => ({
            ...prev,
            prices: {
                ...prev.prices,
                [tier]: parseFloat(value),
            },
        }));
    };

    const validateInputs = () => {
        const newErrors = {};
        const requiredFields = ["startDate", "endDate"];

        requiredFields.forEach((field) => {
            if (!newPrice[field]) {
                newErrors[field] = "This field is required.";
            }
        });

        if (new Date(newPrice.startDate) >= new Date(newPrice.endDate)) {
            newErrors.endDate = "End date must be later than start date.";
        }

        if (Object.values(newPrice.prices).some((price) => price < 10 || price > 200)) {
            newErrors.prices = "Prices must be between 10 and 200.";
        }

        return newErrors;
    };

    const addPrice = () => {
        const newErrors = validateInputs();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setPricesPerPackage((prev) => [
            ...prev,
            {
                type: newPrice.type,
                prices: newPrice.prices,
                startDate: newPrice.startDate,
                endDate: newPrice.endDate,
            },
        ]);
        setNewPrice({
            type: "Monthly",
            prices: {
                basic: 10.0,
                medium: 20.0,
                pro: 30.0,
            },
            startDate: "",
            endDate: "",
        });
        setIsPopupOpen(false);
        triggerAlert("success", "Prices Per Package updated", "Prices Per Package have been updated successfully.");
    };

    const removePrice = (index) => {
        setPricesPerPackage((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="p-8 space-y-6 bg-white border rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-gray-600">Prices per Package</h2>
                    <h3 className="text-sm font-normal text-gray-400">Small description here</h3>
                </div>
            </div>
            <hr className="border-gray-200" />

            <table className="min-w-full border divide-y divide-gray-200">
                <thead>
                    <tr>
                        <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Type</th>
                        <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Price (€)</th>
                        <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Start Date</th>
                        <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">End Date</th>
                        <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {pricesPerPackage.map((price, index) => (
                        <tr key={index}>
                            <td className="px-6 py-4 text-sm text-gray-900">{price.type}</td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                                Basic: {price.prices.basic} €, Medium: {price.prices.medium} €, Pro: {price.prices.pro} €
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">{price.startDate}</td>
                            <td className="px-6 py-4 text-sm text-gray-900">{price.endDate}</td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                                <button onClick={() => removePrice(index)} className="px-2 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600">
                                    Remove
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={() => setIsPopupOpen(true)} className="px-4 py-2 mt-4 font-semibold text-white rounded-lg bg-sky-500 hover:bg-sky-600 focus:outline-none">
                Add New Price
            </button>

            {isPopupOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="w-full max-w-lg p-6 bg-white rounded-lg">
                        <h2 className="mb-4 text-xl font-semibold">Add New Price</h2>
                        <div className="mb-4">
                            <label className="block mb-1 text-sm font-medium text-gray-700">Type</label>
                            <div className="flex items-center space-x-4">
                                <label className="flex items-center">
                                    <input type="radio" name="type" value="Monthly" checked={newPrice.type === "Monthly"} onChange={handlePriceChange} className="mr-2" />
                                    Monthly
                                </label>
                                <label className="flex items-center">
                                    <input type="radio" name="type" value="Yearly" checked={newPrice.type === "Yearly"} onChange={handlePriceChange} className="mr-2" />
                                    Yearly
                                </label>
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1 text-sm font-medium text-gray-700">Start Date</label>
                            <input type="date" name="startDate" value={newPrice.startDate} onChange={handlePriceChange} className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.startDate ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-sky-500"}`} />
                            {errors.startDate && <div className="text-xs text-red-500">{errors.startDate}</div>}
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1 text-sm font-medium text-gray-700">End Date</label>
                            <input type="date" name="endDate" value={newPrice.endDate} onChange={handlePriceChange} className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.endDate ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-sky-500"}`} />
                            {errors.endDate && <div className="text-xs text-red-500">{errors.endDate}</div>}
                        </div>
                        {["basic", "medium", "pro"].map((tier) => (
                            <div key={tier} className="mb-4">
                                <label className="block mb-1 text-sm font-medium text-gray-700">{`Price for Tier ${tier.charAt(0).toUpperCase() + tier.slice(1)}`}</label>
                                <input type="range" min="10" max="200" step="0.01" value={newPrice.prices[tier]} onChange={(e) => handlePriceSliderChange(e, tier)} className="w-full accent-sky-500" />
                                <div className="flex items-center mt-2">
                                    <input type="number" value={newPrice.prices[tier]} onChange={(e) => handlePriceSliderChange(e, tier)} step="0.01" min="10" max="200" className={`px-4 py-2 border rounded-lg w-28 focus:outline-none focus:ring-2 ${errors.prices ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-sky-500"}`} />
                                    <span className="ml-2">€</span>
                                </div>
                            </div>
                        ))}
                        {errors.prices && <div className="text-xs text-red-500">{errors.prices}</div>}
                        <div className="flex justify-end space-x-4">
                            <button onClick={addPrice} className="px-4 py-2 text-white rounded-lg bg-sky-500 hover:bg-sky-600 focus:outline-none">
                                Save
                            </button>
                            <button onClick={() => setIsPopupOpen(false)} className="px-4 py-2 text-white bg-gray-500 rounded-lg hover:bg-gray-600 focus:outline-none">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

PricesPerPackage.propTypes = {
    settings: PropTypes.shape({
        pricesPerPackage: PropTypes.arrayOf(
            PropTypes.shape({
                type: PropTypes.string.isRequired,
                prices: PropTypes.shape({
                    basic: PropTypes.number.isRequired,
                    medium: PropTypes.number.isRequired,
                    pro: PropTypes.number.isRequired,
                }).isRequired,
                startDate: PropTypes.string,
                endDate: PropTypes.string,
            })
        ).isRequired,
    }).isRequired,
    triggerAlert: PropTypes.func.isRequired,
};

export default PricesPerPackage;
