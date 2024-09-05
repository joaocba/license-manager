import { FaPenToSquare } from "react-icons/fa6";
import { useState, useContext } from "react";
import UserService from "../../../../../Services/UserService";
import PropTypes from "prop-types";
import ProfilePictureFetchClient from "../../../../../FetchClients/ProfilePictureFetchClient";
import UserContext from "../../../../Context/UserContext";
function formatBytes(bytes, decimals = 2) {
    if(!bytes){
        return;
    }
    
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

const PictureInformation = ({triggerAlert}) => {
    const [fileName, setFileName] = useState('');
    const [fileType, setFileType] = useState('');
    const [fileSize, setFileSize] = useState('');

    const [isEditingPicture, setIsEditingPicture] = useState(false);
    const [file, setFile] = useState(null);
    
    const { user, setUser } = useContext(UserContext);

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        if(!file){
            console.log("No file selected")
            return;
        }

        const fd = new FormData();
        fd.append("newPicture", file);

        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        try{
            const userService = new UserService(ProfilePictureFetchClient);
            await userService.changePicture(fd);
            
            const userData = await userService.getUserData(token);
            setUser(userData)

            triggerAlert("success", "Success", "Picture changed successfully.");
        }catch(error){
            triggerAlert("error", "Error", error.message || "An error occurred while changing your picture.");
        }
        finally{
            setIsEditingPicture(false);
        }
    };

    return (
        <div className="flex flex-col flex-1 p-8 space-y-6 bg-white border rounded-lg shadow-sm h-fit">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-600">Change Picture</h2>
                <button onClick={() => {setIsEditingPicture(!isEditingPicture)}} className="text-gray-500 hover:text-sky-600 focus:outline-none">
                    <FaPenToSquare size={18} />
                </button>
            </div>

            <hr className="border-gray-200" />

            <div className="flex items-center">
                <label htmlFor="changeImage" className={`text-center w-full px-4 py-2 font-semibold rounded-lg shadow-md focus:outline-none ${isEditingPicture ? "text-white bg-gradient-to-r from-sky-500 to-sky-700 hover:from-sky-600 hover:to-sky-800 cursor-pointer" : "text-gray-400 bg-gray-200 cursor-not-allowed"}`}>
                    <input multiple={false} id="changeImage" onChange={(e) => {setFile(e.target.files[0]); setFileName(e.target.files[0].name); setFileSize(e.target.files[0].size); setFileType(e.target.files[0].type)}} disabled={!isEditingPicture} type="file" accept="image/*" className="hidden"/>
                        <span>Choose Image</span>
                </label>
            </div>

            <div className="flex flex-col">
                <p className={`text-lg ${isEditingPicture ? "text-black" : "text-gray-400 "}`}>Name: <span className={`text-sm ${isEditingPicture ? "" : "hidden" }`}>{fileName}</span></p>
                <p className={`text-lg ${isEditingPicture ? "text-black" : "text-gray-400 "}`}>Type: <span className={`text-sm ${isEditingPicture ? "" : "hidden" }`}>{fileType}</span></p>
                <p className={`text-lg ${isEditingPicture ? "text-black" : "text-gray-400 "}`}>Size: <span className={`text-sm ${isEditingPicture ? "" : "hidden" }`}>{formatBytes(fileSize)}</span></p>
            </div>
            <div className="auto">
                <button onClick={handleSubmit} className={`px-4 py-2 font-semibold rounded-lg shadow-md focus:outline-none ${isEditingPicture ? "text-white bg-sky-500 hover:bg-sky-600" : "text-gray-400 bg-gray-200 cursor-not-allowed"}`}>
                    Save Picture
                </button>
            </div>
        </div>
    );
};

PictureInformation.propTypes = {
    triggerAlert: PropTypes.func.isRequired,
};

export default PictureInformation;