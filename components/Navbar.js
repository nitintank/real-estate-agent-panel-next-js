import React, { useState } from "react";
import styles from "@/styles/Navbar.module.css";
import Image from 'next/image';
import Link from "next/link";

const Navbar = () => {
    const [dropdownOpen1, setDropdownOpen1] = useState(true);
    const [dropdownOpen2, setDropdownOpen2] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };
    const toggleDropdown1 = () => {
        setDropdownOpen1(!dropdownOpen1);
    };
    const toggleDropdown2 = () => {
        setDropdownOpen2(!dropdownOpen2);
    };

    const handleLogout = () => {
        localStorage.clear()
        location.href = "/login"
    };

    return (
        <>
            {/* <!-- navbar --> */}
            <nav className={styles.navbar}>
                <div className={styles.logo_item}>
                    <i className={`bx bx-menu ${styles.tri_arrow}`} onClick={toggleSidebar}></i>
                    <Link href="/"><Image width={200} height={200} src="/images/logo.png" alt="" /></Link>
                </div>

                <div className={styles.navbar_content}>
                    <Link href="/profile"><Image width={200} height={200} src="/images/profile.jpg" alt="" className={styles.profile} /></Link>
                    <button className={styles.logout_btn} onClick={handleLogout}><i class='bx bx-log-out'></i> Log Out</button>
                </div>
            </nav>

            {/* <!-- sidebar --> */}
            <nav className={`${styles.sidebar} ${sidebarOpen ? "" : styles.close}`}>
                <div className={styles.menu_content}>
                    <ul className={styles.menu_items}>
                        {/* <!-- start --> */}
                        <li className={styles.item}>
                            <Link href="/" className={styles.nav_link}>
                                <span className={styles.navlink_icon}>
                                    <i className="bx bxs-dashboard"></i>
                                </span>
                                <span className={styles.navlink}>Dashboard</span>
                            </Link>
                        </li>
                        {/* <!-- end --> */}
                    </ul>

                    <ul className={styles.menu_items}>
                        {/* <!-- Start --> */}
                        <li className={styles.item}>
                            <Link href="/add-property" className={styles.nav_link}>
                                <span className={styles.navlink_icon}>
                                    <i class='bx bxs-add-to-queue'></i>
                                </span>
                                <span className={styles.navlink}>Add Property</span>
                            </Link>
                        </li>
                        {/* <!-- End --> */}
                        {/* <!-- Start --> */}
                        <li className={styles.item}>
                            <Link href="/property-list" className={styles.nav_link}>
                                <span className={styles.navlink_icon}>
                                    <i className='bx bx-building-house'></i>
                                </span>
                                <span className={styles.navlink}>Property List</span>
                            </Link>
                        </li>
                        {/* <!-- End --> */}
                        <li className={styles.item}>
                            <Link href="/enquiries" className={styles.nav_link}>
                                <span className={styles.navlink_icon}>
                                    <i className='bx bxs-book-content'></i>
                                </span>
                                <span className={styles.navlink}>Enquiries</span>
                            </Link>
                        </li>
                        <li className={styles.item}>
                            <Link href="/profile" className={styles.nav_link}>
                                <span className={styles.navlink_icon}>
                                    <i class='bx bxs-user-circle'></i>
                                </span>
                                <span className={styles.navlink}>Profile</span>
                            </Link>
                        </li>
                    </ul>
                </div>
            </nav>
        </>
    )
}

export default Navbar