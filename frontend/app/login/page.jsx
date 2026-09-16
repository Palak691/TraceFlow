"use client"
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from "next/navigation"
import styles from './style.module.css'
import { login } from '@/config/redux/action/authAction';
import UserLayout from '@/layouts/UserLayout/UserLayout';
import Link from 'next/link';

const Login = () => {
  const {isError, isLoading, user} = useSelector((state)=>state.auth);
  const router = useRouter();
  const dispatch = useDispatch();
  const [message, setMessage] = useState('');
  const [userDetails, setUserDetails] = useState({
      email : '',
      password : ''
  });
 
   function handleInputChange(e){
    const {name, value} = e.target;
     setUserDetails((prev)=>({
        ...prev , [name] :  value
     }))

  }
   
 async function handleLogin(e){
    e.preventDefault();
    setMessage('');
    const result = await dispatch(login(userDetails));
    if(login.fulfilled.match(result)){
        setMessage('login Successfully');
        setUserDetails({
            email : '',
            password : ''
        });

        router.push('/')
    }else{
        setMessage(result.payload?.message || "Login failed");
    }
      
  }
  return (
    <UserLayout>
     <div className = {styles.cardContainer}>
        <div className={styles.registerCard}>
           
             <h4>LOGIN </h4>
             <div>
            {user ? "" : <p className={styles.para}>
             Don't have an Account?     
             <Link href='/register'>Signup here</Link> 
             </p>}
            </div>
             <form onSubmit={handleLogin}>
             <div className={styles.input}>
            <label htmlFor="email"> Email</label>
            <input type="email" id='email' className={styles.inputField} name="email" value={userDetails.email}
             onChange={handleInputChange} placeholder='abc@gmail.com' required />
            </div>
             <div className={styles.input}>
            <label htmlFor="password">Password</label>
            <input type="password" id='password' name="password" value={userDetails.password}
            className={styles.inputField} onChange={handleInputChange} placeholder='***********' required />
            </div>   
            {message && (
            <p className={isError ? styles.errorMessage : styles.successMessage}>{message} </p>
             )} 
          
           <button type='submit' className={styles.loginBtn} disabled={isLoading}>
            {isLoading ? "Loggin in..": "Login"}
            </button>
                         
            </form>
            </div>
            </div>  
            </UserLayout>
    )
}

export default Login