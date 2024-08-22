import React, { useState, useEffect } from 'react';
import Navbar from "@/components/Navbar";
import styles from "@/styles/TransactionApproval.module.css";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddTransaction = () => {
    const [propertyDetails, setPropertyDetails] = useState([]);
    const [selectedPropertyId, setSelectedPropertyId] = useState('');
    const [selectedPropertyName, setSelectedPropertyName] = useState('');
    const [tncDocumentContract, setTncDocumentContract] = useState(null);
    const [ownersDocument, setOwnersDocument] = useState(null);
    const [paymentCheques, setPaymentCheques] = useState(null);
    const [loading, setLoading] = useState(false); // Loading state

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
        const fetchProperties = async () => {
            try {
                const agentId = localStorage.getItem('agentId');
                if (!agentId) {
                    throw new Error('Agent ID not found');
                }
                const response = await fetch(`https://a.khelogame.xyz/get-agent-properties?agent_id=${agentId}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                setPropertyDetails(data);
            } catch (error) {
                console.error('Error fetching properties:', error);
            }
        };

        fetchProperties();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Start loading

        const formData = new FormData();
        formData.append('property_id', selectedPropertyId);
        formData.append('property_detail', selectedPropertyName);
        formData.append('tnc_document_contract', tncDocumentContract);
        formData.append('owners_document', ownersDocument);
        formData.append('payment_cheques', paymentCheques);

        try {
            const response = await fetch('https://a.khelogame.xyz/agent/transaction', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            toast.success('Transaction Created Successfully and Is Pending Approval!');
        } catch (error) {
            toast.error(`Error Creating Transaction, Please Try Again.`);
        } finally {
            setLoading(false);
        }
    };

    const handlePropertyChange = (e) => {
        const selectedOption = e.target.options[e.target.selectedIndex];
        setSelectedPropertyId(selectedOption.value);
        setSelectedPropertyName(selectedOption.text);
    };

    return (
        <>
            <Navbar />
            <ToastContainer />
            <section className={styles.dashboard_main_box}>
                <h2>Transaction Approval</h2>
                <form className={styles.formMainBox} onSubmit={handleSubmit}>
                    <div className={styles.propertyFormBox}>
                        <select value={selectedPropertyId} onChange={handlePropertyChange}>
                            <option value="">Select Property Detail</option>
                            {propertyDetails.map(property => (
                                <option key={property.id} value={property.id}>
                                    {property.property_name}
                                </option>
                            ))}
                        </select>
                        <label>10NC Document Contract</label>
                        <input
                            type="file"
                            onChange={(e) => setTncDocumentContract(e.target.files[0])}
                        />
                        <label>{`Owner's Document`}</label>
                        <input
                            type="file"
                            onChange={(e) => setOwnersDocument(e.target.files[0])}
                        />
                        <label>Payment Cheques</label>
                        <input
                            type="file"
                            onChange={(e) => setPaymentCheques(e.target.files[0])}
                        />
                    </div>
                    <button type="submit" className={styles.submitBtn} disabled={loading}>
                        {loading ? 'Submitting...' : 'Add Transaction'} <i className='bx bxs-right-arrow-circle'></i>
                    </button>
                </form>
            </section>
        </>
    );
};

export default AddTransaction;