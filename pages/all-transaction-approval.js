import React, { useEffect, useState } from 'react';
import styles from "@/styles/PropertyList.module.css";
import Navbar from "@/components/Navbar";
import Link from 'next/link';

const AgentTransactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await fetch('https://a.khelogame.xyz/agent/transactions', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                    }
                });

                if (!response.ok) {
                    console.error('Network response status:', response.status, response.statusText);
                    throw new Error(`Network response was not ok: ${response.statusText}`);
                }

                const data = await response.json();
                setTransactions(data.transactions);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <>
            <Navbar />
            <section className={styles.dashboard_main_box}>
                <h2>Transactions List</h2>
                <div className={styles.table_big_box}>
                    <table className={styles.customers}>
                        <thead>
                            <tr>
                                <th>S No.</th>
                                <th>Property Detail</th>
                                <th>TNC Document Contract</th>
                                <th>Owners Document</th>
                                <th>Payment Cheques</th>
                                <th>Created At</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.length > 0 ? (
                                transactions.map((transaction, index) => (
                                    <tr key={transaction.id}>
                                        <td>{index + 1}</td>
                                        <td>{transaction.property_detail}</td>
                                        <td>
                                            <Link href={`https://a.khelogame.xyz/${transaction.tnc_document_contract}`} target="_blank" rel="noopener noreferrer">
                                                View Document
                                            </Link>
                                        </td>
                                        <td>
                                            <Link href={`https://a.khelogame.xyz/${transaction.owners_document}`} target="_blank" rel="noopener noreferrer">
                                                View Document
                                            </Link>
                                        </td>
                                        <td>
                                            <Link href={`https://a.khelogame.xyz/${transaction.payment_cheques}`} target="_blank" rel="noopener noreferrer">
                                                View Cheque
                                            </Link>
                                        </td>
                                        <td>{new Date(transaction.created_at).toLocaleDateString()}</td>
                                        <td>{transaction.status}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7">No transactions found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </>
    );
}

export default AgentTransactions;