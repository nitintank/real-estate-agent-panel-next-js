import Image from "next/image";
import styles from "@/styles/Home.module.css";
import Navbar from "@/components/Navbar";
import { useState, useEffect } from 'react';

export default function Home() {
  const [pendingCount, setPendingCount] = useState(0);
  const [loadingProperties, setLoadingProperties] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profile, setProfile] = useState({});
  const [error, setError] = useState(null);

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
        setPendingCount(data.length);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoadingProperties(false);
      }
    };
    fetchProperties();
  }, []);

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
    const fetchProfile = async () => {
      try {
        const response = await fetch('https://a.khelogame.xyz/agent-profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setProfile(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, []);

  if (loadingProperties || loadingProfile) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <Navbar />
      {/* <!-- Dashboard --> */}
      <section className={styles.dashboard_main_box}>
        <h2>Hey {profile.name},</h2>
        <div className={styles.dashboard_content_cards_big_box}>
          <div className={styles.dashboard_content_cards}>
            <Image width={200} height={200} src="/images/ad-ico-1.png" alt="" />
            <p>Properties for Rent</p>
            <h4>546</h4>
          </div>
          <div className={styles.dashboard_content_cards}>
            <Image width={200} height={200} src="/images/ad-ico-2.png" alt="" />
            <p>Properties for Sale</p>
            <h4>684</h4>
          </div>
          <div className={styles.dashboard_content_cards}>
            <Image width={200} height={200} src="/images/ad-ico-3.png" alt="" />
            <p>Total Customer</p>
            <h4>999</h4>
          </div>
          <div className={styles.dashboard_content_cards}>
            <Image width={200} height={200} src="/images/ad-ico-4.png" alt="" />
            <p>Total City</p>
            <h4>75</h4>
          </div>
        </div>
      </section>
    </>
  );
}