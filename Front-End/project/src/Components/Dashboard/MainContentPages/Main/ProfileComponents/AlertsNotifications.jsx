import { useState, useEffect } from "react";
import UserPreferencesService from "../../../../../Services/UserPreferencesService";
import UserFetchClient from "../../../../../FetchClients/UserFetchClient";

const AlertsNotifications = () => {
    const [preferences, setPreferences] = useState({});

    useEffect(() => {
        const fetchPreferences = async () => {
            const userPreferencesService = new UserPreferencesService(UserFetchClient);
            try {
                const prefs = await userPreferencesService.getUserPreferences();
                setPreferences(prefs);
            } catch (error) {
                console.error("Error fetching user preferences:", error);
            }
        };

        fetchPreferences();
    }, []);

    const handleToggle = async (category, type) => {
        const newPreferences = {
            ...preferences,
            [`notification${category}${type}`]: !preferences[`notification${category}${type}`],
        };
        setPreferences(newPreferences);

        const userPreferencesService = new UserPreferencesService(UserFetchClient);
        try {
            await userPreferencesService.updateUserPreferences(newPreferences);
        } catch (error) {
            console.error("Error updating user preferences:", error);
        }
    };

    const notificationCategories = [
        { name: "Billing", description: "Receive billing alerts and updates." },
        { name: "System", description: "Get notified about system updates and outages." },
        { name: "Security", description: "Stay informed about security-related issues." },
        { name: "Message", description: "Receive messages from other users." },
    ];

    const notificationTypes = ["App", "Email", "Sms"];

    return (
        <div className="flex flex-col flex-1 p-8 mt-8 space-y-4 bg-white border rounded-lg shadow-sm lg:w-full h-fit">
            <h2 className="text-xl font-semibold text-gray-600">Alerts & Notifications</h2>
            <hr className="border-gray-200" />
            <div className="space-y-4">
                {notificationCategories.map((category) => (
                    <div key={category.name} className="flex flex-col pb-4 border-b border-gray-200">
                        <div className="items-center justify-between space-y-4 lg:space-y-0 lg:space-x-4 lg:flex">
                            <div className="flex flex-col">
                                <h3 className="text-lg font-semibold text-gray-700">{category.name}</h3>
                                <p className="text-sm text-gray-500">{category.description}</p>
                            </div>
                            <div className="flex space-x-3 lg:space-x-10">
                                {notificationTypes.map((type) => (
                                    <div key={`${type}-${category.name}`} className="flex items-center">
                                        <label className="switch">
                                            <input type="checkbox" checked={preferences[`notification${category.name}${type}`] || false} onChange={() => handleToggle(category.name, type)} className="toggle-checkbox" />
                                            <span className="toggle-slider"></span>
                                        </label>
                                        <span className="ml-1 text-sm font-semibold text-gray-600">{type}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default AlertsNotifications;
