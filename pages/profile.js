import React, { useEffect, useState } from 'react';
import Navbar from "@/components/Navbar";
import styles from "@/styles/Profile.module.css";

const profile = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [officePhoneNumber, setOfficePhoneNumber] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
    const [imagePath, setImagePath] = useState('');
    const [profileSuccessMessage, setProfileSuccessMessage] = useState('');

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        fetchProfileData();
    }, []);

    const fetchProfileData = async () => {
        try {
            const response = await fetch('https://a.khelogame.xyz/agent-profile', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch profile data');
            }
            const profileData = await response.json();
            setUsername(profileData.name);
            setEmail(profileData.email);
            setPhoneNumber(profileData.phone_number);
            setAddress(profileData.address);
            setOfficePhoneNumber(profileData.office_phone_number);
            setImagePath(profileData.image_path);
        } catch (error) {
            console.error('Error fetching profile data:', error.message);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const formData = new FormData();
            formData.append('name', username);
            formData.append('email', email);
            formData.append('phone_number', phoneNumber);
            formData.append('address', address);
            formData.append('office_phone_number', officePhoneNumber);
            if (profilePicture) {
                formData.append('profile_picture', profilePicture);
            }

            const response = await fetch('https://a.khelogame.xyz/edit-agent-profile', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                },
                body: formData
            });
            if (!response.ok) {
                throw new Error('Failed to update profile');
            }
            const responseData = await response.json();
            console.log('Profile updated successfully:', responseData);
            setImagePath(responseData.agent.image_path); // Update image path with the new one if changed
            setProfileSuccessMessage(responseData.message);
        } catch (error) {
            console.error('Error updating profile:', error.message);
        }
    };

    const handleFileChange = (e) => {
        setProfilePicture(e.target.files[0]);
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (!oldPassword || !newPassword || !confirmPassword) {
            setError('All fields are required');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('New password and confirm password must match');
            return;
        }

        try {
            const response = await fetch('https://a.khelogame.xyz/agent-change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                },
                body: JSON.stringify({
                    old_password: oldPassword,
                    new_password: newPassword,
                    confirm_password: confirmPassword
                })
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Failed to change password');
                setSuccessMessage('');
            } else {
                setSuccessMessage(data.message);
                setOldPassword('');
                setNewPassword('');
                setConfirmPassword('');
                setError('');
            }
        } catch (error) {
            setError('Failed to change password');
        }
    };

    return (
        <>
            <Navbar />
            {/* <!-- Dashboard --> */}
            <section className={styles.dashboard_main_box}>
                <div className={styles.mainContentBox}>
                    <div className={styles.userProfileBox}>
                        <h2>Profile</h2>
                        <form onSubmit={handleSubmit}>
                            <div className={styles.formInnerBox1}>
                                <div className={styles.profile_img_box}>
                                    {imagePath && (
                                        <div>
                                            <img src={`https://a.khelogame.xyz/${imagePath}`} alt="Profile" width="100" />
                                        </div>
                                    )}
                                    <input type="file" name="profile_picture" onChange={handleFileChange} />
                                </div>
                                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                                <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
                                <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} readOnly />
                                <input type="text" value={officePhoneNumber} onChange={(e) => setOfficePhoneNumber(e.target.value)} />
                                <textarea name="" id="" value={address} onChange={(e) => setAddress(e.target.value)}></textarea>
                            </div>
                            <div className={styles.formInnerBox1}>
                                <button type="submit">Update <i class='bx bx-right-arrow-alt'></i></button>
                            </div>
                            {profileSuccessMessage && <p className={styles.success}>{profileSuccessMessage}</p>}
                        </form>
                    </div>

                    <div className={styles.userProfileBox}>
                        <h2>Change Password</h2>
                        <form onSubmit={handleChangePassword}>
                            <div className={styles.formInnerBox1}>
                                <input type="password" placeholder="Old Password*" value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)} />
                                <input type="password" placeholder="New Password*" value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)} />
                                <input type="password" placeholder="Confirm Password*" value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}/>
                            </div>
                            <div className={styles.formInnerBox1}>
                                <button type="submit">Update <i class='bx bx-right-arrow-alt'></i></button>
                            </div>
                        </form>
                        {error && <p className={styles.error}>{error}</p>}
                        {successMessage && <p className={styles.success}>{successMessage}</p>}
                    </div>
                </div>
            </section>
        </>
    )
}

export default profile