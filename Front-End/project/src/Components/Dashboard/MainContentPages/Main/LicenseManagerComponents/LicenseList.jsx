import { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { FaPlus, FaFileExport, FaMagnifyingGlass, FaSortUp, FaSortDown, FaSort, FaChevronLeft, FaChevronRight, FaCheck, FaBan, FaListCheck, FaXmark, FaAnglesLeft, FaAnglesRight } from "react-icons/fa6";
import { LuPackagePlus } from "react-icons/lu";
import LicenseListItem from "./LicenseListItem";
import { useNavigate } from "react-router-dom";
import LicenseService from "../../../../../Services/LicenseService";
import LicenseListUpgradeModal from "./LicenseListUpgradeModal";

const LicenseList = ({ licenses, triggerAlert, refreshLicenses }) => {
    const [allSelected, setAllSelected] = useState(false);
    const [selectedLicenses, setSelectedLicenses] = useState([]);
    const [filter, setFilter] = useState("");
    const [sortBy, setSortBy] = useState("type");
    const [sortOrder, setSortOrder] = useState("asc");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [selectedLicenseType, setSelectedLicenseType] = useState("");
    const [selectedLicenseStatus, setSelectedLicenseStatus] = useState("");
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();
    const [activeLink, setActiveLink] = useState("");
    const [maxVisiblePages, setMaxVisiblePages] = useState(5);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedLicense, setSelectedLicense] = useState(null);

    const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
    const [batchLicenses, setBatchLicenses] = useState([]);

    // Fetch users data
    useEffect(() => {
        const fetchUsers = async () => {
            const licenseService = new LicenseService();
            try {
                //const usersData = await licenseService.getUsersByClientId();
                const usersData = await licenseService.getNonAssignedUsersByClientId();
                setUsers(usersData);
            } catch (error) {
                console.error("Error fetching users:", error);
                triggerAlert("error", "Error", "Failed to fetch users");
            }
        };

        fetchUsers();
    }, [triggerAlert]);

    // Helper: Get unique values for license types and statuses
    const getUniqueValues = (key) => {
        if (key === "type") {
            const uniqueValues = new Set(licenses.map((license) => license.packageParentData.packageParentName));
            const defaultValues = ["Basic", "Medium", "Pro"];
            return [...defaultValues, ...uniqueValues].filter((value, index, self) => self.indexOf(value) === index);
        } else if (key === "status") {
            const uniqueValues = new Set(licenses.map((license) => license[key]));
            const defaultValues = ["active", "inactive", "pending", "expired", "not assigned"];
            return [...defaultValues, ...uniqueValues].filter((value, index, self) => self.indexOf(value) === index);
        }
    };

    const licenseTypes = useMemo(() => getUniqueValues("type"), [licenses]);
    const licenseStatus = useMemo(() => getUniqueValues("status"), [licenses]);

    // Toggle selection logic
    const handleSelectAll = () => {
        if (allSelected) {
            setSelectedLicenses([]);
        } else {
            setSelectedLicenses(paginatedLicenses);
        }
        setAllSelected(!allSelected);
    };

    const handleSelectLicense = (license) => {
        const isSelected = selectedLicenses.includes(license);
        const updatedSelectedLicenses = isSelected ? selectedLicenses.filter((item) => item !== license) : [...selectedLicenses, license];

        setSelectedLicenses(updatedSelectedLicenses);
        setAllSelected(filteredAndSortedLicenses.length > 0 && filteredAndSortedLicenses.every((lic) => updatedSelectedLicenses.includes(lic)));
    };

    // Service instance
    const licenseService = new LicenseService();

    // Handle enable/disable selected licenses
    const handleLicenseAction = async (status) => {
        const statusMap = { enable: 1, disable: 4 };
        const actionTypeMap = { enable: 3, disable: 4 }; // Mapping for log action types
        const filterStatus = status === "enable" ? "inactive" : "active";
        const actionStatus = statusMap[status];

        const selectedLicensesPayload = selectedLicenses.filter((license) => license.status === filterStatus).map((license) => ({ IdLicense: license.id, Status: actionStatus }));

        try {
            await licenseService.multipleLicenseEnableDisable(selectedLicensesPayload);

            // Register logs for each license action using the original selectedLicenses array
            const logPromises = selectedLicenses
                .filter((license) => license.status === filterStatus)
                .map((license) =>
                    licenseService.registerLicenseLogWithClient({
                        actionType: actionTypeMap[status], // Use actionTypeMap to get the correct log action type ID
                        fkUser: license.assignedTo.id, // Using original selectedLicenses array to get assignedTo info
                    })
                );

            await Promise.all(logPromises);

            triggerAlert("success", "Success", `Selected licenses ${status}d successfully`);
            setSelectedLicenses([]);
            await refreshLicenses();
            setAllSelected(false);
        } catch (error) {
            console.error(`Failed to ${status} selected licenses`, error);
            triggerAlert("error", "Error", `Failed to ${status} selected licenses`);
        }
    };

    const filteredAndSortedLicenses = useMemo(() => {
        return licenses
            .filter((license) => ["active", "inactive", "pending"].includes(license.status))
            .filter((license) => {
                const typeMatch = license.packageParentData.packageParentName.toLowerCase().includes(filter.toLowerCase());
                const assignedToMatch = license.assignedTo && (license.assignedTo.name?.toLowerCase().includes(filter.toLowerCase()) || license.assignedTo.email?.toLowerCase().includes(filter.toLowerCase()));
                const licenseTypeMatch = selectedLicenseType ? license.packageParentData.packageParentName === selectedLicenseType : true;
                const licenseStatusMatch = selectedLicenseStatus ? license.status === selectedLicenseStatus : true;
                return (typeMatch || assignedToMatch) && licenseTypeMatch && licenseStatusMatch;
            })
            .sort((a, b) => {
                let aValue = a[sortBy] || "";
                let bValue = b[sortBy] || "";
                if (sortBy === "assignedTo") {
                    aValue = a.assignedTo ? a.assignedTo.name || a.assignedTo.email || "" : "";
                    bValue = b.assignedTo ? b.assignedTo.name || b.assignedTo.email || "" : "";
                }
                aValue = String(aValue);
                bValue = String(bValue);
                return sortOrder === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
            });
    }, [licenses, filter, selectedLicenseType, selectedLicenseStatus, sortBy, sortOrder]);

    // Pagination logic
    const paginatedLicenses = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredAndSortedLicenses.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredAndSortedLicenses, currentPage, itemsPerPage]);

    const totalPages = useMemo(() => Math.ceil(filteredAndSortedLicenses.length / itemsPerPage), [filteredAndSortedLicenses.length, itemsPerPage]);

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

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

    const handleItemsPerPageChange = (event) => {
        setItemsPerPage(Number(event.target.value));
        setCurrentPage(1); // Reset to the first page when items per page changes
    };

    // Edit license row (logic for edit button)
    const [editingLicenseId, setEditingLicenseId] = useState(null);

    const handleEdit = (licenseId) => {
        setEditingLicenseId(licenseId);
    };

    const handleCancelEdit = () => {
        setEditingLicenseId(null);
    };

    const handleNavigation = (path) => {
        setActiveLink(path); // Set active link state
        navigate(path);
    };

    const clearFilters = () => {
        setFilter("");
        setSelectedLicenseType("");
        setSelectedLicenseStatus("");
    };

    // Open upgrade/downgrade modal for single license
    const openModal = (license) => {
        setSelectedLicense(license);
        setIsModalOpen(true);
    };

    // Open upgrade/downgrade modal for multiple licenses
    const openBatchModal = () => {
        if (selectedLicenses.length > 0) {
            setBatchLicenses(selectedLicenses);
            setIsBatchModalOpen(true);
        } else {
            triggerAlert("error", "Error", "No licenses selected for batch operation");
        }
    };

    // Handle upgrade/downgrade confirm for batch licenses
    const handleBatchConfirm = (option) => {
        const preparedLicenses = batchLicenses.map((license) => ({
            id: license.id,
            type: license.packageParentData.packageParentName,
            transactionId: license.transactionData?.id || null,
            subscriptionType: license.transactionData?.subscriptionType || null,
        }));

        navigate("/dashboard/checkout-test", { state: { licenses: preparedLicenses, upgradeOption: option } });
    };

    // Calculate page numbers to display
    const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    const visiblePages = Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);

    return (
        <div className="overflow-x-auto">
            <div className="flex flex-col mt-4 mb-4">
                <h2 className="text-xl font-semibold text-gray-600">Available Licenses</h2>
                <div className="flex justify-between mt-4 space-x-2">
                    <div className="flex space-x-2">
                        <div className="flex items-center ml-[1px] bg-white border border-gray-300 rounded-lg shadow-sm focus-within:ring-1 focus-within:ring-sky-500">
                            <FaMagnifyingGlass className="mx-2 text-gray-400" />
                            <input type="text" placeholder="Search..." className="py-2 pl-1 pr-4 bg-transparent border-none outline-none focus:ring-0" value={filter} onChange={(e) => setFilter(e.target.value)} />
                        </div>
                        <select value={selectedLicenseType} onChange={(e) => setSelectedLicenseType(e.target.value)} className="py-2 pl-4 pr-4 text-gray-500 bg-white border border-gray-300 rounded-lg shadow-sm">
                            <option value="">All license types</option>
                            {licenseTypes.map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                        <select value={selectedLicenseStatus} onChange={(e) => setSelectedLicenseStatus(e.target.value)} className="py-2 pl-4 pr-4 text-gray-500 bg-white border border-gray-300 rounded-lg shadow-sm">
                            <option value="">All license status</option>
                            {licenseStatus.map((status) => (
                                <option key={status} value={status}>
                                    {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
                                </option>
                            ))}
                        </select>
                        {(filter || selectedLicenseType || selectedLicenseStatus) && (
                            <button onClick={clearFilters} className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                                <FaXmark className="w-4 h-4 mr-2" />
                                Clear Filters
                            </button>
                        )}

                        {filteredAndSortedLicenses.length > 0 && (
                            <>
                                {selectedLicenses.some((license) => license.status === "active") && selectedLicenses.some((license) => license.status === "inactive") && (
                                    <>
                                        <button className="flex items-center px-4 py-2 font-semibold text-white bg-teal-400 rounded-lg shadow-md focus:outline-none hover:bg-teal-500" onClick={() => handleLicenseAction("enable")}>
                                            <FaCheck className="mr-2" />
                                            Enable Selected
                                        </button>
                                        <button className="flex items-center px-4 py-2 font-semibold text-white bg-red-400 rounded-lg shadow-md focus:outline-none hover:bg-red-500" onClick={() => handleLicenseAction("disable")}>
                                            <FaBan className="mr-2" />
                                            Disable Selected
                                        </button>

                                        <button className="flex items-center px-4 py-2 font-semibold text-white bg-teal-400 rounded-lg shadow-md focus:outline-none hover:bg-teal-500" onClick={() => handleLicenseAction("enable")}>
                                            <FaCheck className="mr-2" />
                                            Enable Selected
                                        </button>
                                        <button className="flex items-center px-4 py-2 font-semibold text-white bg-teal-400 rounded-lg shadow-md focus:outline-none hover:bg-teal-500" onClick={openBatchModal}>
                                            <LuPackagePlus className="mr-2" />
                                            Upgrade/Downgrade
                                        </button>
                                    </>
                                )}
                                {selectedLicenses.some((license) => license.status === "inactive") && !selectedLicenses.some((license) => license.status === "active") && (
                                    <>
                                        <button className="flex items-center px-4 py-2 font-semibold text-white bg-teal-400 rounded-lg shadow-md focus:outline-none hover:bg-teal-500" onClick={() => handleLicenseAction("enable")}>
                                            <FaCheck className="mr-2" />
                                            Enable Selected
                                        </button>
                                        <button className="flex items-center px-4 py-2 font-semibold text-white bg-teal-400 rounded-lg shadow-md focus:outline-none hover:bg-teal-500" onClick={openBatchModal}>
                                            <LuPackagePlus className="mr-2" />
                                            Upgrade/Downgrade
                                        </button>
                                    </>
                                )}
                                {selectedLicenses.some((license) => license.status === "active") && !selectedLicenses.some((license) => license.status === "inactive") && (
                                    <>
                                        <button className="flex items-center px-4 py-2 font-semibold text-white bg-red-400 rounded-lg shadow-md focus:outline-none hover:bg-red-500" onClick={() => handleLicenseAction("disable")}>
                                            <FaBan className="mr-2" />
                                            Disable Selected
                                        </button>
                                        <button className="flex items-center px-4 py-2 font-semibold text-white bg-teal-400 rounded-lg shadow-md focus:outline-none hover:bg-teal-500" onClick={openBatchModal}>
                                            <LuPackagePlus className="mr-2" />
                                            Upgrade/Downgrade
                                        </button>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                    <div className="flex space-x-2">
                        <button className="flex items-center px-4 py-2 font-semibold text-white rounded-lg shadow-md focus:outline-none bg-sky-500 hover:bg-sky-600">
                            <FaPlus className="mr-2" />
                            Add Licenses
                        </button>
                        <button className="flex items-center px-4 py-2 font-semibold text-white bg-teal-500 rounded-lg shadow-md focus:outline-none hover:bg-teal-600" onClick={() => handleNavigation("/dashboard/license-manager/logs")}>
                            <FaListCheck className="mr-2" />
                            Logs
                        </button>
                        <button className="flex items-center px-4 py-2 font-semibold text-gray-600 bg-gray-200 rounded-lg shadow-md focus:outline-none hover:bg-gray-300">
                            <FaFileExport className="mr-2" />
                            Export
                        </button>
                    </div>
                </div>
            </div>
            <table id="license-manager-list" className="min-w-full bg-white border rounded-lg shadow-sm table-fixed">
                <thead className="text-gray-400 bg-gray-100 border">
                    <tr>
                        <th className="px-4 py-2 text-left min-w-5">
                            <input type="checkbox" className="form-checkbox" checked={allSelected} onChange={handleSelectAll} />
                        </th>
                        <th className="px-4 py-4 text-xs font-medium text-left uppercase cursor-pointer min-w-52" onClick={() => handleSort("type")}>
                            <div className="flex items-center">License {getSortIcon("type")}</div>
                        </th>
                        <th className="px-4 py-4 text-xs font-medium text-left uppercase cursor-pointer min-w-40" onClick={() => handleSort("purchaseDate")}>
                            <div className="flex items-center">Purchase Date {getSortIcon("purchaseDate")}</div>
                        </th>
                        <th className="px-4 py-4 text-xs font-medium text-left uppercase cursor-pointer min-w-40" onClick={() => handleSort("expirationDate")}>
                            <div className="flex items-center">Expiration Date {getSortIcon("expirationDate")}</div>
                        </th>
                        <th className="px-4 py-4 text-xs font-medium text-left uppercase cursor-pointer min-w-48" onClick={() => handleSort("assignedTo")}>
                            <div className="flex items-center">Assigned To {getSortIcon("assignedTo")}</div>
                        </th>
                        <th className="px-4 py-4 text-xs font-medium text-left uppercase cursor-pointer min-w-32" onClick={() => handleSort("status")}>
                            <div className="flex items-center">Status {getSortIcon("status")}</div>
                        </th>
                        <th className="px-4 py-4 text-xs font-medium text-left uppercase min-w-52">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedLicenses.length > 0 ? (
                        paginatedLicenses.map((license) => <LicenseListItem triggerAlert={triggerAlert} key={license.id} license={license} isSelected={selectedLicenses.includes(license)} onSelectLicense={() => handleSelectLicense(license)} refreshLicenses={refreshLicenses} isEditing={editingLicenseId === license.id} onEdit={handleEdit} onCancel={handleCancelEdit} users={users} onUpgradeDowngrade={() => openModal(license)} />)
                    ) : (
                        <tr>
                            <td colSpan="7" className="px-4 py-6 font-medium text-center text-gray-400">
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
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                    <div className="flex items-center space-x-4">
                        <p className="text-sm text-gray-700">
                            Showing <span className="font-medium">{filteredAndSortedLicenses.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</span> to <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredAndSortedLicenses.length)}</span> of <span className="font-medium">{filteredAndSortedLicenses.length}</span> results
                        </p>
                        <div className="flex items-center space-x-2">
                            <label className="text-sm text-gray-700">Items per page:</label>
                            <select value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))} className="py-1 pl-2 pr-8 text-gray-500 bg-white border border-gray-300 rounded-lg shadow-sm">
                                {[10, 20, 50, 100].map((size) => (
                                    <option key={size} value={size}>
                                        {size}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
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

            {isModalOpen && selectedLicense && <LicenseListUpgradeModal isVisible={isModalOpen} onClose={() => setIsModalOpen(false)} license={selectedLicense} onConfirm={handleBatchConfirm} />}
            {isBatchModalOpen && batchLicenses.length > 0 && <LicenseListUpgradeModal isVisible={isBatchModalOpen} onClose={() => setIsBatchModalOpen(false)} licenses={batchLicenses} onConfirm={handleBatchConfirm} />}
        </div>
    );
};

LicenseList.propTypes = {
    licenses: PropTypes.array.isRequired,
    triggerAlert: PropTypes.func.isRequired,
    refreshLicenses: PropTypes.func.isRequired,
};

export default LicenseList;
