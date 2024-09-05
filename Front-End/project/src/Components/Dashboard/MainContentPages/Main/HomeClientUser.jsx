/* import { useContext } from "react";
import UserContext from "../../../Context/UserContext";
import Header from "../Layout/Header";

const HomeClientUser = () => {
    const { user } = useContext(UserContext);

    return (
        <>
            <Header title={`Welcome back, ${user?.name || "User"}!`} subtitle="Here's what's happening with your organization today" />
        </>
    );
};

export default HomeClientUser;
 */

/* import { useContext } from "react";
import { Line, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, ArcElement } from "chart.js";
import Header from "../Layout/Header";
import UserContext from "../../../Context/UserContext";
import { FaBriefcase, FaDollarSign, FaCalendarAlt, FaTasks, FaClock, FaBoxOpen, FaUser } from "react-icons/fa";

// Register chart components
ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, ArcElement);

// Dummy Data
const tasksCompletedData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
        {
            label: "Tasks Completed",
            data: [5, 7, 3, 4, 6, 2, 0],
            fill: true,
            backgroundColor: "rgba(75,192,192,0.2)",
            borderColor: "rgba(75,192,192,1)",
            borderWidth: 2,
        },
    ],
};

const taskTypesData = {
    labels: ["Completed", "Incompleted", "Assigned", "Pending Review"],
    datasets: [
        {
            data: [15, 5, 10, 3],
            backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56", "#4BC0C0"],
            borderColor: "#fff",
            borderWidth: 2,
        },
    ],
};

const availableModules = [
    { module: "Recruitment", description: "Manage job postings, candidate applications, and hiring processes.", icon: <FaBriefcase /> },
    { module: "Recruitment w/Financial", description: "Includes financial aspects of recruitment.", icon: <FaDollarSign /> },
    { module: "Business", description: "Business management tools and analytics.", icon: <FaBriefcase /> },
    { module: "Projects", description: "Project management and tracking.", icon: <FaTasks /> },
    { module: "Actions", description: "Define and track various actions within the system.", icon: <FaCalendarAlt /> },
    { module: "Finance", description: "Financial management and reporting.", icon: <FaDollarSign /> },
    { module: "Timesheet", description: "Track employee working hours and attendance.", icon: <FaClock /> },
    { module: "Assets", description: "Manage company assets and inventory.", icon: <FaBoxOpen /> },
    { module: "Assessment", description: "Employee performance and skill assessments.", icon: <FaUser /> },
];

const HomeClientUser = () => {
    const { user } = useContext(UserContext);

    return (
        <>
            <Header title={`Welcome back, ${user?.name || "User"}!`} subtitle="Here's what's happening with your organization today" />
            <div className="space-y-8 md:p-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div className="col-span-2 p-6 bg-white border border-gray-200 rounded-lg shadow-md">
                        <h2 className="mb-4 text-2xl font-semibold text-gray-800">Tasks Per Day</h2>
                        <div className="relative h-64">
                            <Line
                                data={tasksCompletedData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: { display: true, position: "top" },
                                        tooltip: { callbacks: { label: (tooltipItem) => `${tooltipItem.dataset.label}: ${tooltipItem.raw} tasks` } },
                                    },
                                    scales: {
                                        x: { grid: { display: false }, ticks: { color: "#6b7280" } },
                                        y: { beginAtZero: true, grid: { color: "#e5e7eb" }, ticks: { color: "#6b7280" } },
                                    },
                                }}
                            />
                        </div>
                    </div>

                    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-md">
                        <h2 className="mb-4 text-2xl font-semibold text-gray-800">Task Tracker</h2>
                        <div className="relative h-64">
                            <Doughnut
                                data={taskTypesData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: { display: true, position: "top" },
                                        tooltip: { callbacks: { label: (tooltipItem) => `${tooltipItem.label}: ${tooltipItem.raw}` } },
                                    },
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                    <h2 className="mb-4 text-2xl font-semibold text-gray-800">Modules Available on Your License</h2>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {availableModules.map((module, index) => (
                            <div key={index} className="flex flex-col items-center p-4 border border-gray-200 rounded-lg shadow-sm bg-gray-50">
                                <div className="mb-4 text-4xl text-sky-600">{module.icon}</div>
                                <div className="text-center">
                                    <h3 className="text-xl font-semibold text-gray-800">{module.module}</h3>
                                    <p className="text-gray-600">{module.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default HomeClientUser;
 */

