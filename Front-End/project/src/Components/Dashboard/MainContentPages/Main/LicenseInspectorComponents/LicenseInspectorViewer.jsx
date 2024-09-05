/* TODO:
- Improve the UI of the license details
- Add a button to copy the client ID to the clipboard
- Improve the UI of the license list
- Change some icons on license status
- If a license details was shown and you change the client, the license details should be cleared
*/

import React from "react";
import PropTypes from "prop-types";
import { FaMagnifyingGlass, FaCircleCheck, FaCircleXmark, FaCircleInfo, FaXmark, FaClipboard, FaArrowsRotate, FaClock } from "react-icons/fa6";

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

const LicenseInspectorViewer = ({ clients, licenses, onClientSelect, loadingLicenses, clearFilters, setLicenses }) => {
    const [selectedClient, setSelectedClient] = React.useState("");
    const [selectedLicense, setSelectedLicense] = React.useState(null);
    const [searchTerm, setSearchTerm] = React.useState("");
    const [licenseTypes, setLicenseTypes] = React.useState([]);
    const [licenseStatus, setLicenseStatus] = React.useState([]);
    const [selectedLicenseType, setSelectedLicenseType] = React.useState("");
    const [selectedLicenseStatus, setSelectedLicenseStatus] = React.useState("");

    React.useEffect(() => {
        const uniqueLicenseTypes = [...new Set(licenses.map((license) => license.packageName).filter(Boolean))];
        const uniqueLicenseStatus = [...new Set(licenses.map((license) => license.statusName && license.statusName.charAt(0).toUpperCase() + license.statusName.slice(1)).filter(Boolean))];
        setLicenseTypes(uniqueLicenseTypes);
        setLicenseStatus(uniqueLicenseStatus);
    }, [licenses]);

    const handleClientChange = (e) => {
        const clientId = e.target.value;
        setSelectedClient(clientId);

        if (clientId) {
            onClientSelect(clientId);
        } else {
            setLicenses([]);
            setSelectedLicense(null);
        }

        setSearchTerm("");
    };

    const handleLicenseSelect = (license) => {
        setSelectedLicense(license);
    };

    const handleCopyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
    };

    const filteredLicenses = licenses
        .filter((license) => {
            return license.packageName && license.packageName.toLowerCase().includes(searchTerm.toLowerCase());
        })
        .filter((license) => {
            return selectedLicenseType ? license.packageName === selectedLicenseType : true;
        })
        .filter((license) => {
            return selectedLicenseStatus ? license.statusName && license.statusName.toLowerCase() === selectedLicenseStatus.toLowerCase() : true;
        });

    const getStatusIcon = (status) => {
        switch (status.toLowerCase()) {
            case "active":
                return <FaCircleCheck className="text-green-500" />;
            case "inactive":
                return <FaCircleXmark className="text-red-500" />;
            case "expired":
                return <FaCircleInfo className="text-yellow-500" />;
            case "pending":
                return <FaClock className="text-blue-500" />;
            case "not assigned":
                return <FaArrowsRotate className="text-purple-500" />;
            default:
                return null;
        }
    };

    return (
        <div className="p-8 space-y-6 border rounded-lg shadow-lg bg-gray-50">
            <div className="flex flex-col space-y-6 md:flex-row md:space-x-6 md:space-y-0">
                <div className="flex flex-col w-full space-y-6 md:w-1/2">
                    <div className="w-72">
                        <label className="py-2 text-sm font-semibold text-gray-800">Client</label>
                        <select value={selectedClient} onChange={handleClientChange} className="w-full px-4 py-2 mt-2 text-gray-500 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500">
                            <option value="">Select a client</option>
                            {clients.map((client) => (
                                <option key={client.idClient} value={client.idClient}>
                                    {client.clientName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex space-x-2">
                        <div className="flex items-center ml-[1px] bg-white border border-gray-300 rounded-lg shadow-sm focus-within:ring-1 focus-within:ring-sky-500">
                            <FaMagnifyingGlass className="mx-2 text-gray-400" />
                            <input type="text" placeholder="Search..." className="py-2 pl-1 pr-4 bg-transparent border-none outline-none focus:ring-0" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
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
                                    {status}
                                </option>
                            ))}
                        </select>

                        {(selectedClient || searchTerm || selectedLicenseType || selectedLicenseStatus) && (
                            <button
                                onClick={() => {
                                    clearFilters();
                                    setLicenses([]);
                                    setSelectedClient("");
                                    setSelectedLicense(null);
                                    setSearchTerm("");
                                    setSelectedLicenseType("");
                                    setSelectedLicenseStatus("");
                                }}
                                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                <FaXmark className="w-4 h-4 mr-2" />
                                Reset
                            </button>
                        )}
                    </div>

                    <div className="overflow-x-auto bg-white border rounded-lg shadow-sm">
                        <table id="license-manager-list" className="min-w-full bg-white border rounded-lg shadow-sm table-fixed">
                            <thead className="text-gray-400 bg-gray-100 border">
                                <tr>
                                    <th className="px-4 py-4 text-xs font-medium text-left uppercase cursor-pointer min-w-52">License Type</th>
                                    <th className="px-4 py-4 text-xs font-medium text-left uppercase cursor-pointer min-w-52">Assigned To</th>
                                    <th className="px-4 py-4 text-xs font-medium text-left uppercase cursor-pointer min-w-52">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loadingLicenses ? (
                                    <tr>
                                        <td className="px-4 py-2" colSpan="3">
                                            Loading licenses...
                                        </td>
                                    </tr>
                                ) : filteredLicenses.length > 0 ? (
                                    filteredLicenses.map((license) => (
                                        <tr key={license.id} onClick={() => handleLicenseSelect(license)} className="cursor-pointer hover:bg-gray-50">
                                            <td className="px-4 py-2">{license.packageName}</td>
                                            <td className="px-4 py-2">{license.name || "N/A"}</td>
                                            <td className="px-4 py-2">
                                                <div className="flex items-center">
                                                    {getStatusIcon(license.statusName)}
                                                    <span className="ml-2">{license.statusName && license.statusName.charAt(0).toUpperCase() + license.statusName.slice(1)}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td className="px-4 py-2" colSpan="3">
                                            No licenses found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="flex flex-col w-full p-4 space-y-4 bg-white border border-gray-300 rounded-lg shadow-sm md:w-1/2">
                    {selectedLicense ? (
                        <>
                            <h2 className="text-lg font-semibold text-gray-800">License Details</h2>
                            <div>
                                <span className="block text-sm font-medium text-gray-500">License ID:</span>
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm text-gray-700">{selectedLicense.id}</span>
                                    <button onClick={() => handleCopyToClipboard(selectedLicense.id)} className="p-1 text-gray-500 border rounded hover:text-gray-700">
                                        <FaClipboard />
                                    </button>
                                </div>
                            </div>
                            <div>
                                <span className="block text-sm font-medium text-gray-500">Package:</span>
                                <span className="text-sm text-gray-700">{selectedLicense.packageName}</span>
                            </div>
                            <div>
                                <span className="block text-sm font-medium text-gray-500">Assigned To:</span>
                                <div className="flex flex-col">
                                    <span className="text-sm text-gray-700">{selectedLicense.name || "Not assigned"}</span>
                                    <span className="text-sm text-gray-700">ID: {selectedLicense.idUser || "N/A"}</span>
                                    <span className="text-sm text-gray-700">Email: {selectedLicense.email || "N/A"}</span>
                                </div>
                            </div>
                            <div>
                                <span className="block text-sm font-medium text-gray-500">Client ID:</span>
                                <span className="text-sm text-gray-700">{selectedLicense.clientId || "N/A"}</span>
                            </div>
                            <div>
                                <span className="block text-sm font-medium text-gray-500">Status:</span>
                                <span className="text-sm text-gray-700">{selectedLicense.statusName && selectedLicense.statusName.charAt(0).toUpperCase() + selectedLicense.statusName.slice(1)}</span>
                            </div>
                            <div>
                                <span className="block text-sm font-medium text-gray-500">Start Date:</span>
                                <span className="text-sm text-gray-700">{formatDate(selectedLicense.startDate)}</span>
                            </div>
                            <div>
                                <span className="block text-sm font-medium text-gray-500">Finish Date:</span>
                                <span className="text-sm text-gray-700">{formatDate(selectedLicense.finishDate)}</span>
                            </div>
                        </>
                    ) : (
                        <div className="text-sm text-gray-500">No license selected</div>
                    )}
                </div>
            </div>
        </div>
    );
};

LicenseInspectorViewer.propTypes = {
    clients: PropTypes.arrayOf(
        PropTypes.shape({
            idClient: PropTypes.string.isRequired,
            clientName: PropTypes.string.isRequired,
        })
    ).isRequired,
    licenses: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            packageName: PropTypes.string.isRequired,
            statusName: PropTypes.string.isRequired,
            name: PropTypes.string,
            idUser: PropTypes.string,
            email: PropTypes.string,
            clientId: PropTypes.string,
            startDate: PropTypes.string,
            finishDate: PropTypes.string,
        })
    ).isRequired,
    onClientSelect: PropTypes.func.isRequired,
    loadingLicenses: PropTypes.bool,
    clearFilters: PropTypes.func.isRequired,
    setLicenses: PropTypes.func.isRequired,
};

LicenseInspectorViewer.defaultProps = {
    loadingLicenses: false,
};

export default LicenseInspectorViewer;
