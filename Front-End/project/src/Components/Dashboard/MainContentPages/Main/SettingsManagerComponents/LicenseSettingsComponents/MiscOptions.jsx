import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { FaPenToSquare, FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import ClientService from "../../../../../../Services/ClientService";
import ClientFetchClient from "../../../../../../FetchClients/ClientFetchClient";
const MiscOptions = ({ triggerAlert }) => {
    const [isEditingMiscOptions, setIsEditing] = useState(false);
    const [allClients, setAllClients ] = useState([]);
    const clientService = new ClientService(ClientFetchClient);

    useEffect(()=>{   
        const fetchAllClients = async() => {    
            try{      
                const allClients = await clientService.GetAll();
                setAllClients(allClients);
            }catch (error) {
                console.error("Failed to fetch client data", error);
            }
        };

        fetchAllClients();
    }, [])


    const handleSubmit = (e) => {
        e.preventDefault();
        const sendData = () => {
            Object.keys(allClients).forEach(async (range) => {
                await clientService.SuspendClient(allClients[range]);
            })
        }
        
        sendData();
        
        triggerAlert("success", "Other Options updated", "Other options have been updated successfully.");
        setIsEditing(false);
    };
    
    const changeSuspended = (e, key) => {
        const updatedClients = allClients.map(client => {
            if (client.idClient === key) {
              return { ...client, suspended: !client.suspended };
            }
            return client;
          });
          setAllClients(updatedClients);
        }

    const handleEdit = () =>{
        setIsEditing(!isEditingMiscOptions)
    }

        return (
        <div className="p-8 space-y-6 bg-white border rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-gray-600">Suspend Client Account</h2>
                    <h3 className="text-sm font-normal text-gray-400">Small description here</h3>
                </div>
                <button onClick={handleEdit} className="text-gray-500 hover:text-sky-600 focus:outline-none">
                    <FaPenToSquare size={18} />
                </button>
            </div>
            <hr className="border-gray-200" />
            <form onSubmit={handleSubmit} className="space-y-6">
                <table id="suspend-clients-table" className="min-w-full bg-white border rounded-lg shadow-sm table-fixed">
                    <thead className={`text-gray-400 bg-gray-100 ${isEditingMiscOptions && "bg-gradient-to-r from-sky-500 to-sky-700 text-white"}`}>
                        <tr>
                            <th className={`px-4 py-4 text-xs font-medium text-left uppercase w-52 text-nowrap ${!isEditingMiscOptions && "border"}`}>
                                <p className="text-center">Unsuspended Clients</p>
                            </th>
                            <th className="px-4 py-4 text-xs font-medium text-left uppercase w-52 text-nowrap">
                                <p className="text-center">Suspended Clients</p>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border">
                                {
                                    Object.values(allClients).filter(client => client.suspended === false).map((client) => (
                                        <div key={client.idClient} onClick={(isEditingMiscOptions) && ((e) => changeSuspended(e, client.idClient))} className={`rounded-md m-3 border flex justify-center py-3 text-gray-400 bg-gray-100 ${isEditingMiscOptions ? "bg-gradient-to-r from-sky-500 to-sky-700 cursor-pointer" : "cursor-not-allowed"}`}>
                                            <p className={`mr-2 text-sm font-semibold text-gray-400 ${isEditingMiscOptions ? "text-white" : ""}`}>{client.clientName}</p>
                                            <FaArrowRightLong className={`text-2xl -translate-y-[1px] text-gray-400 ${isEditingMiscOptions ? "text-white" : ""}`} />
                                        </div>
                                    ))
                                }
                            </td>
                            <td className="border">
                                {
                                    Object.values(allClients).filter(client => client.suspended === true).map((client) => (
                                        <div key={client.idClient} onClick={(isEditingMiscOptions) && ((e) => changeSuspended(e, client.idClient))} className={`rounded-md m-3 border flex justify-center py-3 text-gray-400 bg-gray-100 ${isEditingMiscOptions ? "bg-gradient-to-r from-sky-500 to-sky-700 cursor-pointer" : "cursor-not-allowed"}`}>
                                            <FaArrowLeftLong className={`mr-2 -translate-y-[1px] text-2xl text-gray-400 ${isEditingMiscOptions ? "text-white" : ""}`} />
                                            <p className={`text-sm font-semibold text-gray-400 ${isEditingMiscOptions ? "text-white" : ""}`}>{client.clientName}</p>
                                        </div>
                                    ))
                                }
                            </td>
                        </tr>
                    </tbody>
                </table>
                <button type="submit" disabled={!isEditingMiscOptions} className={`px-4 py-2 font-semibold rounded-lg shadow-md focus:outline-none ${isEditingMiscOptions ? "text-white bg-sky-500 hover:bg-sky-600" : "text-gray-400 bg-gray-200 cursor-not-allowed"}`}>
                    Save Changes
                </button>
            </form>
        </div>
    );
};

MiscOptions.propTypes = {
    triggerAlert: PropTypes.func.isRequired,
};

export default MiscOptions;
