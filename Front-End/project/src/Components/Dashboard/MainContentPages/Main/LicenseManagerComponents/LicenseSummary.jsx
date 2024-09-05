import "react";
import PropTypes from "prop-types";
import LicenseSummaryCard from "./LicenseSummaryCard";

// Helper function to extract the base type from the license type, it support "Basic", "Basic V2", "Medium V1", "Medium V2", "Pro", "Pro V5", etc
const getBaseType = (type) => {
    if (type.startsWith("Basic")) return "Basic";
    if (type.startsWith("Medium")) return "Medium";
    if (type.startsWith("Pro")) return "Pro";
    return null;
};

const LicenseSummary = ({ licenses }) => {
    const licenseCounts = licenses.reduce((acc, license) => {
        const baseType = getBaseType(license.type);
        if (baseType) {
            const isUnused = (license.status === "inactive" && !license.assignedTo) || license.status === "not assigned";
            if (isUnused) {
                acc[baseType] = (acc[baseType] || 0) + 1;
            }
        }
        return acc;
    }, {});

    const totalLicenses = licenses.reduce(
        (acc, license) => {
            const baseType = getBaseType(license.type);
            if (baseType && license.status !== "expired") {
                acc[baseType] = (acc[baseType] || 0) + 1;
            }
            return acc;
        },
        {
            Basic: 0,
            Medium: 0,
            Pro: 0,
        }
    );

    return (
        <div className="flex flex-col gap-6 mb-8 md:flex-row w-fit">
            <div className="flex-1">
                <h2 className="mb-4 text-xl font-semibold text-gray-600">License Summary</h2>
                <div className="flex flex-wrap gap-4">
                    {Object.keys(totalLicenses).map((type) => {
                        const license = licenses.find((license) => getBaseType(license.type) === type && ((license.status === "inactive" && !license.assignedTo) || license.status === "not assigned"));
                        return (
                            <LicenseSummaryCard
                                key={type}
                                type={type}
                                count={licenseCounts[type] || 0}
                                total={totalLicenses[type]}
                                license={license} // Pass the entire license object
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

LicenseSummary.propTypes = {
    licenses: PropTypes.array.isRequired,
};

export default LicenseSummary;
