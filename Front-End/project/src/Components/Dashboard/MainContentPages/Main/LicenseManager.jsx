import { useEffect, useState } from "react";
import Header from "../Layout/Header";
import LicenseSummary from "./LicenseManagerComponents/LicenseSummary";
import LicenseList from "./LicenseManagerComponents/LicenseList";
import LicenseListNotAssigned from "./LicenseManagerComponents/LicenseListNotAssigned";
import LicenseListExpired from "./LicenseManagerComponents/LicenseListExpired";
import LicensesService from "../../../../Services/LicenseService";
import PropTypes from "prop-types";
import Spinner from "../Layout/Spinner.jsx";

// Transform license data
const transformLicenseData = (data) => {
    return data.map((license) => ({
        id: license.idLicenses,
        type: license.package.packageName,
        typeId: license.fkIdPackage,
        packageParentData: license.package.fkPackageParentNavigation
            ? {
                  idPackageParent: license.package.fkPackageParentNavigation.idPackageParent,
                  packageParentName: license.package.fkPackageParentNavigation.packageParentName,
              }
            : null,
        purchaseDate: license.startDate,
        expirationDate: license.finishDate,
        assignedTo: license.fkUserNavigation
            ? {
                  id: license.fkUserNavigation.idUser,
                  name: license.fkUserNavigation.name,
                  email: license.fkUserNavigation.email,
              }
            : null,
        status: license.licenseStatus.status,
        transactionData: license.transaction
            ? {
                  id: license.transaction.idTransaction,
                  subscriptionType: license.transaction.fkSubscriptionType,
              }
            : null,
    }));
};

const LicenseManager = ({ triggerAlert }) => {
    const [licenses, setLicenses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const licenseService = new LicensesService();

    // Fetch licenses on component mount
    useEffect(() => {
        const fetchLicenses = async () => {
            try {
                const data = await licenseService.getUserLicenses();
                setLicenses(transformLicenseData(data));
            } catch (error) {
                console.error("Failed to fetch licenses", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLicenses();
    }, []);

    // Refresh licenses on demand for the list components
    const refreshLicenses = async () => {
        try {
            const data = await licenseService.getUserLicenses();
            setLicenses(transformLicenseData(data));
        } catch (error) {
            console.error("Failed to fetch licenses", error);
        }
    };

    return (
        <>
            <Header title="License Manager" subtitle="Manage your licenses" />
            {isLoading ? (
                <Spinner />
            ) : (
                <>
                    <LicenseSummary licenses={licenses} />
                    <LicenseList licenses={licenses} triggerAlert={triggerAlert} refreshLicenses={refreshLicenses} />
                    <LicenseListNotAssigned licenses={licenses} triggerAlert={triggerAlert} refreshLicenses={refreshLicenses} />
                    <LicenseListExpired licenses={licenses} />
                </>
            )}
        </>
    );
};

LicenseManager.propTypes = {
    triggerAlert: PropTypes.func.isRequired,
};

export default LicenseManager;
