import React, { useEffect, useState } from 'react';
import styles from "@/styles/WalletCoins.module.css";
import Navbar from "@/components/Navbar";
import Image from 'next/image';
import Link from 'next/link';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RedeemCoins = () => {
    const [wallets, setWallets] = useState([]);
    const [transtion, setTranstion] = useState([]);
    const [properties, setProperties] = useState([]);
    // const [selectedPropertyId, setSelectedPropertyId] = useState('');
    // const [selectedProperty, setSelectedProperty] = useState('');
    const [selectedPropertyId, setSelectedPropertyId] = useState(''); // Track property ID
    const [selectedPropertyName, setSelectedPropertyName] = useState('');
    const [requestedCoins, setRequestedCoins] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [requestError, setRequestError] = useState(null);
    const [requestSuccess, setRequestSuccess] = useState(null);
    const [agentId, setAgentId] = useState(null);
    const [selectedSection, setSelectedSection] = useState('redeemCoins');

    // Utility function to check if the token has expired
    const isTokenExpired = (token) => {
        if (!token) return true;
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const { exp } = JSON.parse(jsonPayload);
        const currentTime = Math.floor(Date.now() / 1000);

        return exp < currentTime;
    };

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        const username = localStorage.getItem('username');

        // If token is not found or token is expired, redirect to login
        if (!accessToken || !username || isTokenExpired(accessToken)) {
            location.href = "/login";
        }
    }, []);

    useEffect(() => {
        // Check if window is available (client-side rendering)
        if (typeof window !== 'undefined') {
            const storedAgentId = localStorage.getItem('agentId');
            setAgentId(storedAgentId);
        }
    }, []);

    useEffect(() => {
        const fetchWallets = async () => {
            if (!agentId) return; // Don't fetch if agentId is not available

            try {
                const response = await fetch('https://a.khelogame.xyz/agent/wallet', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                    }
                });
                if (!response.ok) {
                    console.error('Network response status:', response.status, response.statusText);
                    throw new Error(`Network response was not ok: ${response.statusText}`);
                }

                const data = await response.json();
                setWallets(data.wallets || []);  // Handle the case where 'wallets' might not be present
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        const fetchProperties = async () => {
            if (agentId) {
                try {
                    const response = await fetch(`https://a.khelogame.xyz/get-agent-properties?agent_id=${agentId}`, {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                        }
                    });
                    if (!response.ok) {
                        console.error('Network response status:', response.status, response.statusText);
                        throw new Error(`Network response was not ok: ${response.statusText}`);
                    }

                    const data = await response.json();
                    setProperties(data);  // Handle the case where 'properties' might not be present
                    console.log(data)
                } catch (error) {
                    setError(error.message);
                }
            }
        };

        const fetchTranstionHistory = async () => {
            if (!agentId) return; // Don't fetch if agentId is not available

            try {
                const response = await fetch('https://a.khelogame.xyz/agent/wallet-history', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                    }
                });
                if (!response.ok) {
                    console.error('Network response status:', response.status, response.statusText);
                    throw new Error(`Network response was not ok: ${response.statusText}`);
                }

                const data = await response.json();
                setTranstion(data.transactions || []);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchWallets();
        fetchProperties();
        fetchTranstionHistory();
    }, [agentId]);

    const handleSectionChange = (event) => {
        setSelectedSection(event.target.value);
    };

    const handleRequestSubmit = async (e) => {
        e.preventDefault();
        setRequestSuccess(null);
        setRequestError(null);

        try {
            const response = await fetch('https://a.khelogame.xyz/agent/request-coin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                },
                body: JSON.stringify({
                    property_id: selectedPropertyId, // Pass property ID
                    property_name: selectedPropertyName, // Pass property name
                    coins: parseInt(requestedCoins, 10)
                })
            });

            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }

            const data = await response.json();
            setRequestSuccess(data.message || 'Coin request submitted successfully');
            toast.success('Coin Request Submitted Successfully!');
        } catch (error) {
            setRequestError(error.message);
            toast.error(error.message);
        }
    };

    const handlePropertyChange = (e) => {
        const selectedOption = e.target.options[e.target.selectedIndex];
        setSelectedPropertyId(selectedOption.value);
        setSelectedPropertyName(selectedOption.text);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <>
            <Navbar />
            <ToastContainer />
            <section className={styles.dashboard_main_box}>
                <h2>Total Wallet Coins</h2>
                <div className={styles.coins_big_box}>
                    <Image width={40} height={40} src="/images/coin-img.png" alt='' />
                    {wallets.length > 0 && (
                        <h3>{wallets[0].total_coins}</h3>
                    )}
                    <p>Total Coins</p>
                </div>

                <div className={styles.radioInput}>
                    <label>
                        <input
                            value="redeemCoins"
                            name="value-radio"
                            type="radio"
                            checked={selectedSection === 'redeemCoins'}
                            onChange={handleSectionChange}
                        />
                        <span>Redeem Coins</span>
                    </label>
                    <label>
                        <input
                            value="transactionHistory"
                            name="value-radio"
                            type="radio"
                            checked={selectedSection === 'transactionHistory'}
                            onChange={handleSectionChange}
                        />
                        <span>Transaction History</span>
                    </label>
                    <span className={styles.selection}></span>
                </div>

                {selectedSection === 'redeemCoins' && (
                    <>
                        <h3 className={styles.h3text}>Redeem Coins</h3>
                        <form onSubmit={handleRequestSubmit} className={styles.propertyTypeBox}>
                            <label>Select Property</label>

                            <select value={selectedPropertyId} onChange={handlePropertyChange}>
                                <option value="">Select Property Detail</option>
                                {properties.map(property => (
                                    <option key={property.id} value={property.id}>
                                        {property.property_name}
                                    </option>
                                ))}
                            </select>

                            <label> Enter Coins</label>
                            <input type="number" value={requestedCoins} onChange={(e) => setRequestedCoins(e.target.value)} required />
                            <button type="submit" className={styles.submitBtn}>Submit Request</button>
                        </form>
                    </>
                )}

                {selectedSection === 'transactionHistory' && (
                    <>
                        <h3 className={styles.h3text}>Transaction History</h3>
                        <div className={styles.table_big_box}>
                            <table className={styles.customers}>
                                <thead>
                                    <tr>
                                        <th>S No.</th>
                                        <th>Property Name</th>
                                        <th>Requested Coins</th>
                                        <th>Status</th>
                                        <th>Created At</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transtion.length > 0 ? transtion.map((transactions, index) => (
                                        <tr key={transactions.id}>
                                            <td>{index + 1}</td>
                                            <td><Link href={`https://real-estate-gray-zeta.vercel.app/property?id=${transactions.property_id}`} target='_blank' className={styles.link_tag}>
                                                {transactions.property_name}
                                            </Link>
                                            </td>
                                            <td>{transactions.requested_coins}</td>
                                            <td>{transactions.status}</td>
                                            <td>{new Date(transactions.created_at).toLocaleString()}</td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="6">No Data Available</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </section>
        </>
    );
};

export default RedeemCoins;
