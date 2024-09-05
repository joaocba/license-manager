import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import TransactionsHistory from "./TransactionsHistory";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";
import TransactionService from "../../../../../Services/TransactionService";
import Spinner from "../../Layout/Spinner";
import Header from "../../Layout/Header";
import UserFetchClient from "../../../../../FetchClients/UserFetchClient";

const transformTransactionsData = (data) => {
    return data.map((transaction) => ({
        id: transaction.idTransaction,
        transactionType: transaction.fkTransactionType,
        packageType: transaction.fkPackage,
        timestamp: transaction.timestamp,
        startingDate: transaction.startDate,
        finishDate: transaction.finishDate,
        licenseAmount: transaction.licenseAmount,
        transactionCost: transaction.licenseCost,
        paymentMethod: transaction.fkPaymentType,
        subscriptionType: transaction.fkSubscriptionType,
        balance: transaction.balanceCredit,
        status: transaction.fkStatus,
    }));
};

const AllTransactions = ({ triggerAlert }) => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const transactionService = new TransactionService(UserFetchClient);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const data = await transactionService.getTransactions();
                setTransactions(transformTransactionsData(data));
            } catch (error) {
                console.error("Failed to fetch transactions", error);
                triggerAlert("error", "Error", "Failed to fetch transactions");
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, []);

    const refreshTransactions = async () => {
        try {
            const data = await transactionService.getTransactions();
            setTransactions(transformTransactionsData(data));
        } catch (error) {
            console.error("Failed to refresh transactions", error);
            triggerAlert("error", "Error", "Failed to refresh transactions");
        }
    };

    if (loading) {
        return <Spinner />;
    }

    return (
        <>
            <Header title="All Transactions" subtitle="See all transactions" />

            <TransactionsHistory transactions={transactions} refreshTransactions={refreshTransactions} />

            <Link to="/dashboard/billing" className="px-3 py-1 font-semibold text-white bg-red-500 rounded-lg focus:outline-none hover:bg-gray-500">
                <FaArrowLeft className="inline -translate-y-px" /> Back
            </Link>
        </>
    );
};

AllTransactions.propTypes = {
    triggerAlert: PropTypes.func.isRequired,
};

export default AllTransactions;
