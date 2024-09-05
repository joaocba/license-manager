import "react";
import { useLocation, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const CheckoutPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const {
        licenses: licenseData,
        totalAmount,
        selectedQuantity,
        totalLabel,
    } = location.state || {
        licenses: [],
        totalAmount: 0,
        selectedQuantity: 0,
        totalLabel: "",
    };

    // Function to convert subscription type number to string
    const getSubscriptionTypeText = (type) => {
        switch (type) {
            case 1:
                return "Monthly";
            case 2:
                return "Yearly";
            default:
                return "Unknown";
        }
    };

    // Log all received data
    console.log("Received data from location state:");
    console.log("License Data:", licenseData);
    console.log("Total Amount:", totalAmount);
    console.log("Selected Quantity:", selectedQuantity);
    console.log("Total Label:", totalLabel);

    return (
        <div className="container px-4 py-8 mx-auto">
            <h1 className="mb-8 text-3xl font-bold">Checkout</h1>
            <div className="p-6 mb-8 bg-white rounded-lg shadow-md">
                <h2 className="mb-4 text-2xl font-semibold">Review Your Changes</h2>
                <table className="min-w-full bg-white border rounded-lg shadow-sm table-fixed">
                    <thead className="bg-gray-100 border">
                        <tr>
                            <th className="px-4 py-2 text-left">License ID</th>
                            <th className="px-4 py-2 text-left">Transaction ID</th>
                            <th className="px-4 py-2 text-left">Subscription Type</th>
                            <th className="px-4 py-2 text-left">Current Type</th>
                            <th className="px-4 py-2 text-left">New Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        {licenseData.map((license) => (
                            <tr key={license.id} className="border-t">
                                <td className="px-4 py-2">{license.id}</td>
                                <td className="px-4 py-2">{license.transactionId}</td>
                                <td className="px-4 py-2">{`${getSubscriptionTypeText(license.subscriptionType)} (ID: ${license.subscriptionType})`}</td>
                                <td className="px-4 py-2">{license.type}</td>
                                <td className="px-4 py-2">{license.selectedOption}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="mt-4">
                    <h3 className="text-lg font-semibold">{totalLabel}</h3>
                    <p className={`text-2xl font-bold ${totalAmount >= 0 ? "text-gray-800" : "text-green-700"}`}>€{totalAmount.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    {/*                     {totalAmount >= 0 && <p className="mt-1 text-sm text-gray-600">VAT calculated on checkout</p>}
                    {totalAmount < 0 && <p className="mt-1 text-sm text-gray-600">Refund will be credited to your account wallet</p>} */}
                </div>
            </div>
            <div className="flex justify-end space-x-4">
                <button onClick={() => navigate(-1)} className="px-4 py-2 text-gray-700 transition duration-300 border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300">
                    Back
                </button>
                <button className="px-4 py-2 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">Confirm</button>
            </div>
        </div>
    );
};

CheckoutPage.propTypes = {
    licenses: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            transactionId: PropTypes.number,
            subscriptionType: PropTypes.number,
            currentType: PropTypes.string.isRequired,
            type: PropTypes.string.isRequired,
        })
    ),
};

export default CheckoutPage;
