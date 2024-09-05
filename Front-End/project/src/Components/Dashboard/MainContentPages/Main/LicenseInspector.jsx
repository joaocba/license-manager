import { useEffect, useState } from "react";
import Header from "../Layout/Header";
import LicenseService from "../../../../Services/LicenseService";
import LicenseInspectorViewer from "./LicenseInspectorComponents/LicenseInspectorViewer";

const LicenseInspector = () => {
    const [clients, setClients] = useState([]);
    const [licenses, setLicenses] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);
    const [loadingClients, setLoadingClients] = useState(true);
    const [loadingLicenses, setLoadingLicenses] = useState(false);

    useEffect(() => {
        const fetchClients = async () => {
            const service = new LicenseService();
            try {
                const clientsList = await service.getClientsList();
                setClients(clientsList);
            } catch (error) {
                console.error("Error fetching clients:", error);
            } finally {
                setLoadingClients(false);
            }
        };

        fetchClients();
    }, []);

    const fetchLicenses = async (clientId) => {
        const service = new LicenseService();
        setLoadingLicenses(true);
        try {
            const licensesList = await service.getLicensesDataByClientId(clientId);
            setLicenses(licensesList);
        } catch (error) {
            console.error("Error fetching licenses:", error);
        } finally {
            setLoadingLicenses(false);
        }
    };

    const handleClientSelect = (clientId) => {
        setSelectedClient(clientId);
        fetchLicenses(clientId);
    };

    const clearFilters = () => {
        setSelectedClient(null);
        setLicenses([]);
        setLoadingLicenses(false);
    };

    return (
        <>
            <Header title="License Inspector" subtitle="Inspect and view license details" />
            <div className="flex flex-col mt-8 space-y-8">
                <div>{loadingClients ? <p>Loading clients...</p> : <LicenseInspectorViewer clients={clients} licenses={licenses} onClientSelect={handleClientSelect} loadingLicenses={loadingLicenses} clearFilters={clearFilters} setLicenses={setLicenses} />}</div>
            </div>
        </>
    );
};

export default LicenseInspector;