/* import { useContext, useEffect, useState } from "react";
import { Line, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, ArcElement } from "chart.js";
import Header from "../Layout/Header";
import UserContext from "../../../Context/UserContext";
import { FaBriefcase, FaDollarSign, FaCalendarAlt, FaTasks, FaClock, FaBoxOpen, FaUser, FaCogs, FaEnvelope, FaCheckCircle, FaBell } from "react-icons/fa";

// Register chart components
ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, ArcElement);

// Dummy Data
const tasksCompletedData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
        {
            label: "Tasks Completed",
            data: [5, 7, 3, 4, 6, 2, 0],
            fill: true,
            backgroundColor: "rgba(75,192,192,0.2)",
            borderColor: "rgba(75,192,192,1)",
            borderWidth: 2,
        },
    ],
};

const taskTypesData = {
    labels: ["Completed", "Incompleted", "Assigned", "Pending Review"],
    datasets: [
        {
            data: [15, 5, 10, 3],
            backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56", "#4BC0C0"],
            borderColor: "#fff",
            borderWidth: 2,
        },
    ],
};

const availableModules = [
    { module: "Recruitment", description: "Manage job postings, candidate applications, and hiring processes.", icon: <FaBriefcase /> },
    { module: "Recruitment w/Financial", description: "Includes financial aspects of recruitment.", icon: <FaDollarSign /> },
    { module: "Business", description: "Business management tools and analytics.", icon: <FaBriefcase /> },
    { module: "Projects", description: "Project management and tracking.", icon: <FaTasks /> },
    { module: "Actions", description: "Define and track various actions within the system.", icon: <FaCalendarAlt /> },
    { module: "Finance", description: "Financial management and reporting.", icon: <FaDollarSign /> },
    { module: "Timesheet", description: "Track employee working hours and attendance.", icon: <FaClock /> },
    { module: "Assets", description: "Manage company assets and inventory.", icon: <FaBoxOpen /> },
    { module: "Assessment", description: "Employee performance and skill assessments.", icon: <FaUser /> },
];

// News Icons
const newsIcons = {
    "System Update": <FaCogs />,
    "Task Completed": <FaCheckCircle />,
    "New Message": <FaEnvelope />,
    Reminder: <FaBell />,
};

// News Messages
const newsMessages = [
    { type: "System Update", message: "System maintenance scheduled for tonight.", timestamp: "2024-08-09T10:00:00Z" },
    { type: "Task Completed", message: "Project Alpha tasks have been completed.", timestamp: "2024-08-09T11:00:00Z" },
    { type: "New Message", message: "You have a new message from HR.", timestamp: "2024-08-09T12:00:00Z" },
    { type: "Reminder", message: "Don't forget to submit your timesheet.", timestamp: "2024-08-09T13:00:00Z" },
];

const HomeClientUser = () => {
    const { user } = useContext(UserContext);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % newsMessages.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const formatDate = (dateString) => {
        const options = { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false };
        return new Date(dateString).toLocaleDateString("en-US", options);
    };

    return (
        <>
            <Header title={`Welcome back, ${user?.name || "User"}!`} subtitle="Here's what's happening with your organization today" />
            <div className="space-y-8 md:p-6">
                <div className="flex items-center py-4 border rounded-lg shadow-sm bg-sky-600">
                    <div className="flex-shrink-0 px-4 text-sm font-semibold text-sky-100">News Feed</div>

                    <div className="relative flex-1">
                        {newsMessages.map((news, index) => (
                            <div key={index} className={`absolute inset-0 flex items-center transition-opacity duration-1000 ease-in-out ${currentIndex === index ? "opacity-100" : "opacity-0"}`}>
                                <div className="flex items-center text-sky-100">
                                    <div className="mr-3 text-lg">{newsIcons[news.type]}</div>
                                    <div className="flex-1 truncate">
                                        <p className="text-sm font-semibold">
                                            {formatDate(news.timestamp)} - {news.message}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div className="col-span-2 p-6 bg-white border border-gray-200 rounded-lg shadow-md">
                        <h2 className="mb-4 text-2xl font-semibold text-gray-800">Tasks Per Day</h2>
                        <div className="relative h-64">
                            <Line
                                data={tasksCompletedData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: { display: true, position: "top" },
                                        tooltip: { callbacks: { label: (tooltipItem) => `${tooltipItem.dataset.label}: ${tooltipItem.raw} tasks` } },
                                    },
                                    scales: {
                                        x: { grid: { display: false }, ticks: { color: "#6b7280" } },
                                        y: { beginAtZero: true, grid: { color: "#e5e7eb" }, ticks: { color: "#6b7280" } },
                                    },
                                }}
                            />
                        </div>
                    </div>

                    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-md">
                        <h2 className="mb-4 text-2xl font-semibold text-gray-800">Task Tracker</h2>
                        <div className="relative h-64">
                            <Doughnut
                                data={taskTypesData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: { display: true, position: "top" },
                                        tooltip: { callbacks: { label: (tooltipItem) => `${tooltipItem.label}: ${tooltipItem.raw}` } },
                                    },
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                    <h2 className="mb-4 text-2xl font-semibold text-gray-800">Modules Available on Your License</h2>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {availableModules.map((module, index) => (
                            <div key={index} className="flex flex-col items-center p-4 border border-gray-200 rounded-lg shadow-sm bg-gray-50">
                                <div className="mb-4 text-4xl text-sky-600">{module.icon}</div>
                                <div className="text-center">
                                    <h3 className="text-xl font-semibold text-gray-800">{module.module}</h3>
                                    <p className="text-gray-600">{module.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default HomeClientUser;
 */

