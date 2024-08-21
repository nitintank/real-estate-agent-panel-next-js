import React, { useEffect, useState } from 'react';
import styles from "@/styles/WalletCoins.module.css";
import Navbar from "@/components/Navbar";
import Image from 'next/image';

const RedeemCoins = () => {
    const [wallets, setWallets] = useState([]);
    const [properties, setProperties] = useState([]);
    const [selectedProperty, setSelectedProperty] = useState('');
    const [requestedCoins, setRequestedCoins] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [requestError, setRequestError] = useState(null);
    const [requestSuccess, setRequestSuccess] = useState(null);
    const [agentId, setAgentId] = useState(null);

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
                    setProperties(data || []);  // Handle the case where 'properties' might not be present
                } catch (error) {
                    setError(error.message);
                }
            }
        };

        fetchWallets();
        fetchProperties();
    }, [agentId]);

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
                    property_name: selectedProperty,
                    coins: parseInt(requestedCoins, 10)
                })
            });

            if (!response.ok) {
                console.error('Network response status:', response.status, response.statusText);
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }

            const data = await response.json();
            setRequestSuccess(data.message || 'Coin request submitted successfully');
        } catch (error) {
            setRequestError(error.message);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <>
            <Navbar />
            <section className={styles.dashboard_main_box}>
                <h2>Wallet Coins</h2>
                <div className={styles.coins_big_box}>
                    <Image width={50} height={50} src="/images/coin-img.png" alt='' />
                    {wallets.length > 0 && (
                        <h3>{wallets[0].total_coins}</h3>
                    )}
                    <p>Total Coins</p>
                </div>

                <h3>Redeem Coins</h3>
                <form onSubmit={handleRequestSubmit} className={styles.propertyTypeBox}>
                    <label>Select Property</label>
                    <select value={selectedProperty} onChange={(e) => setSelectedProperty(e.target.value)} required>
                        <option value="">Select a Property</option>
                        {properties.map(property => (
                            <option key={property.id} value={property.property_name}>{property.property_name}</option>
                        ))}
                    </select>
                    <label> Enter Coins</label>
                    <input type="number" value={requestedCoins} onChange={(e) => setRequestedCoins(e.target.value)} required />
                    <button type="submit" className={styles.submitBtn}>Submit Request</button>
                </form>

            </section>
        </>
    );
};

export default RedeemCoins;
