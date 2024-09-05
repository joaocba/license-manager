/* FOR PAGE WITHOUT CHARTS */

/* import { useState, useEffect } from "react";
import Header from "../Layout/Header";
import LogsList from "./LicenseManagerLogsComponents/LogsList";
import LicenseService from "../../../../Services/LicenseService";
import Spinner from "../Layout/Spinner.jsx";

const LicenseManagerLogs = () => {
    const [logs, setLogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const licenseService = new LicenseService();

        const fetchLogs = async () => {
            try {
                const data = await licenseService.getLicenseLogsByClientId();
                setLogs(data);
            } catch (error) {
                console.log("Failed to fetch logs", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLogs();
    }, []);

    return (
        <>
            <Header title="License Manager Logs" subtitle="View and filter logs of actions performed on license manager" />
            {isLoading ? (
                <Spinner />
            ) : (
                <>
                    <LogsList logs={logs} />
                </>
            )}
        </>
    );
};

export default LicenseManagerLogs;
 */

/* FOR PAGE WITH CHARTS */

import { useState, useEffect } from "react";
import Header from "../Layout/Header";
import LogsList from "./LicenseManagerLogsComponents/LogsList";
import LicenseService from "../../../../Services/LicenseService";
import Spinner from "../Layout/Spinner.jsx";
import Charts from "./LicenseManagerLogsComponents/Charts";
import { FaChevronLeft } from "react-icons/fa6";

const LicenseManagerLogs = () => {
    const [logs, setLogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const licenseService = new LicenseService();

        const fetchLogs = async () => {
            try {
                const data = await licenseService.getLicenseLogsByClientId();
                setLogs(data);
            } catch (error) {
                console.log("Failed to fetch logs", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLogs();
    }, []);

    return (
        <>
            <Header title="License Manager Logs" subtitle="View and filter logs of actions performed on license manager" />
            {isLoading ? (
                <Spinner />
            ) : (
                <>
                    <div className="flex items-end">
                        <button onClick={() => window.history.back()} className="flex items-center px-4 py-2 font-semibold text-white rounded-lg shadow-md focus:outline-none bg-sky-500 hover:bg-sky-600">
                            <FaChevronLeft className="mr-2" />
                            Return to License Manager
                        </button>
                    </div>
                    <Charts logs={logs} />
                    <LogsList logs={logs} />
                </>
            )}
        </>
    );
};

export default LicenseManagerLogs;
