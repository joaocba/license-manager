import "react";
import Header from "../../Layout/Header";
import BillingSettingsMain from "./BillingSettingsComponents/BillingSettingsMain";
import PropTypes from "prop-types";

const BillingSettings = ({ triggerAlert }) => {
    return (
        <>
            <Header title="Billing Settings" subtitle="Manage billing settings here" />
            <div className="mt-8 space-y-8 lg:space-y-0 lg:grid lg:grid-cols-5 lg:gap-8">
                <div className="space-y-8 lg:col-span-3">
                    <BillingSettingsMain triggerAlert={triggerAlert} />
                </div>
            </div>
        </>
    );
};

BillingSettings.propTypes = {
    triggerAlert: PropTypes.func.isRequired,
};

export default BillingSettings;
