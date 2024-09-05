import { useState } from "react";
import { FaRegCreditCard } from "react-icons/fa6";
const PaymentMethodCard = () => {
    const [buttonHovered, setButtonHovered] = useState(false);

    function handleTransactionsManagementClick() {
        //Redirect to change payment method
    }

    const handleButtonHover = () => {
        setButtonHovered(true);
    };
    const handleButtonNotHover = () => {
        setButtonHovered(false);
    };

    return (
        <div className={!buttonHovered ? "text-nowrap flex flex-col justify-between h-[250px] w-full px-8 py-8 items-start rounded-lg shadow-lg border duration-200 transition-transform hover:scale-105 cursor-pointer" : "text-nowrap flex flex-col justify-between h-[250px] w-full px-8 py-8 items-start rounded-lg shadow-lg border duration-200 transition-transform hover:scale-100"} onClick={handleTransactionsManagementClick()}>
            <h2 className="text-2xl font-bold text-sky-600">Payment Methods</h2>

            <div className="my-4 ml-2">
                <FaRegCreditCard className="text-[3em] inline mr-4" />
                <p className="inline text-lg font-semibold">****-****-****-1387</p>
                <p className="font-medium text-gray-400">Expires 09/2027</p>
            </div>

            <button className="flex items-center px-3 py-1 ml-2 font-semibold text-white transition-transform duration-200 rounded-lg hover:scale-105 bg-sky-600 focus:outline-none hover:bg-sky-500" onMouseOver={handleButtonHover} onMouseOut={handleButtonNotHover}>
                Change payment method
            </button>
        </div>
    );
};

export default PaymentMethodCard;
