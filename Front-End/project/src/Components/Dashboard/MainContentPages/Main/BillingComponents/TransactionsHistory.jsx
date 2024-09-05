import PropTypes from "prop-types";
import { useMemo, useState, useEffect } from "react";
import { FaSort, FaSortUp, FaSortDown, FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import TransactionHistoryItem from "./TransactionHistoryItem";

const sortFunction = (a, b, sortBy, sortOrder) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];

    if (["timestamp", "startingDate", "finishDate"].includes(sortBy)) {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
    } else if (sortBy === "transactionCost" || sortBy === "licenseAmount") {
        aValue = parseFloat(aValue);
        bValue = parseFloat(bValue);
    } else {
        aValue = String(aValue);
        bValue = String(bValue);
    }

    if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
    } else {
        return aValue < bValue ? 1 : -1;
    }
};
const TransactionsHistory = ({ transactions }) => {
    const [sortBy, setSortBy] = useState("timestamp");
    const [sortOrder, setSortOrder] = useState("desc");
    const [itemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    const handleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortBy(field);
            setSortOrder("asc");
        }
    };

    const getSortIcon = (field) => {
        if (sortBy === field) {
            return sortOrder === "asc" ? <FaSortUp className="inline-block ml-1 text-[10px]" /> : <FaSortDown className="inline-block ml-1 text-[10px]" />;
        } else {
            return <FaSort className="inline-block ml-1 text-[10px] opacity-50" />;
        }
    };

    /// Filter and sort transactions
    const filteredAndSortedTransactions = useMemo(() => {
        return [...transactions].sort((a, b) => sortFunction(a, b, sortBy, sortOrder));
    }, [transactions, sortBy, sortOrder]);

    // Pagination logic
    const paginatedTransactions = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredAndSortedTransactions.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredAndSortedTransactions, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(filteredAndSortedTransactions.length / itemsPerPage);

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };
    return (
        <>
            <div className="my-4 overflow-x-auto">
                <table id="billing-history-list" className="min-w-full bg-white border rounded-lg shadow-sm table-fixed">
                    <thead className="text-gray-400 bg-gray-100 border">
                        <tr>
                            <th className="px-4 py-4 text-xs font-medium text-left uppercase cursor-pointer w-52 text-nowrap" onClick={() => handleSort("id")}>
                                <p className="text-center">Transaction {getSortIcon("id")}</p>
                            </th>
                            <th className="px-4 py-4 text-xs font-medium text-left uppercase cursor-pointer w-52 text-nowrap" onClick={() => handleSort("transactionType")}>
                                <p className="text-center">Transactions Type {getSortIcon("transactionType")}</p>
                            </th>
                            <th className="px-4 py-4 text-xs font-medium text-left uppercase cursor-pointer w-52 text-nowrap" onClick={() => handleSort("timestamp")}>
                                <p className="text-center">Registered At {getSortIcon("timestamp")} </p>
                            </th>
                            <th className="px-4 py-4 text-xs font-medium text-left uppercase cursor-pointer w-52 text-nowrap" onClick={() => handleSort("startingDate")}>
                                <p className="text-center">Accepted at {getSortIcon("startingDate")} </p>
                            </th>
                            <th className="px-4 py-4 text-xs font-medium text-left uppercase cursor-pointer w-52 text-nowrap" onClick={() => handleSort("licenseAmount")}>
                                <p className="text-center">License Amount{getSortIcon("licenseAmount")} </p>
                            </th>
                            <th className="px-4 py-4 text-xs font-medium text-left uppercase w-52 text-nowrap">
                                <p className="text-center">License Type</p>
                            </th>
                            <th className="px-4 py-4 text-xs font-medium text-left uppercase w-52 text-nowrap">
                                <p className="text-center">References</p>
                            </th>
                            <th className="px-4 py-4 text-xs font-medium text-left uppercase cursor-pointer w-52 text-nowrap" onClick={() => handleSort("transactionCost")}>
                                <p className="text-center">Invoince Cost {getSortIcon("transactionCost")} </p>
                            </th>
                            <th className="px-4 py-4 text-xs font-medium text-left uppercase cursor-pointer w-52 text-nowrap" onClick={() => handleSort("status")}>
                                <p className="text-center">Status {getSortIcon("status")}</p>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedTransactions.length > 0 ? (
                            paginatedTransactions.map((transaction) => <TransactionHistoryItem key={transaction.id} transaction={transaction} />)
                        ) : (
                            <tr>
                                <td colSpan="7" className="px-4 py-6 font-medium text-center text-gray-400">
                                    No results found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <div className="flex items-cente justify-between py-3 border-gray-200 !z-1">
                    <div className="flex justify-between flex-1 sm:hidden">
                        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                            <FaChevronLeft className="w-5 h-5" />
                        </button>
                        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                            <FaChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-700">
                                Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredAndSortedTransactions.length)}</span> of <span className="font-medium">{filteredAndSortedTransactions.length}</span> results
                            </p>
                        </div>
                        <div>
                            <nav className="inline-flex -space-x-px rounded-md shadow-sm isolate" aria-label="Pagination">
                                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50">
                                    <FaChevronLeft className="w-5 h-5" />
                                </button>
                                {Array.from({ length: totalPages }, (_, index) => (
                                    <button key={index} onClick={() => handlePageChange(index + 1)} className={`relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border-t border-b border-gray-300 ${currentPage === index + 1 ? "bg-gray-100" : "hover:bg-gray-50"}`}>
                                        {index + 1}
                                    </button>
                                ))}
                                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="relative inline-flex items-center px-2 py-2 ml-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50">
                                    <FaChevronRight className="w-5 h-5" />
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

TransactionsHistory.propTypes = {
    transactions: PropTypes.array.isRequired,
};

export default TransactionsHistory;
