import { useState, useMemo } from "react";
import PropTypes from "prop-types";
import LicenseListExpiredItem from "./LicenseListExpiredItem";
import { FaMagnifyingGlass, FaChevronLeft, FaChevronRight, FaAnglesLeft, FaAnglesRight } from "react-icons/fa6";

const LicenseListExpired = ({ licenses }) => {
    const [filter, setFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [maxVisiblePages, setMaxVisiblePages] = useState(5);

    // Filter and sort licenses based on search query
    const filteredLicenses = useMemo(() => {
        return licenses.filter((license) => {
            // Filter out non-expired licenses
            if (!license.expirationDate || new Date(license.expirationDate) > new Date()) {
                return false;
            }

            // Filter by search query
            return license.type.toLowerCase().includes(filter.toLowerCase()) || (license.purchaseDate && license.purchaseDate.includes(filter)) || (license.expirationDate && license.expirationDate.includes(filter)) || (license.assignedTo && ((license.assignedTo.name && license.assignedTo.name.toLowerCase().includes(filter.toLowerCase())) || (license.assignedTo.email && license.assignedTo.email.toLowerCase().includes(filter.toLowerCase()))));
        });
    }, [licenses, filter]);

    // Paginate the filtered licenses
    /*     const paginatedLicenses = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredLicenses.slice(startIndex, endIndex);
    }, [filteredLicenses, currentPage, itemsPerPage]); */

    const paginatedLicenses = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredLicenses.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredLicenses, currentPage, itemsPerPage]);

    /* const totalPages = Math.ceil(filteredLicenses.length / itemsPerPage); */

    const totalPages = useMemo(() => Math.ceil(filteredLicenses.length / itemsPerPage), [filteredLicenses.length, itemsPerPage]);

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    // Calculate page numbers to display
    const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    const visiblePages = Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);

    return (
        <div className="overflow-x-auto">
            <div className="flex flex-col mt-4 mb-4">
                <h2 className="text-xl font-semibold text-gray-600">Expired Licenses</h2>
                <div className="flex justify-between mt-4 space-x-2">
                    <div className="flex space-x-2">
                        <div className="flex items-center ml-[1px] bg-white border border-gray-300 rounded-lg shadow-sm focus-within:ring-1 focus-within:ring-sky-500">
                            <FaMagnifyingGlass className="mx-2 text-gray-400" />
                            <input type="text" placeholder="Search..." className="py-2 pl-1 pr-4 bg-transparent border-none outline-none focus:ring-0" value={filter} onChange={(e) => setFilter(e.target.value)} />
                        </div>
                    </div>
                </div>
            </div>
            <table id="license-history-list" className="min-w-full bg-white border rounded-lg shadow-sm table-fixed">
                <thead className="text-gray-400 bg-gray-100 border">
                    <tr>
                        <th className="px-4 py-4 text-xs font-medium text-left uppercase w-52">License</th>
                        <th className="px-4 py-4 text-xs font-medium text-left uppercase w-52">Purchase Date</th>
                        <th className="px-4 py-4 text-xs font-medium text-left uppercase w-52">Expiration Date</th>
                        <th className="px-4 py-4 text-xs font-medium text-left uppercase w-52">Assigned To</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedLicenses.length > 0 ? (
                        paginatedLicenses.map((license) => <LicenseListExpiredItem key={license.id} license={license} />)
                    ) : (
                        <tr>
                            <td colSpan="4" className="px-4 py-6 font-medium text-center text-gray-400">
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
                            Showing <span className="font-medium">{filteredLicenses.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</span> to <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredLicenses.length)}</span> of <span className="font-medium">{filteredLicenses.length}</span> results
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

LicenseListExpired.propTypes = {
    licenses: PropTypes.array.isRequired,
};

export default LicenseListExpired;
