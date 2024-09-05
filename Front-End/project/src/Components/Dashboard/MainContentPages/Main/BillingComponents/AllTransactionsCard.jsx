import { Link } from "react-router-dom";
import PropTypes from "prop-types";
const AllTransactionsCard = () => {
    return (
        <Link to="/dashboard/billing/all-transactions" className="w-full">
            <div className="flex flex-col h-[250px] w-full px-8 py-8 items-start rounded-lg shadow-lg border duration-200 transition-transform hover:scale-105 cursor-pointer">
                <h2 className="text-2xl font-bold text-sky-600">All Transactions</h2>

                <p className="px-3 mt-2">Click here to see all transactions information</p>
            </div>
        </Link>
    );
};

AllTransactionsCard.propTypes = {
    transactions: PropTypes.array.isRequired,
};

export default AllTransactionsCard;
