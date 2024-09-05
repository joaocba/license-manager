import PropTypes from "prop-types";

// Format date for display in "YYYY-MM-DD" format
const formatDate = (dateString) => {
    if(dateString === "1990-01-01T00:00:00"){
        return `-`;
    }else{
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
    }
};

const TransactionHistoryItem = ({ transaction }) => {
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
            default:
                break;
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
            <td className="px-4 text-center text-nowrap">{transaction.parent}</td>
            <td className="px-4 text-center">{transaction.transactionCost}€</td>
            <td className="px-4 text-center">
                <span className={`px-3 py-1 text-xs font-semibold rounded-full text-nowrap ${getStatusClass(transaction.status)}`}>{getStatusName(transaction.status)}</span>
            </td>
        </tr>
    );
};

TransactionHistoryItem.propTypes = {
    transaction: PropTypes.object.isRequired,
};

export default TransactionHistoryItem;
