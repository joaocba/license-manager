import "react";
import PropTypes from "prop-types";
import userAvatar from "../../../../../Resources/blank_avatar_person.png";

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

const LicenseListExpiredItem = ({ license }) => {
    const assignedToText =
        license.assignedTo && typeof license.assignedTo === "object" ? (
            <div className="flex items-center">
                <img src={userAvatar} alt="User Avatar" className="mr-3 rounded-full w-9 h-9 opacity-60" />
                <div className="flex flex-col">
                    <span className="font-medium">{license.assignedTo.name}</span>
                    <span className="text-sm text-gray-400">{license.assignedTo.email}</span>
                </div>
            </div>
        ) : (
            <span className="text-sm text-gray-400">-</span>
        );

    return (
        <tr className="h-20 border-b hover:bg-gray-100">
            <td className="px-4 align-middle">
                <div className="flex flex-col">
                    <span className="font-medium">{license.type}</span>
                    <span className="text-xs text-gray-400">ID: {license.id}</span>
                </div>
            </td>
            <td className="px-4 align-middle">{formatDate(license.purchaseDate)}</td>
            <td className="px-4 align-middle">{formatDate(license.expirationDate)}</td>
            <td className="px-4 align-middle">{assignedToText}</td>
        </tr>
    );
};

LicenseListExpiredItem.propTypes = {
    license: PropTypes.shape({
        id: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        purchaseDate: PropTypes.string,
        expirationDate: PropTypes.string,
        assignedTo: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.shape({
                name: PropTypes.string.isRequired,
                email: PropTypes.string.isRequired,
            }),
        ]),
        status: PropTypes.oneOf(["active", "inactive", "not assigned", "expired", "pending"]).isRequired,
    }).isRequired,
};

export default LicenseListExpiredItem;