import { useContext, useEffect, useState } from "react";
import { Line, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, ArcElement } from "chart.js";
import Header from "../Layout/Header";
import UserContext from "../../../Context/UserContext";
import { FaBriefcase, FaDollarSign, FaCalendarAlt, FaTasks, FaClock, FaBoxOpen, FaUser, FaCogs, FaEnvelope, FaCheckCircle, FaBell } from "react-icons/fa";

// Register chart components
ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, ArcElement);

// Dummy Data
const tasksCompletedData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
        {
            label: "Tasks Completed",
            data: [5, 7, 3, 4, 6, 2, 0],
            fill: true,
            backgroundColor: "rgba(75,192,192,0.2)",
            borderColor: "rgba(75,192,192,1)",
            borderWidth: 2,
        },
    ],
};

const taskTypesData = {
    labels: ["Completed", "Incompleted", "Assigned", "Pending Review"],
    datasets: [
        {
            data: [15, 5, 10, 3],
            backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56", "#4BC0C0"],
            borderColor: "#fff",
            borderWidth: 2,
        },
    ],
};

const availableModules = [
    { module: "Recruitment", description: "Manage job postings, candidate applications, and hiring processes.", icon: <FaBriefcase /> },
    { module: "Recruitment w/Financial", description: "Includes financial aspects of recruitment.", icon: <FaDollarSign /> },
    { module: "Business", description: "Business management tools and analytics.", icon: <FaBriefcase /> },
    { module: "Projects", description: "Project management and tracking.", icon: <FaTasks /> },
    { module: "Actions", description: "Define and track various actions within the system.", icon: <FaCalendarAlt /> },
    { module: "Finance", description: "Financial management and reporting.", icon: <FaDollarSign /> },
    { module: "Timesheet", description: "Track employee working hours and attendance.", icon: <FaClock /> },
    { module: "Assets", description: "Manage company assets and inventory.", icon: <FaBoxOpen /> },
    { module: "Assessment", description: "Employee performance and skill assessments.", icon: <FaUser /> },
];

