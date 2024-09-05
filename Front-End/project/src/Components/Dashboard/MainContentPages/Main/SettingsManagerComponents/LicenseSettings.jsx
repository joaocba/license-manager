/* TODO:
- Verify backend compatibility
- Refactor code to use API calls (currently using dummy data)
- Fetch data from API
- Submit data to API
*/

import PropTypes from "prop-types";
import Header from "../../Layout/Header";
import DiscountRates from "./LicenseSettingsComponents/DiscountRates";
import MiscOptions from "./LicenseSettingsComponents/MiscOptions";

const LicenseSettings = ({ triggerAlert }) => {
    /*const [settings, setSettings] = useState({
        suspendAllLicenses: false,
        suspendStartDate: "",
        suspendEndDate: "",
        suspendMessage: "",
        minLicensesToBuy: 1,
        maxLicensesToBuy: 100,
        allowMultiplePackages: false,
        packageNames: {
            basic: "Basic",
            medium: "Medium",
            pro: "Pro",
        },
        pricesPerPackage: [
            {
                type: "Monthly",
                prices: {
                    basic: 10.0,
                    medium: 20.0,
                    pro: 30.0,
                },
                startDate: "2024-01-01",
                endDate: "2024-12-31",
            },
            {
                type: "Yearly",
                prices: {
                    basic: 100.0,
                    medium: 200.0,
                    pro: 300.0,
                },
                startDate: "2024-01-01",
                endDate: "2024-12-31",
            },
        ],
        timeOffsetDays: 30,
    });

    const updateSettings = (e) => {
        const { name, type, checked, value } = e.target;

        if (type === "checkbox") {
            setSettings((prevSettings) => ({
                ...prevSettings,
                [name]: checked,
            }));
        } else if (name.startsWith("packageNames") || name.startsWith("pricesPerPackage")) {
            const [group, key] = name.split(".");
            setSettings((prevSettings) => ({
                ...prevSettings,
                [group]: {
                    ...prevSettings[group],
                    [key]: value,
                },
            }));
        } else if (name.startsWith("discountRates")) {
            const rateKey = name.split(".")[1];
            setSettings((prevSettings) => ({
                ...prevSettings,
                discountRates: {
                    ...prevSettings.discountRates,
                    [rateKey]: parseFloat(value),
                },
            }));
        } else {
            setSettings((prevSettings) => ({
                ...prevSettings,
                [name]: value,
            }));
        }
    };
    */

    return (
        <>
            <Header title="License Settings" subtitle="Manage license settings here" />
            <div className="mt-8 space-y-8 lg:space-y-0 lg:grid lg:grid-cols-1 lg:gap-8">
                <div className="space-y-8 lg:col-span-3">
                    <div className="space-y-6">
                        <DiscountRates triggerAlert={triggerAlert} />
                        {/*
                            <LicenseLimits settings={settings} updateSettings={updateSettings} triggerAlert={triggerAlert} />
                        */}
                        <MiscOptions triggerAlert={triggerAlert} />
                    </div>
                </div>
            </div>
        </>
    );
};

LicenseSettings.propTypes = {
    triggerAlert: PropTypes.func.isRequired,
};

export default LicenseSettings;
