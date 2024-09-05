import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import LicenseListNotAssignedItem from "./LicenseListNotAssignedItem";
import LicenseService from "../../../../../Services/LicenseService";
import LicenseListNotAssignedUpgradeModal from "./LicenseListNotAssignedUpgradeModal";

const LicenseListNotAssigned = ({ licenses, triggerAlert, refreshLicenses }) => {
    const [users, setUsers] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedLicense, setSelectedLicense] = useState(null);

    const notAssignedLicenses = licenses.filter((license) => !license.assignedTo && license.status === "not assigned");

    const licenseData = notAssignedLicenses.reduce((acc, license) => {
        const existing = acc.find((item) => item.type === license.packageParentData.packageParentName);
        if (existing) {
            existing.quantity += 1;
            existing.purchaseDates.push(license.purchaseDate);
            existing.expirationDates.push(license.expirationDate);
        } else {
            acc.push({
                id: license.id,
                type: license.packageParentData.packageParentName,
                typeId: license.typeId,
                purchaseDates: [license.purchaseDate],
                expirationDates: [license.expirationDate],
                quantity: 1,
            });
        }
        return acc;
    }, []);

    // Sort the licenseData array by type in the order of Basic, Medium, Pro
    const sortedLicenseData = licenseData.sort((a, b) => {
        const order = ["Basic", "Medium", "Pro"];
        return order.indexOf(a.type) - order.indexOf(b.type);
    });

    // Fetch users data
    useEffect(() => {
        const fetchUsers = async () => {
            const licenseService = new LicenseService();
            try {
                const usersData = await licenseService.getNonAssignedUsersByClientId();
                setUsers(usersData);
            } catch (error) {
                console.error("Error fetching users:", error);
                triggerAlert("error", "Error", "Failed to fetch users");
            }
        };

        fetchUsers();
    }, [triggerAlert]);

    // Edit license row (logic for edit button)
    const [editingLicenseId, setEditingLicenseId] = useState(null);

    const handleEdit = (licenseId) => {
        setEditingLicenseId(licenseId);
    };

    const handleCancelEdit = () => {
        setEditingLicenseId(null);
    };

    const handleUpgradeDowngradeClick = (licenseType) => {
        const licensesOfType = notAssignedLicenses.filter((license) => license.packageParentData.packageParentName === licenseType.type);
        setSelectedLicense({ ...licenseType, licenses: licensesOfType });
        setIsModalVisible(true);
    };

    return (
        <div className="mt-4 mb-5 overflow-x-auto">
            <h2 className="text-xl font-semibold text-gray-600">Not Assigned Licenses</h2>
            <table className="min-w-full mt-2 bg-white border rounded-lg shadow-md table-fixed">
                <thead className="text-gray-400 bg-gray-100 border">
                    <tr>
                        <th className="px-4 py-4 text-xs font-medium text-left uppercase w-52">License Type</th>
                        <th className="px-4 py-4 text-xs font-medium text-left uppercase w-52">Purchase Date</th>
                        <th className="px-4 py-4 text-xs font-medium text-left uppercase w-52">Expiration Date</th>
                        <th className="px-4 py-4 text-xs font-medium text-left uppercase w-52">Quantity</th>
                        <th className="px-4 py-4 text-xs font-medium text-left uppercase w-52">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedLicenseData.length > 0 ? (
                        sortedLicenseData.map((license) => {
                            const lowestPurchaseDate = license.purchaseDates.reduce((min, date) => (date < min ? date : min), license.purchaseDates[0]);
                            const highestExpirationDate = license.expirationDates.reduce((max, date) => (date > max ? date : max), license.expirationDates[0]);

                            return (
                                <LicenseListNotAssignedItem
                                    triggerAlert={triggerAlert}
                                    key={license.id}
                                    license={{
                                        ...license,
                                        purchaseDate: lowestPurchaseDate,
                                        expirationDate: highestExpirationDate,
                                    }}
                                    refreshLicenses={refreshLicenses}
                                    isEditing={editingLicenseId === license.id}
                                    onEdit={handleEdit}
                                    onCancel={handleCancelEdit}
                                    users={users}
                                    onUpgradeDowngradeClick={handleUpgradeDowngradeClick}
                                />
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan="5" className="px-4 py-6 font-medium text-center text-gray-400">
                                No licenses left to assign
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            {selectedLicense && <LicenseListNotAssignedUpgradeModal isVisible={isModalVisible} onClose={() => setIsModalVisible(false)} license={selectedLicense} onConfirm={() => setIsModalVisible(false)} />}
        </div>
    );
};

LicenseListNotAssigned.propTypes = {
    licenses: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            type: PropTypes.string.isRequired,
            typeId: PropTypes.string.isRequired,
            purchaseDate: PropTypes.string,
            expirationDate: PropTypes.string,
            assignedTo: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.shape({
                    name: PropTypes.string.isRequired,
                    email: PropTypes.string.isRequired,
                }),
            ]),
        })
    ).isRequired,
    triggerAlert: PropTypes.func.isRequired,
    refreshLicenses: PropTypes.func.isRequired,
};

export default LicenseListNotAssigned;
