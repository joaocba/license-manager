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

const LicenseListUpgradeModal = ({ isVisible, onClose, license, licenses }) => {
    const [selectedOptions, setSelectedOptions] = useState({});
    const [priceDifferences, setPriceDifferences] = useState({});
    const [prices, setPrices] = useState({});
    const [isBulk, setIsBulk] = useState(false);
    const [isRedirecting, setIsRedirecting] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const baseTypes = ["Basic", "Medium", "Pro"];

    useEffect(() => {
        if (isVisible) {
            const fetchPackagePrices = async () => {
                try {
                    const fetchedPrices = await packageService.GetPackagePrices();
                    const priceMap = fetchedPrices.reduce((acc, pkg) => {
                        acc[pkg.packageName] = {
                            monthly: pkg.packageMonthlyPrice,
                            annual: pkg.packageAnnualPrice,
                        };
                        return acc;
                    }, {});
                    console.log("Fetched Prices:", priceMap);
                    setPrices(priceMap);
                } catch (error) {
                    console.error("Failed to fetch prices:", error);
                    setError("Unable to fetch package prices. Please try again.");
                }
            };

            fetchPackagePrices();
        }

        // Check if the licenses are bulk or single
        if (licenses && Array.isArray(licenses) && licenses.length > 0) {
            setIsBulk(true);
            const initialSelectedOptions = licenses.reduce((acc, lic) => {
                acc[lic.id] = ""; // Initialize with empty string
                return acc;
            }, {});
            setSelectedOptions(initialSelectedOptions);
        } else if (license) {
            setIsBulk(false);
            setSelectedOptions({ [license.id]: "" });
        } else {
            setIsBulk(false);
            setSelectedOptions({});
        }

        setPriceDifferences({});
        setIsRedirecting(false);
        setError("");
    }, [isVisible, license, licenses]);

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

    if (!isVisible) return null;

    const getDiscountForQuantity = (quantity) => {
        const discount = quantityDiscounts.find((discount) => discount.minQuantity <= quantity && (discount.maxQuantity === null || quantity <= discount.maxQuantity));
        return discount ? discount.discountPercentage : 0;
    };

    const getBaseType = (type) => {
        // Look for base types that are matched in the prices object
        const baseType = baseTypes.find((baseType) => type.startsWith(baseType));
        return baseType || null;
    };

    const getHighestVersionType = (baseType) => {
        if (!baseType) return null;

        const versionedTypes = Object.keys(prices).filter((key) => key.startsWith(baseType));

        if (versionedTypes.length === 0) {
            //console.log(`No versions found for base type: ${baseType}`);
            return null;
        }

        // Sort versions to get the highest (V2 is higher than V1)
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

        if (!baseCurrentType || !baseSelectedType) return 0;

        // Get the highest version type for the current base type and selected base type
        const currentPriceType = getHighestVersionType(baseCurrentType);
        const selectedPriceType = getHighestVersionType(baseSelectedType);

        if (!currentPriceType || !selectedPriceType) return 0;

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

        return totalDifference;
    };

    const handleOptionChange = (id, value) => {
        setSelectedOptions((prevOptions) => ({
            ...prevOptions,
            [id]: value,
        }));

        // Calculate price difference based on the updated option
        const licenseData = isBulk ? licenses.find((lic) => lic.id === id) : license;

        if (licenseData) {
            const priceDifference = calculatePriceDifference(licenseData.type, value, 1); // Pass the quantity here
            setPriceDifferences((prevDifferences) => ({
                ...prevDifferences,
                [id]: priceDifference,
            }));
        } else {
            console.error(`License with id ${id} not found.`);
        }
    };

    // Data to pass to the checkout page on confirmation
    const handleConfirm = async () => {
        const confirmationData = (isBulk ? licenses : [license]).map((lic) => ({
            id: lic.id,
            type: lic.packageParentData.packageParentName,
            transactionId: lic.transactionData?.id || null,
            subscriptionType: lic.transactionData?.subscriptionType || null,
            selectedOption: selectedOptions[lic.id],
        }));

        if (confirmationData.some((data) => !selectedOptions[data.id])) {
            setError("Please select an option for all licenses before proceeding.");
            return;
        }

        try {
            await Promise.all(
                confirmationData.map(async (data) => {
                    const currentBaseType = getBaseType(data.type);
                    const selectedBaseType = getBaseType(data.selectedOption);

                    let actionType;
                    if (currentBaseType && selectedBaseType) {
                        actionType = baseTypes.indexOf(currentBaseType) < baseTypes.indexOf(selectedBaseType) ? 7 : 8;
                    } else {
                        console.error("Base type not found for currentType or selectedType.");
                        return;
                    }

                    const logMessage = `License ID: ${data.id}, Current Type: ${data.type}, Selected Option: ${data.selectedOption}`;

                    await licenseService.registerLicenseLogWithClient({
                        actionType,
                        logMessage,
                    });
                })
            );

            setIsRedirecting(true);

            // Calculate the total amount to pay or refund
            const totalToPay = Object.values(priceDifferences)
                .filter((diff) => diff > 0)
                .reduce((acc, diff) => acc + diff, 0);
            const totalRefund = Object.values(priceDifferences)
                .filter((diff) => diff < 0)
                .reduce((acc, diff) => acc + diff, 0);
            const totalAmount = totalToPay + totalRefund;

            const totalAmountDisplay = Math.abs(totalAmount);
            const totalLabel = totalAmount < 0 ? "Total Refund" : "Total to Pay";

            setTimeout(() => {
                navigate("/dashboard/checkout-test", {
                    state: {
                        licenses: confirmationData,
                        totalAmount: totalAmountDisplay,
                        selectedQuantity: isBulk ? licenses.length : 1,
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

        const options = [];
        if (highestVersionCurrentType.startsWith("Basic")) {
            options.push({ value: "Medium", label: "Upgrade to Medium", colorClass: "bg-green-100 text-green-700" }, { value: "Pro", label: "Upgrade to Pro", colorClass: "bg-green-100 text-green-700" });
        } else if (highestVersionCurrentType.startsWith("Medium")) {
            options.push({ value: "Pro", label: "Upgrade to Pro", colorClass: "bg-green-100 text-green-700" }, { value: "Basic", label: "Downgrade to Basic", colorClass: "bg-red-100 text-red-700" });
        } else if (highestVersionCurrentType.startsWith("Pro")) {
            options.push({ value: "Medium", label: "Downgrade to Medium", colorClass: "bg-red-100 text-red-700" }, { value: "Basic", label: "Downgrade to Basic", colorClass: "bg-red-100 text-red-700" });
        }

        return options.map((option) => (
            <option key={option.value} value={option.value} className={option.colorClass}>
                {option.label}
            </option>
        ));
    };

    const renderLicenseOptions = (license) => {
        if (!license) return null;

        const options = getUpgradeOptions(license.type);
        const priceDifference = priceDifferences[license.id] || 0;
        const isUpgrade = priceDifference > 0;

        return (
            <div key={license.id} className="mb-4">
                <div className="p-4 mb-4 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="flex items-center mb-4">
                        <FaCircleInfo className="mr-2 text-gray-500" />
                        <p className="text-sm font-semibold text-gray-600">License Information:</p>
                    </div>
                    <div className="flex justify-between mb-2">
                        <p className="text-sm text-gray-600">
                            <strong>Current License Type:</strong>
                        </p>
                        <span className="text-sm font-medium text-gray-800">{license.packageParentData.packageParentName}</span>
                    </div>
                    <div className="flex justify-between">
                        <p className="text-sm text-gray-600">
                            <strong>License ID:</strong>
                        </p>
                        <span className="text-sm font-medium text-gray-800">{license.id}</span>
                    </div>
                </div>
                <div className="">
                    <label htmlFor={`upgrade-options-${license.id}`} className="block mb-2 text-sm font-medium text-gray-700">
                        Select Upgrade/Downgrade Option:
                    </label>
                    <select id={`upgrade-options-${license.id}`} value={selectedOptions[license.id] || ""} onChange={(e) => handleOptionChange(license.id, e.target.value, license.type)} className="w-full p-3 mb-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">-- Select an option --</option>
                        {options}
                    </select>
                </div>
                {priceDifference !== null && (
                    <div className="p-4 mb-4 bg-gray-100 border border-gray-300 rounded-lg">
                        <p className="text-sm text-gray-800">
                            {isUpgrade ? "To Pay" : "Refund"}: <strong>€{Math.abs(priceDifference).toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                        </p>
                        <p className="text-sm text-gray-600">{isUpgrade ? `You will be charged an additional €${Math.abs(priceDifference).toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} for upgrading.` : `You will receive a refund of €${Math.abs(priceDifference).toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} for downgrading.`}</p>
                    </div>
                )}
            </div>
        );
    };

    // Calculate the total amount to pay or refund for summary display
    const totalToPay = Object.values(priceDifferences)
        .filter((diff) => diff > 0)
        .reduce((acc, diff) => acc + diff, 0);
    const totalRefund = Object.values(priceDifferences)
        .filter((diff) => diff < 0)
        .reduce((acc, diff) => acc + diff, 0);
    const totalAmount = totalToPay + totalRefund;

    const totalAmountDisplay = Math.abs(totalAmount);
    const totalValueClass = totalAmount < 0 ? "text-green-700" : "text-gray-800";
    const totalLabel = totalAmount < 0 ? "Total Refund" : "Total to Pay";

    return (
        <div role="dialog" aria-labelledby="upgrade-modal-title" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="relative w-full max-w-2xl max-h-[75vh] p-6 bg-white rounded-lg shadow-xl flex flex-col">
                <div className="flex items-center justify-between pb-2 mb-4 border-b">
                    <h2 id="upgrade-modal-title" className="text-2xl font-bold text-gray-800">
                        Upgrade/Downgrade License
                    </h2>
                    <button onClick={onClose} aria-label="Close" className="text-gray-600 hover:text-gray-900 focus:outline-none">
                        <FaXmark className="text-2xl" />
                    </button>
                </div>

                <div className="flex-1 p-1 overflow-y-auto custom-scrollbar">{isBulk ? licenses.map(renderLicenseOptions) : license && renderLicenseOptions(license)}</div>

                <div className="flex justify-between p-4 mt-4 bg-gray-100 border border-gray-300 rounded-lg">
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800">Summary</h3>
                        <div className="mt-2">
                            <p className="text-sm text-gray-600">
                                Amount to Pay: <strong className="text-gray-800">€{totalToPay.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                            </p>
                            <p className="text-sm text-gray-600">
                                Amount to Refund: <strong className="text-green-700">€{Math.abs(totalRefund).toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                            </p>
                            <p className="text-sm text-gray-600">
                                Licenses to Upgrade: <strong>{Object.values(priceDifferences).filter((diff) => diff > 0).length}</strong>
                            </p>
                            <p className="text-sm text-gray-600">
                                Licenses to Downgrade: <strong>{Object.values(priceDifferences).filter((diff) => diff < 0).length}</strong>
                            </p>
                        </div>
                    </div>
                    <div className="w-1/3 ml-4">
                        <h3 className="text-lg font-semibold text-gray-800">{totalLabel}</h3>
                        <p className={`text-2xl font-bold ${totalValueClass}`}>€{totalAmountDisplay.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        {totalAmount >= 0 && <p className="mt-1 text-sm text-gray-600">VAT calculated on checkout</p>}
                        {totalAmount < 0 && <p className="mt-1 text-sm text-gray-600">Refund will be credited to your account wallet</p>}
                    </div>
                </div>

                {isRedirecting ? (
                    <div className="flex flex-col items-center p-4 mt-4 text-center bg-gray-100 rounded-lg">
                        <div className="w-8 h-8 mb-2 border-4 border-t-4 border-gray-300 rounded-full border-t-blue-500 animate-spin"></div>
                        <p className="text-sm text-gray-600">Redirecting to checkout page...</p>
                    </div>
                ) : (
                    <div className="flex justify-end mt-4 space-x-2">
                        <button onClick={handleConfirm} className={`flex items-center px-4 py-2 font-semibold text-white transition duration-300 rounded-lg ${Object.keys(selectedOptions).length === 0 || Object.values(selectedOptions).some((v) => !v) ? "bg-gray-400 cursor-not-allowed" : "bg-sky-600 hover:bg-sky-700 active:bg-sky-800"}`} disabled={Object.keys(selectedOptions).length === 0 || Object.values(selectedOptions).some((v) => !v)}>
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

LicenseListUpgradeModal.propTypes = {
    isVisible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    license: PropTypes.object,
    licenses: PropTypes.array,
};

export default LicenseListUpgradeModal;
