import { useState, useMemo } from "react";
import PropTypes from "prop-types";
import { FaFileExport, FaMagnifyingGlass, FaSortUp, FaSortDown, FaSort, FaChevronLeft, FaChevronRight, FaXmark, FaAnglesLeft, FaAnglesRight } from "react-icons/fa6";

const LogsList = ({ logs }) => {
    const [filter, setFilter] = useState("");
    const [sortBy, setSortBy] = useState("logDatetime");
    const [sortOrder, setSortOrder] = useState("desc");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [selectedActionType, setSelectedActionType] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [selectedRows, setSelectedRows] = useState([]);
    const [maxVisiblePages, setMaxVisiblePages] = useState(5);

    // Extract unique action types from logs
    const actionTypes = useMemo(() => {
        const types = new Set(logs.map((log) => log.actionTypeName));
        return [...types];
    }, [logs]);

    const handleSort = (field) => {
        setSortBy(field);
        setSortOrder(sortBy === field && sortOrder === "asc" ? "desc" : "asc");
    };

    const getSortIcon = (field) => {
        if (sortBy === field) {
            return sortOrder === "asc" ? <FaSortUp className="inline-block ml-1 text-[10px]" /> : <FaSortDown className="inline-block ml-1 text-[10px]" />;
        } else {
            return <FaSort className="inline-block ml-1 text-[10px] opacity-50" />;
        }
    };

    const handleDateChange = (setter) => (e) => {
        setter(e.target.value);
    };

    const clearFilters = () => {
        setFilter("");
        setSelectedActionType("");
        setStartDate("");
        setEndDate("");
    };

    const filteredAndSortedLogs = useMemo(() => {
        return logs
            .filter((log) => {
                const descriptionMatch = log.actionTypeDescription.toLowerCase().includes(filter.toLowerCase());
                const userMatch = (log.name || "").toLowerCase().includes(filter.toLowerCase());
                const actionTypeMatchSelected = selectedActionType ? log.actionTypeName === selectedActionType : true;
                const dateMatch = (!startDate || new Date(log.logDatetime) >= new Date(startDate)) && (!endDate || new Date(log.logDatetime) <= new Date(endDate));
                return (descriptionMatch || userMatch) && actionTypeMatchSelected && dateMatch;
            })
            .sort((a, b) => {
                let aValue = a[sortBy] || "";
                let bValue = b[sortBy] || "";
                aValue = String(aValue);
                bValue = String(bValue);
                return sortOrder === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
            });
    }, [logs, filter, selectedActionType, sortBy, sortOrder, startDate, endDate]);

    const paginatedLogs = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredAndSortedLogs.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredAndSortedLogs, currentPage, itemsPerPage]);

    const totalPages = useMemo(() => Math.ceil(filteredAndSortedLogs.length / itemsPerPage), [filteredAndSortedLogs.length, itemsPerPage]);

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleRowSelect = (id) => {
        setSelectedRows((prevSelectedRows) => (prevSelectedRows.includes(id) ? prevSelectedRows.filter((rowId) => rowId !== id) : [...prevSelectedRows, id]));
    };

    const handleSelectAll = () => {
        if (selectedRows.length === paginatedLogs.length) {
            setSelectedRows([]);
        } else {
            setSelectedRows(paginatedLogs.map((log) => log.id));
        }
    };

    const isSelectAllChecked = paginatedLogs.length > 0 && selectedRows.length === paginatedLogs.length;

    // Helper function to format timestamp
    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        return date
            .toLocaleString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
            })
            .replace(",", ""); // Remove comma
    };

    // Calculate page numbers to display
    const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    const visiblePages = Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);

    return (
        <div className="overflow-x-auto">
            <div className="flex flex-col mt-4 mb-4">
                <h2 className="text-xl font-semibold text-gray-600">License Manager Logs</h2>
                <div className="flex justify-between mt-4">
                    <div className="flex space-x-2">
                        <div className="flex space-x-2">
                            <div className="flex items-center ml-[1px] bg-white border border-gray-300 rounded-lg shadow-sm focus-within:ring-1 focus-within:ring-sky-500">
                                <FaMagnifyingGlass className="mx-2 text-gray-400" />
                                <input type="text" placeholder="Search..." className="py-2 pl-1 pr-4 bg-transparent border-none outline-none focus:ring-0" value={filter} onChange={(e) => setFilter(e.target.value)} />
                            </div>
                            <select value={selectedActionType} onChange={(e) => setSelectedActionType(e.target.value)} className="py-2 pl-4 pr-4 text-gray-500 bg-white border border-gray-300 rounded-lg shadow-sm">
                                <option value="">All action types</option>
                                {actionTypes.map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                            <input type="date" value={startDate} onChange={handleDateChange(setStartDate)} className="py-2 pl-4 pr-4 text-gray-500 bg-white border border-gray-300 rounded-lg shadow-sm" />
                            <input type="date" value={endDate} onChange={handleDateChange(setEndDate)} className="py-2 pl-4 pr-4 text-gray-500 bg-white border border-gray-300 rounded-lg shadow-sm" />
                            {(filter || selectedActionType || startDate || endDate) && (
                                <button onClick={clearFilters} className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                                    <FaXmark className="w-4 h-4 mr-2" />
                                    Clear Filters
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        {/* <button onClick={() => window.history.back()} className="flex items-center px-4 py-2 font-semibold text-white rounded-lg shadow-md focus:outline-none bg-sky-500 hover:bg-sky-600">
                            <FaChevronLeft className="mr-2" />
                            Return to License Manager
                        </button> */}
                        <button className="flex items-center px-4 py-2 font-semibold text-gray-600 bg-gray-200 rounded-lg shadow-md focus:outline-none hover:bg-gray-300">
                            <FaFileExport className="mr-2" />
                            Export
                        </button>
                    </div>
                </div>
            </div>
            <table id="license-logs-list" className="min-w-full bg-white border rounded-lg shadow-sm table-fixed">
                <thead className="sticky top-0 text-gray-400 bg-gray-100 border">
                    <tr>
                        <th className="w-5 px-4 py-4 text-xs font-medium text-left uppercase cursor-pointer">
                            <input type="checkbox" checked={isSelectAllChecked} onChange={handleSelectAll} />
                        </th>
                        <th className="px-4 py-4 text-xs font-medium text-left uppercase cursor-pointer min-w-40" onClick={() => handleSort("logDatetime")}>
                            <div className="flex items-center">Timestamp {getSortIcon("logDatetime")}</div>
                        </th>
                        <th className="px-4 py-4 text-xs font-medium text-left uppercase cursor-pointer min-w-40" onClick={() => handleSort("actionTypeName")}>
                            <div className="flex items-center">Action Type {getSortIcon("actionTypeName")}</div>
                        </th>
                        <th className="px-4 py-4 text-xs font-medium text-left uppercase cursor-pointer min-w-40" onClick={() => handleSort("actionTypeDescription")}>
                            <div className="flex items-center">Action Description {getSortIcon("actionTypeDescription")}</div>
                        </th>
                        <th className="px-4 py-4 text-xs font-medium text-left uppercase cursor-pointer min-w-40" onClick={() => handleSort("name")}>
                            <div className="flex items-center">User Affected {getSortIcon("name")}</div>
                        </th>
                        <th className="px-4 py-4 text-xs font-medium text-left uppercase cursor-pointer min-w-40" onClick={() => handleSort("notes")}>
                            <div className="flex items-center">Log Message {getSortIcon("logMessage")}</div>
                        </th>
                    </tr>
                </thead>
                <tbody className="text-gray-600">
                    {paginatedLogs.length > 0 ? (
                        paginatedLogs.map((log, index) => (
                            <tr key={log.id} className={`cursor-pointer ${selectedRows.includes(log.id) ? "bg-sky-100" : index % 2 === 0 ? "bg-gray-50 hover:bg-gray-100" : "bg-white hover:bg-gray-50"}`}>
                                <td className="px-4 py-2 border">
                                    <input type="checkbox" checked={selectedRows.includes(log.id)} onChange={() => handleRowSelect(log.id)} />
                                </td>

                                <td className="px-4 py-2 border">{formatTimestamp(log.logDatetime)}</td>
                                <td className="px-4 py-2 border">{log.actionTypeName}</td>
                                <td className="px-4 py-2 border">{log.actionTypeDescription}</td>
                                <td className="px-4 py-2 border">{log.name || "N/A"}</td>
                                <td className="px-4 py-2 border">{log.logMessage || "-"}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="px-4 py-6 font-medium text-center text-gray-400">
                                No results found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            <div className="flex items-center justify-between py-3 border-t border-gray-200">
                <div className="flex justify-between flex-1 sm:hidden">
                    <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                        <FaChevronLeft className="w-5 h-5" />
                    </button>
                    <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                        <FaChevronRight className="w-5 h-5" />
                    </button>
                </div>
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-start">
                    <div>
                        <p className="text-sm text-gray-700">
                            Showing <span className="font-medium">{filteredAndSortedLogs.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</span> to <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredAndSortedLogs.length)}</span> of <span className="font-medium">{filteredAndSortedLogs.length}</span> results
                        </p>
                    </div>
                    <div className="flex items-center ml-4 space-x-2">
                        <label className="text-sm text-gray-700">Items per page:</label>
                        <select value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))} className="py-1 pl-2 pr-8 text-gray-500 bg-white border border-gray-300 rounded-lg shadow-sm">
                            {[10, 20, 50, 100].map((size) => (
                                <option key={size} value={size}>
                                    {size}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="ml-auto">
                        <nav className="inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                            <button onClick={() => handlePageChange(1)} disabled={currentPage === 1} className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50">
                                <span className="sr-only">First</span>
                                <FaAnglesLeft className="w-3 h-3" />
                            </button>
                            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 hover:bg-gray-50">
                                <FaChevronLeft className="w-3 h-3" />
                            </button>
                            {visiblePages.map((page) => (
                                <button key={page} onClick={() => handlePageChange(page)} className={`relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border-t border-b border-gray-300 ${currentPage === page ? "bg-gray-100" : "hover:bg-gray-50"}`}>
                                    {page}
                                </button>
                            ))}
                            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 hover:bg-gray-50">
                                <FaChevronRight className="w-3 h-3" />
                            </button>
                            <button onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50">
                                <span className="sr-only">Last</span>
                                <FaAnglesRight className="w-3 h-3" />
                            </button>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    );
};

LogsList.propTypes = {
    logs: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            actionTypeId: PropTypes.number.isRequired,
            actionTypeName: PropTypes.string.isRequired,
            actionTypeDescription: PropTypes.string.isRequired,
            idUser: PropTypes.string,
            name: PropTypes.string, // Nullable field
            fkClient: PropTypes.string.isRequired,
            logDatetime: PropTypes.string.isRequired,
            logMessage: PropTypes.string,
        })
    ).isRequired,
};

export default LogsList;
