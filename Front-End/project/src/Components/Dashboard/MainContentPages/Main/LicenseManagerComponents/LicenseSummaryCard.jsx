import { useState } from "react";
import PropTypes from "prop-types";
import { FaAward, FaUserPlus } from "react-icons/fa6";
import LicenseUserInvite from "./LicenseUserInvite";

const bgColorMap = {
    Basic: "bg-white border-gray-200",
    Medium: "bg-white border-gray-200",
    Pro: "bg-white border-gray-200",
};

const iconMap = {
    Pro: <FaAward className="text-5xl text-yellow-500 opacity-20" />,
};

const LicenseSummaryCard = ({ type, count, total, license }) => {
    const [isInviteVisible, setInviteVisible] = useState(false);

    const percentage = total > 0 ? (count / total) * 100 : 0;

    return (
        <>
            <div className={`relative p-8 w-80 flex items-center rounded-lg shadow-lg border ${bgColorMap[type]}`}>
                <div className="absolute top-4 right-4">{iconMap[type]}</div>
                <div className="relative flex flex-col items-center justify-center bg-white rounded-full shadow w-28 h-28">
                    <svg className="w-full h-full" viewBox="0 0 36 36">
                        <path
                            className="text-gray-200"
                            d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        ></path>
                        <path
                            className={total > 0 ? "text-sky-600" : "text-gray-200"}
                            d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeDasharray="100, 100"
                            strokeDashoffset={`${100 - percentage}`}
                            strokeLinecap="round"
                        ></path>
                    </svg>
                    <div className="absolute flex flex-col items-center">
                        <span className="text-4xl font-bold text-gray-600">{count}</span>
                        <p className="text-sm text-gray-400">Unused</p>
                    </div>
                </div>
                <div className="ml-4">
                    <h2 className="text-xl font-semibold text-gray-700">{type}</h2>
                    <p className="font-medium text-gray-500 text-md">Total: {total}</p>
                </div>
                {count > 0 && license && (
                    <button id="invite-button" className="absolute flex items-center px-3 py-1 text-sm font-semibold text-white bg-teal-500 rounded-lg shadow-md focus:outline-none hover:bg-teal-600 bottom-4 right-4" onClick={() => setInviteVisible(true)}>
                        <FaUserPlus className="mr-2" />
                        Invite
                    </button>
                )}
            </div>
            {license && <LicenseUserInvite isVisible={isInviteVisible} onClose={() => setInviteVisible(false)} license={{ id: license.id, type: license.type }} />}
        </>
    );
};

LicenseSummaryCard.propTypes = {
    type: PropTypes.string.isRequired,
    count: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    license: PropTypes.shape({
        id: PropTypes.string,
        type: PropTypes.string,
    }),
};

export default LicenseSummaryCard;
