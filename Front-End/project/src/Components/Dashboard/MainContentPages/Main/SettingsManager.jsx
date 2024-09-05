import "react";
import { FaGear, FaKey, FaCreditCard } from "react-icons/fa6";
import Header from "../Layout/Header";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const CardButton = ({ icon: Icon, title, description, url }) => {
    const navigate = useNavigate();

    return (
        <div onClick={() => navigate(url)} className="p-8 transition-shadow duration-300 bg-white border rounded-lg shadow-md cursor-pointer hover:shadow-lg">
            <div className="flex items-center space-x-6">
                <Icon className="text-5xl text-sky-600" />
                <div>
                    <h3 className="text-2xl font-semibold text-gray-700">{title}</h3>
                    <p className="mt-2 text-gray-500">{description}</p>
                </div>
            </div>
        </div>
    );
};

const SettingsManager = () => {
    return (
        <>
            <Header title="Settings Manager" subtitle="Manage global settings here that affect all dashboards" />
            <div className="grid grid-cols-1 gap-8 mt-12 md:grid-cols-2 lg:grid-cols-3">
                <CardButton icon={FaGear} title="Global Settings" description="Manage settings that affect all dashboards" url="/dashboard/settings-manager/global" />
                <CardButton icon={FaKey} title="License Settings" description="Manage your license and subscription" url="/dashboard/settings-manager/license" />
                <CardButton icon={FaCreditCard} title="Billing Settings" description="Manage billing and payment information" url="/dashboard/settings-manager/billing" />
            </div>
        </>
    );
};

CardButton.propTypes = {
    icon: PropTypes.elementType.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
};

export default SettingsManager;
