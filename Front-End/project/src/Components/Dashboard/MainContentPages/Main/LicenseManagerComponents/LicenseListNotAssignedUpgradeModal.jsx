import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { FaXmark, FaCircleInfo } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import LicenseService from "../../../../../Services/LicenseService";
import PackageService from "../../../../../Services/PackageService";
import QuantityManagementService from "../../../../../Services/QuantityManagementService";

const licenseService = new LicenseService();
const packageService = new PackageService();
const quantityService = new QuantityManagementService();

const LicenseListNotAssignedUpgradeModal = ({ isVisible, onClose, license }) => {
    const [selectedOption, setSelectedOption] = useState("");
    const [priceDifference, setPriceDifference] = useState(null);
    const [isUpgrade, setIsUpgrade] = useState(null);
    const [isRedirecting, setIsRedirecting] = useState(false);
    const [error, setError] = useState("");
    const [prices, setPrices] = useState({});
    const [selectedQuantity, setSelectedQuantity] = useState(1);
    const navigate = useNavigate();

    const baseTypes = ["Basic", "Medium", "Pro"];

    useEffect(() => {
        const fetchPackagePrices = async () => {
            try {
                const packagePrices = await packageService.GetPackagePrices();
                const priceMap = packagePrices.reduce((acc, pkg) => {
                    acc[pkg.packageName] = {
                        monthly: pkg.packageMonthlyPrice,
                        annual: pkg.packageAnnualPrice,
                    };
                    return acc;
                }, {});
                console.log("Fetched Prices:", priceMap); // Log prices here
                setPrices(priceMap);
            } catch (error) {
                console.error("Failed to fetch package prices", error);
                setError("Unable to fetch package prices. Please try again.");
            }
        };

        fetchPackagePrices();
    }, []);

    const [quantityDiscounts, setQuantityDiscounts] = useState([]);

    useEffect(() => {
        const fetchDiscounts = async () => {
            try {
                const discounts = await quantityService.GetAllActive();
                setQuantityDiscounts(discounts);
            } catch (error) {
                console.error("Failed to fetch quantity discounts", error);
            }
        };

        fetchDiscounts();
    }, []);

    const getDiscountForQuantity = (quantity) => {
        const discount = quantityDiscounts.find((discount) => discount.minQuantity <= quantity && (discount.maxQuantity === null || quantity <= discount.maxQuantity));
        return discount ? discount.discountPercentage : 0;
    };

    useEffect(() => {
        setSelectedOption("");
        setPriceDifference(null);
        setIsUpgrade(null);
        setIsRedirecting(false);
        setError("");
        setSelectedQuantity(1);
    }, [isVisible, license]);

    if (!isVisible) return null;

    const getBaseType = (type) => {
        if (!type) {
            console.error("Type is undefined or null");
            return null;
        }

        // Look for base types that are matched in the prices object
        const baseType = baseTypes.find((baseType) => type.startsWith(baseType));

        if (!baseType) {
            console.error(`Base type not found for type: ${type}`);
        }
        return baseType || null;
    };

    const getHighestVersionType = (baseType) => {
        if (!baseType) {
            console.error("Base type is undefined or null");
            return null;
        }

        const versionedTypes = Object.keys(prices).filter((key) => key.startsWith(baseType));

        if (versionedTypes.length === 0) {
            //console.error(`No versions found for base type: ${baseType}`);
            return null;
        }

        // Sort versions to get the highest
        versionedTypes.sort((a, b) => {
            const versionA = a.match(/(\d+)$/);
            const versionB = b.match(/(\d+)$/);

            const versionNumA = versionA ? parseInt(versionA[1], 10) : 0;
            const versionNumB = versionB ? parseInt(versionB[1], 10) : 0;

            return versionNumB - versionNumA; // Highest version first
        });

        return versionedTypes[0]; // Return the highest versioned type
    };

    // Calculate the price difference between two types of licenses based on quantity
    const calculatePriceDifference = (currentType, selectedType, quantity) => {
        // Get the base type for the current license and selected license
        const baseCurrentType = getBaseType(currentType);
        const baseSelectedType = getBaseType(selectedType);

        if (!baseCurrentType || !baseSelectedType) return;

        // Get the highest version type for the current base type and selected base type
        const currentPriceType = getHighestVersionType(baseCurrentType);
        const selectedPriceType = getHighestVersionType(baseSelectedType);

        if (!currentPriceType || !selectedPriceType) return;

        // Retrieve the monthly price for the current price type and selected price type, defaulting to 0 if not found
        const currentPrice = prices[currentPriceType]?.monthly || 0;
        const selectedPrice = prices[selectedPriceType]?.monthly || 0;

        console.log("Base Current Type:", baseCurrentType);
        console.log("Base Selected Type:", baseSelectedType);
        console.log("Current Price:", currentPrice);
        console.log("Selected Price:", selectedPrice);

        // Calculate the discount percentage based on the quantity of licenses
        const discountPercentage = getDiscountForQuantity(quantity);

        // Apply the discount
        const discountedPrice = selectedPrice * (1 - discountPercentage / 100);

        console.log("Discount Percentage:", discountPercentage);
        console.log("Discounted Price:", discountedPrice);

        // Calculate the price difference per license
        const differencePerLicense = discountedPrice - currentPrice;

        // Calculate the total price difference for the given quantity of licenses
        const totalDifference = differencePerLicense * quantity;

        console.log("Difference Per License:", differencePerLicense);
        console.log("Total Difference:", totalDifference);

        // Set the price difference and upgrade status
        setPriceDifference(totalDifference);
        setIsUpgrade(differencePerLicense > 0);
    };

    const handleOptionChange = (e) => {
        const selectedValue = e.target.value;
        setSelectedOption(selectedValue);
        calculatePriceDifference(license.type, selectedValue, selectedQuantity);
    };

    const handleQuantityChange = (e) => {
        const quantity = parseInt(e.target.value, 10);
        if (!isNaN(quantity) && quantity >= 1 && quantity <= license.licenses.length) {
            setSelectedQuantity(quantity);
            if (selectedOption) {
                // Calculate price difference immediately after updating quantity
                calculatePriceDifference(license.type, selectedOption, quantity);
            }
        }
    };

    const handleDecrement = () => {
        const newQuantity = Math.max(1, selectedQuantity - 1);
        setSelectedQuantity(newQuantity);
        if (selectedOption) {
            calculatePriceDifference(license.type, selectedOption, newQuantity);
        }
    };

    const handleIncrement = () => {
        const newQuantity = Math.min(license.licenses.length, selectedQuantity + 1);
        setSelectedQuantity(newQuantity);
        if (selectedOption) {
            calculatePriceDifference(license.type, selectedOption, newQuantity);
        }
    };

    // Data to pass to the checkout page on confirmation
    const handleConfirm = async () => {
        if (!selectedOption || selectedQuantity <= 0) {
            setError("Please select an option and quantity before proceeding.");
            return;
        }

        const confirmationData = license.licenses.slice(0, selectedQuantity).map((lic) => ({
            id: lic.id,
            type: lic.packageParentData.packageParentName,
            transactionId: lic.transactionData?.id || null,
            subscriptionType: lic.transactionData?.subscriptionType || null,
            selectedOption,
        }));

        const totalAmount = priceDifference || 0; // Total amount or refund
        const totalLabel = totalAmount >= 0 ? "Total to Pay" : "Total Refund";
        const totalAmountDisplay = Math.abs(totalAmount);

        try {
            await Promise.all(
                confirmationData.map(async (data) => {
                    const currentBaseType = getBaseType(data.type);
                    const selectedBaseType = getBaseType(data.selectedOption);

                    let actionType;
                    if (baseTypes.indexOf(currentBaseType) < baseTypes.indexOf(selectedBaseType)) {
                        actionType = 7; // Upgrade
                    } else {
                        actionType = 8; // Downgrade
                    }

                    const logMessage = `License ID: ${data.id}, Current Type: ${data.type}, Selected Option: ${data.selectedOption}`;

                    await licenseService.registerLicenseLogWithClient({
                        actionType,
                        logMessage,
                    });
                })
            );

            setIsRedirecting(true);

            setTimeout(() => {
                navigate("/dashboard/checkout-test", {
                    state: {
                        licenses: confirmationData,
                        totalAmount: totalAmountDisplay,
                        selectedQuantity,
                        totalLabel,
                    },
                });
            }, 1500);
        } catch (error) {
            console.error("Logging action error:", error);
            setError("An error occurred while logging the action. Please try again.");
        }
    };

    const getUpgradeOptions = (type) => {
        const baseCurrentType = getBaseType(type);
        const highestVersionCurrentType = getHighestVersionType(baseCurrentType);

        if (!highestVersionCurrentType) return [];

        let options = [];
        if (highestVersionCurrentType.startsWith("Basic")) {
            options = [
                { value: "Medium", label: "Upgrade to Medium", colorClass: "bg-green-100 text-green-700" },
                { value: "Pro", label: "Upgrade to Pro", colorClass: "bg-green-100 text-green-700" },
            ];
        } else if (highestVersionCurrentType.startsWith("Medium")) {
            options = [
                { value: "Pro", label: "Upgrade to Pro", colorClass: "bg-green-100 text-green-700" },
                { value: "Basic", label: "Downgrade to Basic", colorClass: "bg-red-100 text-red-700" },
            ];
        } else if (highestVersionCurrentType.startsWith("Pro")) {
            options = [
                { value: "Medium", label: "Downgrade to Medium", colorClass: "bg-red-100 text-red-700" },
                { value: "Basic", label: "Downgrade to Basic", colorClass: "bg-red-100 text-red-700" },
            ];
        }

        return options.map((option) => (
            <option key={option.value} value={option.value} className={option.colorClass}>
                {option.label}
            </option>
        ));
    };

    // Calculate the total amount to pay or refund for summary display
    const totalAmount = priceDifference || 0;
    const totalLabel = totalAmount >= 0 ? "Total to Pay" : "Total Refund";
    const totalValueClass = totalAmount >= 0 ? "text-gray-800" : "text-green-700";
    const totalAmountDisplay = Math.abs(totalAmount);

    return (
        <div role="dialog" aria-labelledby="upgrade-modal-title" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="relative w-full max-w-2xl p-6 transition-transform scale-100 bg-white rounded-lg shadow-xl transform-gpu">
                <div className="flex items-center justify-between pb-2 mb-4 border-b">
                    <h2 id="upgrade-modal-title" className="text-2xl font-bold text-gray-800">
                        Upgrade/Downgrade Licenses
                    </h2>
                    <button onClick={onClose} aria-label="Close" className="text-gray-600 hover:text-gray-900 focus:outline-none">
                        <FaXmark className="text-2xl" />
                    </button>
                </div>

                <div className="p-4 mb-4 bg-gray-100 rounded-lg">
                    <h3 className="mb-2 text-lg font-semibold text-gray-800">How to Use:</h3>
                    <ol className="space-y-2 text-sm text-gray-700 list-decimal list-inside">
                        <li>Choose the quantity of licenses you want to upgrade or downgrade.</li>
                        <li>From the dropdown menu below, select whether you want to upgrade or downgrade your current license.</li>
                        <li>If downgrading, you will receive a refund based on the remaining days of your current license.</li>
                        <li>If upgrading, you'll be prompted to pay the price difference for the new license.</li>
                        <li>Once you've made your selection, click "Confirm" to proceed to the checkout page.</li>
                    </ol>
                </div>

                <div className="p-4 mb-4 border border-gray-200 rounded-lg shadow-sm bg-gray-50">
                    <div className="flex items-center mb-4">
                        <FaCircleInfo className="mr-2 text-gray-500" />
                        <p className="text-sm font-semibold text-gray-600">Licenses Information:</p>
                    </div>
                    <div className="flex justify-between mb-2">
                        <p className="text-sm text-gray-600">
                            <strong>Current License Type:</strong>
                        </p>
                        <span className="text-sm font-medium text-gray-800">{license.type}</span>
                    </div>
                    {license.licenses && (
                        <div className="flex justify-between">
                            <p className="text-sm text-gray-600">
                                <strong>Quantity Available:</strong>
                            </p>
                            <span className="text-sm font-medium text-gray-800">
                                {license.licenses.length} {license.licenses.length === 1 ? "license" : "licenses"}
                            </span>
                        </div>
                    )}
                </div>

                <div className="mb-4">
                    <label htmlFor="quantity" className="block mb-2 text-sm font-medium text-gray-700">
                        Select Quantity
                    </label>
                    <div className="flex items-center bg-white border border-gray-300 rounded-md shadow-sm max-w-fit">
                        <button onClick={handleDecrement} className="flex items-center justify-center w-10 h-10 text-xl font-semibold text-gray-600 transition-colors duration-150 ease-in-out bg-gray-200 rounded-l-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            &minus;
                        </button>
                        <input id="quantity" type="number" min="1" max={license.licenses.length} value={selectedQuantity} onChange={handleQuantityChange} className="w-16 h-10 text-lg font-medium text-center bg-gray-100 border-0 focus:ring-2 focus:ring-blue-500 no-arrows" />
                        <button onClick={handleIncrement} className="flex items-center justify-center w-10 h-10 text-xl font-semibold text-gray-600 transition-colors duration-150 ease-in-out bg-gray-200 rounded-r-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            +
                        </button>
                    </div>
                </div>

                <div className="mb-4">
                    <select value={selectedOption} onChange={handleOptionChange} className="w-full p-3 mb-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">-- Select an option --</option>
                        {getUpgradeOptions(license.type)}
                    </select>

                    {error && <p className="text-sm text-red-600">{error}</p>}
                </div>
                {priceDifference !== null && (
                    <div className="flex justify-between p-4 mt-4 bg-gray-100 border border-gray-300 rounded-lg">
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-800">Summary</h3>
                            <div className="mt-2">
                                {!isUpgrade && totalAmount < 0 && (
                                    <p className="text-sm text-gray-600">
                                        Amount to Refund: <strong className="text-green-700">€{totalAmountDisplay.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                                    </p>
                                )}
                                {isUpgrade && totalAmount >= 0 && (
                                    <p className="text-sm text-gray-600">
                                        Amount to Pay: <strong className="text-gray-800">€{totalAmountDisplay.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                                    </p>
                                )}
                                <p className="text-sm text-gray-600">
                                    Selected Quantity: <strong>{selectedQuantity}</strong>
                                </p>

                                {isUpgrade ? (
                                    <p className="text-sm text-gray-600">
                                        Upgrading <strong>{selectedQuantity}</strong> {selectedQuantity === 1 ? "license" : "licenses"} to <strong>{selectedOption}</strong>
                                    </p>
                                ) : (
                                    <p className="text-sm text-gray-600">
                                        Downgrading <strong>{selectedQuantity}</strong> {selectedQuantity === 1 ? "license" : "licenses"} to <strong>{selectedOption}</strong>
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="w-1/3 ml-4">
                            <h3 className="text-lg font-semibold text-gray-800">{totalLabel}</h3>
                            <p className={`text-2xl font-bold ${totalValueClass}`}>€{totalAmountDisplay.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                            {totalAmount >= 0 && <p className="mt-1 text-sm text-gray-600">VAT calculated on checkout</p>}
                            {totalAmount < 0 && <p className="mt-1 text-sm text-gray-600">Refund will be credited to your account wallet</p>}
                        </div>
                    </div>
                )}
                {isRedirecting ? (
                    <div className="flex flex-col items-center p-4 mt-4 text-center bg-gray-100 rounded-lg">
                        <div className="w-8 h-8 mb-2 border-4 border-t-4 border-gray-300 rounded-full border-t-blue-500 animate-spin"></div>
                        <p className="text-sm text-gray-600">Redirecting to checkout page...</p>
                    </div>
                ) : (
                    <div className="flex justify-end mt-4 space-x-2">
                        <button onClick={handleConfirm} className={`flex items-center px-4 py-2 font-semibold text-white transition duration-300 rounded-lg ${!selectedOption ? "bg-gray-400 cursor-not-allowed" : "bg-sky-600 hover:bg-sky-700 active:bg-sky-800"}`} disabled={!selectedOption}>
                            Confirm
                        </button>
                        <button onClick={onClose} className="px-4 py-2 text-gray-700 transition duration-300 border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300">
                            Cancel
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

LicenseListNotAssignedUpgradeModal.propTypes = {
    isVisible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    license: PropTypes.shape({
        type: PropTypes.string.isRequired,
        licenses: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.string.isRequired,
                type: PropTypes.string.isRequired,
                transactionId: PropTypes.number,
                subscriptionType: PropTypes.number,
            })
        ),
    }).isRequired,
};

export default LicenseListNotAssignedUpgradeModal;
