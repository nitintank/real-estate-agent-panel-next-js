
import React, { useState, useEffect } from 'react';
import Navbar from "@/components/Navbar";
import styles from "@/styles/AddProperty.module.css";

const AddTransaction = () => {
    const [propertyDetails, setPropertyDetails] = useState([]);
    const [selectedProperty, setSelectedProperty] = useState('');
    const [tncDocumentContract, setTncDocumentContract] = useState(null);
    const [ownersDocument, setOwnersDocument] = useState(null);
    const [paymentCheques, setPaymentCheques] = useState(null);
    const [message, setMessage] = useState('');

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

        const formData = new FormData();
        formData.append('property_detail', selectedProperty);
        formData.append('10nc_document_contract', tncDocumentContract);
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
            setMessage('Transaction created successfully and is pending approval');
            console.log(result);
        } catch (error) {
            console.error('Error creating transaction:', error);
            setMessage('Error creating transaction. Please try again.');
        }
    };

    return (
        <>
            <Navbar />
            <section className={styles.dashboard_main_box}>
                <h2>Transaction Approval</h2>
                <form className={styles.formMainBox} onSubmit={handleSubmit}>
                    <div className={styles.propertyFormBox}>
                        <div className={styles.propertyFormBox}>
                            <select value={selectedProperty} onChange={(e) => setSelectedProperty(e.target.value)}>
                                <option value="">Select Property Detail</option>
                                {propertyDetails.map(property => (
                                    <option key={property.id} value={property.property_name}>{property.property_name}</option>
                                ))}
                            </select>
                        </div>
                        <label>10NC Document Contract</label>
                        <input
                            type="file"
                            onChange={(e) => setTncDocumentContract(e.target.files[0])}
                        />
                        <label>Owner's Document</label>
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
                    <button type="submit" className={styles.submitBtn}>
                        Add Transaction <i className="fa-solid fa-arrow-right"></i>
                    </button>
                </form>
            </section>
        </>
    );
};

export default AddTransaction;
