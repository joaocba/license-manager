import "react";
import Header from "../../Layout/Header";
import GlobalSettingsMain from "./GlobalSettingsComponents/GlobalSettingsMain";
import PropTypes from "prop-types";

const GlobalSettings = ({ triggerAlert }) => {
    return (
        <>
            <Header title="Global Settings" subtitle="Manage global settings here" />
            <div className="mt-8 space-y-8 lg:space-y-0 lg:grid lg:grid-cols-5 lg:gap-8">
                <div className="space-y-8 lg:col-span-3">
                    <GlobalSettingsMain triggerAlert={triggerAlert} />
                </div>
            </div>
        </>
    );
};

GlobalSettings.propTypes = {
    triggerAlert: PropTypes.func.isRequired,
};

export default GlobalSettings;
