import { useContext } from "react";
import UserContext from "../../../Context/UserContext";
import Header from "../Layout/Header";

const Home = () => {
    const { user } = useContext(UserContext);

    return (
        <>
            <Header title={`Welcome back, ${user?.name || "User"}!`} subtitle="Here's what's happening with your organization today" />
            <div className="mb-8">
                <h2 className="mb-4 text-xl font-semibold text-gray-800 md:text-2xl">Available tools</h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <div className="flex flex-col justify-between p-6 bg-white rounded-lg shadow-md">
                        <div>
                            <h3 className="mb-2 text-xl font-semibold text-gray-800">Add a new user</h3>
                            <p className="text-gray-600">Invite a new user to your organization where you can assign tasks and roles</p>
                        </div>
                        <button className="w-full px-4 py-2 mt-4 text-white rounded-md bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-blue-500">Invite</button>
                    </div>
                    <div className="flex flex-col justify-between p-6 bg-white rounded-lg shadow-md">
                        <div>
                            <h3 className="mb-2 text-xl font-semibold text-gray-800">Manage permissions</h3>
                            <p className="text-gray-600">Manage your users and teams permissions for available apps and modules</p>
                        </div>
                        <button className="w-full px-4 py-2 mt-4 text-white rounded-md bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-blue-500">Manage permissions</button>
                    </div>
                    <div className="flex flex-col justify-between p-6 bg-white rounded-lg shadow-md">
                        <div>
                            <h3 className="mb-2 text-xl font-semibold text-gray-800">Configure your settings</h3>
                            <p className="text-gray-600">Define your organization name and domain, configure notification preferences</p>
                        </div>
                        <button className="w-full px-4 py-2 mt-4 text-white rounded-md bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-blue-500">Settings</button>
                    </div>
                </div>
            </div>
            <div className="mb-8">
                <h2 className="mb-4 text-xl font-semibold text-gray-800 md:text-2xl">Reports</h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <div className="flex flex-col justify-between p-6 bg-white rounded-lg shadow-md">
                        <div>
                            <h3 className="mb-2 text-xl font-semibold text-gray-800">User activity</h3>
                            <p className="text-gray-600">Track your user and team activity across the entire organization</p>
                        </div>
                        <button className="w-full px-4 py-2 mt-4 text-white rounded-md bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-blue-500">View report</button>
                    </div>
                    <div className="flex flex-col justify-between p-6 bg-white rounded-lg shadow-md">
                        <div>
                            <h3 className="mb-2 text-xl font-semibold text-gray-800">Financial summary</h3>
                            <p className="text-gray-600">Get a financial summary of your organization's performance</p>
                        </div>
                        <button className="w-full px-4 py-2 mt-4 text-white rounded-md bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-blue-500">View report</button>
                    </div>
                </div>
            </div>
            <div>
                <h2 className="mb-4 text-xl font-semibold text-gray-800 md:text-2xl">Upcoming events</h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <div className="p-6 bg-white rounded-lg shadow-md">
                        <h3 className="mb-2 text-xl font-semibold text-gray-800">Team meeting</h3>
                        <p className="mb-2 text-gray-600">Discuss project progress and next steps</p>
                        <p className="text-gray-500">July 20, 2023 - 10:00 AM</p>
                    </div>
                    <div className="p-6 bg-white rounded-lg shadow-md">
                        <h3 className="mb-2 text-xl font-semibold text-gray-800">Client presentation</h3>
                        <p className="mb-2 text-gray-600">Present the new project proposal to the client</p>
                        <p className="text-gray-500">July 22, 2023 - 2:00 PM</p>
                    </div>
                    <div className="p-6 bg-white rounded-lg shadow-md">
                        <h3 className="mb-2 text-xl font-semibold text-gray-800">Team building event</h3>
                        <p className="mb-2 text-gray-600">Join the team for a fun and interactive team building activity</p>
                        <p className="text-gray-500">July 25, 2023 - 4:00 PM</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;
