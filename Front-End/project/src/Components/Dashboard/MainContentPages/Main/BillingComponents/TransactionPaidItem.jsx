import PropTypes from "prop-types";
import { FaBan, FaDownload, FaArrowLeft, FaCheck } from "react-icons/fa6";
import { useState } from "react";
import TransactionService from "../../../../../Services/TransactionService";
import UserFetchClient from "../../../../../FetchClients/UserFetchClient";
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

const TransactionPaidItem = ({ transaction, refreshTransactions }) => {
    const [cancelConfirmation, setCancelConfirmation] = useState(false);

    const getStatusName = (status) => {
        switch (status) {
            case 1:
                return "Missing Payment";
            case 2:
                return "Awaiting review";
            case 3:
                return "Accepted";
            case 4:
                return "Refunded";
            case 5:
                return "Canceled";
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 1:
                return "bg-red-200 text-red-700";
            case 2:
                return "bg-yellow-200 text-yellow-700";
            case 3:
                return "bg-green-200 text-green-700";
            case 4:
                return "bg-sky-200 text-sky-700";
            case 5:
                return "bg-gray-600 text-white";
            default:
                return "bg-gray-200 text-gray-700";
        }
    };

    const getSubscriptionTypeName = (subsType) => {
        switch (subsType) {
            case 1:
                return "Annual";
            case 2:
                return "Monthly";
            default:
                return;
        }
    };

    const getTransactionsTypeName = (transactionType) => {
        switch (transactionType) {
            case 1:
                return "Acquisition";
            case 2:
                return "Devolution";
            case 3:
                return "Upgrade";
            case 4:
                return "Downgrade";
            case 5:
                return "Refund";
            default:
                return;
        }
    };
    const getTypeClass = (type) => {
        switch (type) {
            case 1:
                return " text-green-700";
            case 2:
                return "text-red-700";
            case 3:
                return "text-blue-700";
            case 4:
                return "text-orange-700";
            case 5:
                return "text-gray-900";
            default:
                return "text-gray-700";
        }
    };

    const getActions = () => {
        var actualDate = Date.now();
        var startingDate = new Date(transaction.startingDate);
        var timeDiff = Math.abs(startingDate - actualDate);
        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

        if (diffDays < 14) {
            return (
                <button className="flex items-center px-3 py-1 font-semibold text-white bg-red-500 rounded-lg focus:outline-none hover:bg-red-400" onClick={() => setCancelConfirmation(true)}>
                    <FaBan className="mr-1" />
                    Refund
                </button>
            );
        }
    };

    const handleCancelation = async (id) => {
        try {
            const transactionService = new TransactionService(UserFetchClient);
            await transactionService.cancelTransaction(id);
            await refreshTransactions();
            setCancelConfirmation(false);
        } catch (error) {
            console.error("Failed to cancel transaction:", error);
        }
    };

    return (
        <tr className="h-20 border-b hover:bg-gray-100">
            <td className="px-4 text-center">
                <span className="font-semibold text-nowrap">{transaction.package}</span>
                <span className="block text-sm text-gray-500">Id: {transaction.id}</span>
            </td>
            <td className="px-4 text-center">
                <span className={`px-3 py-1 font-semibold text-nowrap ${getTypeClass(transaction.transactionType)}`}>{getTransactionsTypeName(transaction.transactionType)}</span>
            </td>
            <td className="px-4 text-center text-nowrap">{formatDate(transaction.timestamp)}</td>
            <td className="px-4 text-center text-nowrap">{formatDate(transaction.startingDate)}</td>
            <td className="px-4 text-center text-nowrap">{transaction.licenseAmount}</td>
            <td className="px-4 text-center text-nowrap">{getSubscriptionTypeName(transaction.subscriptionType)}</td>
            <td className="px-4 text-center">{transaction.transactionCost}€</td>
            <td className="px-4 text-center">
                <span className={`px-3 py-1 text-xs font-semibold rounded-full text-nowrap ${getStatusClass(transaction.status)}`}>{getStatusName(transaction.status)}</span>
            </td>
            <td className="px-4">
                <FaDownload className="text-2xl transition-transform duration-200 cursor-pointer hover:text-gray-600 hover:scale-105" />
            </td>
            <td className="px-4">
                {getActions()}
                {
                    //Modal of cancel confirmation
                    cancelConfirmation && (
                        <div className="z-20 w-full h-screen fixed top-0 left-0 bg-gray-800/[.5]">
                            <div className="relative w-2/4 p-8 mx-auto bg-white border rounded-lg shadow-lg top-2/4 -translate-y-2/4">
                                <h2 className="text-2xl font-bold text-center text-sky-500">Confirm Refund...</h2>
                                <p className="w-11/12 mx-auto my-6">Are you sure you want to cancel this transaction, money will be refund to your default account method</p>

                                <div className="flex justify-around">
                                    <button onClick={() => setCancelConfirmation(false)} className="flex items-center px-3 py-1 font-semibold text-white bg-red-500 rounded-lg focus:outline-none hover:bg-red-400">
                                        <FaArrowLeft className="inline mr-1" />
                                        Back
                                    </button>
                                    <button onClick={() => handleCancelation(transaction.id)} className="flex items-center px-3 py-1 font-semibold text-white bg-green-500 rounded-lg focus:outline-none hover:bg-green-400">
                                        <FaCheck className="inline mr-1" /> Confirm{" "}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                }
            </td>
        </tr>
    );
};

TransactionPaidItem.propTypes = {
    transaction: PropTypes.object.isRequired,
    refreshTransactions: PropTypes.func.isRequired,
};

export default TransactionPaidItem;
