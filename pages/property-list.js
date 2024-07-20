import React from 'react'
import styles from "@/styles/PropertyList.module.css";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

const PropertyList = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [amenities, setAmenities] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const userId = localStorage.getItem('userId');
                if (!userId) {
                    throw new Error('User ID not found');
                }
                const response = await fetch(`https://a.khelogame.xyz/get-properties-user/${userId}`);
                if (!response.ok) {
                    console.error('Network response status:', response.status, response.statusText);
                    throw new Error(`Network response was not ok: ${response.statusText}`);
                }

                const data = await response.json();
                setProperties(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProperties();
    }, []);

    const handleEditClick = (propertyId) => {
        router.push(`/edit-property/${propertyId}`);
    };

    const handleDeleteClick = async (propertyId) => {
        try {
            const response = await fetch(`https://a.khelogame.xyz/property/${propertyId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            });

            if (response.ok) {
                setProperties(properties.filter(property => property.id !== propertyId));
                console.log('Property deleted successfully');
            } else {
                const errorData = await response.json();
                console.error('Error:', errorData);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <>
            <Navbar />
            {/* <!-- Dashboard --> */}
            <section className={styles.dashboard_main_box}>
                <h2>Property List</h2>
                <div className={styles.table_big_box}>
                    <table className={styles.customers}>
                        <thead>
                            <tr>
                                <th>Property Name</th>
                                <th>Property Image</th>
                                <th>Property Type</th>
                                <th>Created At</th>
                                <th>Location</th>
                                <th>Price</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {properties.map(property => {
                                return (
                                    <tr key={property.id}>
                                        <td>{property.property_name}</td>
                                        <td>
                                            <Image
                                                width={200}
                                                height={200}
                                                src={property.image_path ? `https://a.khelogame.xyz/${property.image_path}` : '/images/default-property.png'}
                                                alt={property.property_name}
                                                className={styles.property_image_css}
                                            />
                                        </td>
                                        <td>{property.property_type}</td>
                                        <td>{new Date(property.created_at).toLocaleDateString()}</td>
                                        <td>{property.location}</td>
                                        <td>{property.price}</td>
                                        <td>{property.status}</td>
                                        <td>
                                            <i className="bx bx-edit" onClick={() => handleEditClick(property.id)}></i>
                                            <i className="bx bx-trash" onClick={() => handleDeleteClick(property.id)}></i>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </section>
        </>
    )
}

export default PropertyList