/* import Header from "../Layout/Header";
import AllTransactionsCard from "./BillingComponents/AllTransactionsCard";
import TransactionsPaid from "./BillingComponents/TransactionsPaid";
import PropTypes from "prop-types";
import PaymentMethodCard from "./BillingComponents/PaymentMethodCard";
import NumberFormat from "../../../../Helper/NumberFormat";
const Billing = ({ transactions, refreshTransactions }) => {
    const lastTransaction = transactions.at(-1);
    const balance = lastTransaction?.balance;

    return (
        <>
            <Header title="Billing" subtitle="Manage your billing information here" />

            <div className="flex flex-col w-full gap-6 mb-8 xl:flex-row">
                <AllTransactionsCard transactions={transactions} />
                <PaymentMethodCard />

                <div className="rounded-lg shadow-lg border h-[250px] w-full px-8 py-8 duration-200 transition-transform hover:scale-105 cursor-pointer">
                    <h1 className="text-2xl font-bold text-sky-600">Balance account</h1>
                    <h2 className="text-lg font-medium text-gray-800">{NumberFormat(balance, 2, ",", ".")}€</h2>
                </div>
            </div>
            <TransactionsPaid transactions={transactions} refreshTransactions={refreshTransactions} />
        </>
    );
};

Billing.propTypes = {
    transactions: PropTypes.array.isRequired,
    refreshTransactions: PropTypes.func.isRequired,
};

export default Billing;
 */

import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Header from "../Layout/Header";
import AllTransactionsCard from "./BillingComponents/AllTransactionsCard";
import TransactionsPaid from "./BillingComponents/TransactionsPaid";
import PaymentMethodCard from "./BillingComponents/PaymentMethodCard";
import NumberFormat from "../../../../Helper/NumberFormat";
import TransactionService from "../../../../Services/TransactionService";
import Spinner from "../Layout/Spinner";
import UserFetchClient from "../../../../FetchClients/UserFetchClient";

const transformTransactionsData = (data) => {
    return data.map((transaction) => ({
        id: transaction.idTransaction,
        transactionType: transaction.fkTransactionType,
        packageType: transaction.fkPackage,
        timestamp: transaction.timestamp,
        startingDate: transaction.startDate,
        finishDate: transaction.finishDate,
        licenseAmount: transaction.licenseAmount,
        clientId: transaction.fkClient,
        transactionCost: transaction.licenseCost,
        paymentMethod: transaction.fkPaymentType,
        subscriptionType: transaction.fkSubscriptionType,
        balance: transaction.balanceCredit,
        status: transaction.fkStatus,
    }));
};

const Billing = ({ triggerAlert }) => {
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

    const lastTransaction = transactions.at(-1);
    const balance = lastTransaction?.balance;

    return (
        <>
            <Header title="Billing" subtitle="Manage your billing information here" />
            <div className="flex flex-col w-full gap-6 mb-8 xl:flex-row">
                <AllTransactionsCard transactions={transactions} />
                <PaymentMethodCard />
                <div className="rounded-lg shadow-lg border h-[250px] w-full px-8 py-8 duration-200 transition-transform hover:scale-105 cursor-pointer">
                    <h1 className="text-2xl font-bold text-sky-600">Balance account</h1>
                    <h2 className="text-lg font-medium text-gray-800">{NumberFormat(balance, 2, ",", ".")}€</h2>
                </div>
            </div>
            <TransactionsPaid transactions={transactions} refreshTransactions={refreshTransactions} />
        </>
    );
};

Billing.propTypes = {
    triggerAlert: PropTypes.func.isRequired,
};

export default Billing;
