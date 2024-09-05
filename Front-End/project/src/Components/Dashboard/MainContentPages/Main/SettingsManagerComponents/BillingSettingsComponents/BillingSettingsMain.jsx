import { useState } from "react";
import PropTypes from "prop-types";
import { FaPenToSquare, FaCircleExclamation, FaBuildingColumns, FaCreditCard, FaPaypal } from "react-icons/fa6";

const BillingSettingsMain = ({ triggerAlert }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [settings, setSettings] = useState({
        billingEmail: "test@example.com",
        dayOfMonth: 15,
        paymentMethods: {
            bankTransfer: true,
            creditCard: false,
            paypal: true,
        },
        invoicePrefix: "INV-",
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, type, checked, value } = e.target;
        if (type === "checkbox") {
            setSettings((prevSettings) => ({
                ...prevSettings,
                paymentMethods: {
                    ...prevSettings.paymentMethods,
                    [name]: checked,
                },
            }));
        } else {
            setSettings((prevSettings) => ({
                ...prevSettings,
                [name]: type === "checkbox" ? checked : value,
            }));
        }
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
        if (!isEditing) {
            setErrors({});
        }
    };

    const validateInputs = () => {
        const newErrors = {};
        if (!settings.billingEmail || !/\S+@\S+\.\S+/.test(settings.billingEmail)) newErrors.billingEmail = "A valid email address is required.";
        if (!settings.dayOfMonth || settings.dayOfMonth < 1 || settings.dayOfMonth > 31) newErrors.dayOfMonth = "Please enter a valid day of the month.";
        if (!Object.values(settings.paymentMethods).includes(true)) newErrors.paymentMethods = "At least one payment method must be selected.";
        if (!settings.invoicePrefix) newErrors.invoicePrefix = "Invoice Prefix is required.";
        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = validateInputs();

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        triggerAlert("success", "Settings updated", "Billing settings have been updated successfully.");
        setIsEditing(false);
    };

    return (
        <div className="p-8 space-y-6 bg-white border rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-600">Billing Settings</h2>
                <button onClick={handleEditToggle} className="text-gray-500 hover:text-sky-600 focus:outline-none">
                    <FaPenToSquare size={18} />
                </button>
            </div>
            <hr className="border-gray-200" />
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-800">Payment Received Notification Email</label>
                        <input type="email" name="billingEmail" value={settings.billingEmail} onChange={handleChange} disabled={!isEditing} className={`px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.billingEmail ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-sky-500"} ${!isEditing && "bg-gray-100 text-gray-500 cursor-not-allowed"}`} />
                        {errors.billingEmail && (
                            <div className="flex items-center mt-1 text-xs text-red-500">
                                <FaCircleExclamation className="mr-1" />
                                {errors.billingEmail}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-800">Invoice Prefix</label>
                        <input type="text" name="invoicePrefix" value={settings.invoicePrefix} onChange={handleChange} disabled={!isEditing} className={`px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.invoicePrefix ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-sky-500"} ${!isEditing && "bg-gray-100 text-gray-500 cursor-not-allowed"}`} />
                        {errors.invoicePrefix && (
                            <div className="flex items-center mt-1 text-xs text-red-500">
                                <FaCircleExclamation className="mr-1" />
                                {errors.invoicePrefix}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-800">Accepted Payment Methods</label>
                        <div className="mt-2 space-y-2">
                            <div className="flex items-center w-64 p-2 border border-gray-300 rounded-lg">
                                <input type="checkbox" id="bankTransfer" name="bankTransfer" checked={settings.paymentMethods.bankTransfer} onChange={handleChange} disabled={!isEditing} className="form-checkbox text-sky-500 focus:ring-sky-500" />
                                <label htmlFor="bankTransfer" className="flex items-center ml-2 text-sm font-semibold text-gray-800">
                                    <FaBuildingColumns className="mr-2 text-gray-500" />
                                    Bank Transfer
                                </label>
                            </div>
                            <div className="flex items-center w-64 p-2 border border-gray-300 rounded-lg">
                                <input type="checkbox" id="creditCard" name="creditCard" checked={settings.paymentMethods.creditCard} onChange={handleChange} disabled={!isEditing} className="form-checkbox text-sky-500 focus:ring-sky-500" />
                                <label htmlFor="creditCard" className="flex items-center ml-2 text-sm font-semibold text-gray-800">
                                    <FaCreditCard className="mr-2 text-gray-500" />
                                    Credit Card
                                </label>
                            </div>
                            <div className="flex items-center w-64 p-2 border border-gray-300 rounded-lg">
                                <input type="checkbox" id="paypal" name="paypal" checked={settings.paymentMethods.paypal} onChange={handleChange} disabled={!isEditing} className="form-checkbox text-sky-500 focus:ring-sky-500" />
                                <label htmlFor="paypal" className="flex items-center ml-2 text-sm font-semibold text-gray-800">
                                    <FaPaypal className="mr-2 text-gray-500" />
                                    PayPal
                                </label>
                            </div>
                        </div>
                        {errors.paymentMethods && (
                            <div className="flex items-center mt-1 text-xs text-red-500">
                                <FaCircleExclamation className="mr-1" />
                                {errors.paymentMethods}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-800">Day of Month Limit to Cancel License</label>
                        <input type="number" name="dayOfMonth" value={settings.dayOfMonth} onChange={handleChange} disabled={!isEditing} min="1" max="31" className={`px-4 py-2 w-28 mt-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.dayOfMonth ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-sky-500"} ${!isEditing && "bg-gray-100 text-gray-500 cursor-not-allowed"}`} />
                        {errors.dayOfMonth && (
                            <div className="flex items-center mt-1 text-xs text-red-500">
                                <FaCircleExclamation className="mr-1" />
                                {errors.dayOfMonth}
                            </div>
                        )}
                    </div>
                </div>

                <button type="submit" disabled={!isEditing} className={`px-4 py-2 font-semibold rounded-lg shadow-md focus:outline-none ${isEditing ? "text-white bg-sky-500 hover:bg-sky-600" : "text-gray-400 bg-gray-200 cursor-not-allowed"}`}>
                    Save Changes
                </button>
            </form>
        </div>
    );
};

BillingSettingsMain.propTypes = {
    triggerAlert: PropTypes.func.isRequired,
};

export default BillingSettingsMain;
