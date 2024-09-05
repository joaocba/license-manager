import { useContext, useEffect, useState  } from "react";
import UserContext from "../../../../Context/UserContext";
import { FaFacebook, FaTwitter, FaInstagram, FaCircleCheck, FaCircleExclamation } from "react-icons/fa6";
const ProfilePresentation = () => {
    const { user } = useContext(UserContext);
    

    return (
        <div className="flex items-center justify-center rounded-lg shadow-sm h-70 bg-gradient-to-br from-sky-100 via-sky-200 to-sky-300">
            <div className="flex flex-col items-center p-8 space-y-2">
                <div className="relative">
                    <img src={user.profilePicture.base64} alt="Profile" className="w-32 h-32 border-4 border-white rounded-full shadow-md" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-800">{user?.name}</h2>
                <p className="flex items-center text-lg text-gray-600">
                    {user?.email} {user?.isVerified ? <FaCircleCheck className="ml-1 text-teal-500" title="Verified account" /> : <FaCircleExclamation className="ml-1 text-amber-500" title="Unverified account" />}
                </p>
                <div className="flex mt-4 space-x-4">
                    <a href="#" className="text-gray-600 hover:text-blue-600">
                        <FaFacebook size={24} />
                    </a>
                    <a href="#" className="text-gray-600 hover:text-blue-400">
                        <FaTwitter size={24} />
                    </a>
                    <a href="#" className="text-gray-600 hover:text-red-500">
                        <FaInstagram size={24} />
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ProfilePresentation;
