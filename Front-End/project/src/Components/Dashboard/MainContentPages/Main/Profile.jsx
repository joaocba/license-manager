import "react";
import Header from "../Layout/Header";
import PropTypes from "prop-types";
import ProfilePresentation from "./ProfileComponents/Presentation";
import GeneralInformation from "./ProfileComponents/GeneralInformation";
import PasswordInformation from "./ProfileComponents/PasswordInformation";
import AlertsNotifications from "./ProfileComponents/AlertsNotifications";
import PictureInformation from "./ProfileComponents/PictureInformation";

const Profile = ({ triggerAlert }) => {
    
    return (
        <>
            <Header title="Profile" subtitle="Manage your profile here" />

            {/* Presentation */}
            <ProfilePresentation />

            <div className="flex mt-8 space-y-8 lg:flex-row lg:space-y-4 lg:space-x-8 gap-6 h-fit">
                {/* General Information */}
                <GeneralInformation triggerAlert={triggerAlert} />

                <div className="flex flex-col space-y-6 bg-white !m-0">
                    {/* Password Information */}
                    <PasswordInformation triggerAlert={triggerAlert} />

                    {/* Profile Picture */}
                    <PictureInformation triggerAlert={triggerAlert}/>
                </div>
            </div>

            {/* Alerts & Notifications */}
            <AlertsNotifications />
        </>
    );
};

Profile.propTypes = {
    triggerAlert: PropTypes.func.isRequired,
};

export default Profile;
