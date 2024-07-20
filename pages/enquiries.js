import React, { useEffect, useState } from 'react';
import Navbar from "@/components/Navbar";
import styles from "@/styles/PropertyList.module.css";

const Enquiries = () => {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchInquiries = async () => {
            try {
                const response = await fetch('https://a.khelogame.xyz/agent-inquiries', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setInquiries(data.inquiries);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchInquiries();
    }, []);

    return (
        <>
            <Navbar />
            {/* <!-- Dashboard --> */}
            <section className={styles.dashboard_main_box}>
                <h2>Enquiries</h2>
                <div className={styles.table_big_box}>
                    {loading ? (
                        <p>Loading...</p>
                    ) : error ? (
                        <p>Error: {error}</p>
                    ) : (
                        <table className={styles.customers}>
                            <thead>
                                <tr>
                                    <th>S NO.</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone Number</th>
                                    <th>Message</th>
                                    <th>Created At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {inquiries.map((inquiry, index) => (
                                    <tr key={inquiry.id}>
                                        <td>{index + 1}</td>
                                        <td>{inquiry.name}</td>
                                        <td>{inquiry.email}</td>
                                        <td>{inquiry.phone}</td>
                                        <td>{inquiry.message}</td>
                                        <td>{inquiry.created_at}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </section>
        </>
    )
}

export default Enquiries