// News Icons
const newsIcons = {
    "System Update": <FaCogs />,
    "Task Completed": <FaCheckCircle />,
    "New Message": <FaEnvelope />,
    Reminder: <FaBell />,
};

// News Messages
const newsMessages = [
    { type: "System Update", message: "System maintenance scheduled for tonight.", timestamp: "2024-08-09T10:00:00Z" },
    { type: "Task Completed", message: "Project Alpha tasks have been completed.", timestamp: "2024-08-09T11:00:00Z" },
    { type: "New Message", message: "You have a new message from HR.", timestamp: "2024-08-09T12:00:00Z" },
    { type: "Reminder", message: "Don't forget to submit your timesheet.", timestamp: "2024-08-09T13:00:00Z" },
];

const HomeClientUser = () => {
    const { user } = useContext(UserContext);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % newsMessages.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const formatDate = (dateString) => {
        const options = { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false };
        return new Date(dateString).toLocaleDateString("en-US", options);
    };

    return (
        <>
            <Header title={`Welcome back, ${user?.name || "User"}!`} subtitle="Here's what's happening with your organization today" />
            <div className="space-y-8 md:p-6">
                <div className="relative flex items-center py-2 border rounded-lg shadow-lg bg-sky-600">
                    <div className="flex-shrink-0 p-2 px-4 mx-2 text-sm font-semibold rounded-lg shadow-md text-sky-100 bg-sky-700">News Feed</div>
                    <div className="relative flex-1">
                        {newsMessages.map((news, index) => (
                            <div key={index} className={`absolute inset-0 flex items-center transition-opacity duration-1000 ease-in-out ${currentIndex === index ? "opacity-100" : "opacity-0"}`}>
                                <div className="flex items-start p-2 space-x-3 text-sky-100">
                                    <div className="text-lg">{newsIcons[news.type]}</div>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold">
                                            {formatDate(news.timestamp)} - {news.message}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div className="col-span-2 p-6 bg-white border border-gray-200 rounded-lg shadow-md">
                        <h2 className="mb-4 text-2xl font-semibold text-gray-800">Tasks Per Day</h2>
                        <div className="relative h-64">
                            <Line
                                data={tasksCompletedData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: { display: true, position: "top" },
                                        tooltip: { callbacks: { label: (tooltipItem) => `${tooltipItem.dataset.label}: ${tooltipItem.raw} tasks` } },
                                    },
                                    scales: {
                                        x: { grid: { display: false }, ticks: { color: "#6b7280" } },
                                        y: { beginAtZero: true, grid: { color: "#e5e7eb" }, ticks: { color: "#6b7280" } },
                                    },
                                }}
                            />
                        </div>
                    </div>

                    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-md">
                        <h2 className="mb-4 text-2xl font-semibold text-gray-800">Task Tracker</h2>
                        <div className="relative h-64">
                            <Doughnut
                                data={taskTypesData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: { display: true, position: "top" },
                                        tooltip: { callbacks: { label: (tooltipItem) => `${tooltipItem.label}: ${tooltipItem.raw}` } },
                                    },
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                    <h2 className="mb-4 text-2xl font-semibold text-gray-800">Modules Available on Your License</h2>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {availableModules.map((module, index) => (
                            <div key={index} className="flex flex-col items-center p-4 border border-gray-200 rounded-lg shadow-sm bg-gray-50">
                                <div className="mb-4 text-4xl text-sky-600">{module.icon}</div>
                                <div className="text-center">
                                    <h3 className="text-xl font-semibold text-gray-800">{module.module}</h3>
                                    <p className="text-gray-600">{module.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default HomeClientUser;
