import React, { useState } from 'react';
import styles from "@/styles/Login.module.css";
import Image from 'next/image';

const Login = () => {
    const [identifier, setIdentifier] = useState('')
    const [password, setPassword] = useState('')
    const [invalidLogin, setInvalidLogin] = useState(false)
    const [showpassword, setShowpassword] = useState('password')

    const handleChange = (e) => {
        if (e.target.name == 'identifier') {
            setIdentifier(e.target.value)
        }
        else if (e.target.name == 'password') {
            setPassword(e.target.value)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const data = { identifier, password }
        let res = await fetch('https://a.khelogame.xyz/agent-login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        let response = await res.json()
        if (response.error == "User not found or invalid credentials") {
            setInvalidLogin(true)
        }
        else if (response.role == "agent") {
            localStorage.setItem('email', response.email);
            localStorage.setItem('accessToken', response.access_token);
            localStorage.setItem('username', response.name);
            localStorage.setItem('role', response.role);
            localStorage.setItem('agentId', response.id);
            localStorage.setItem('userId', response.user_id);

            location.href = "/property-list"
        }
    }

    return (
        <>
            <div className={styles.body}>
                <div className={styles.wrapper_2}>
                    <Image src="/images/prop-agent-img.png" width={200} height={200} alt='' />
                </div>
                <div className={styles.wrapper}>
                    <form className={styles.form} method='POST' onSubmit={handleSubmit}>
                        <h2>Agent Login</h2>
                        <div className={styles.input_field}>
                            <input type="text" placeholder="Enter Email or Phone No." name='identifier' value={identifier} onChange={handleChange} required />
                            <label htmlFor="identifier">Enter Email or Phone No.</label>
                        </div>
                        <div className={styles.input_field}>
                            <input type="text" placeholder="Enter Password" name='password' value={password} onChange={handleChange} required />
                            <label htmlFor="password">Enter your password</label>
                        </div>
                        <button type="submit">Login</button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Login