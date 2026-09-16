"use client"
import React, { useState } from 'react'
import styles from './style.module.css'
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from "next/navigation";
import UserLayout from '@/layouts/UserLayout/UserLayout';
import { register } from '@/config/redux/action/authAction';
import Link from 'next/link';

const Register = () => {
  const {isLoading, isError} = useSelector((state)=>state.auth); 
  const router = useRouter();
  const dispatch = useDispatch();
  const [message, setMessage] = useState('');
  const [userDetails, setUserDetails] = useState({
    name : '',
    email : '',
    password : ''
  });
 function handleInputChange(e){
    const {name, value} = e.target;
     setUserDetails((prev)=>({
        ...prev , [name] :  value
     }));

  }
   

  async function handleSignup(e){
  e.preventDefault();
  setMessage('');
    const result = await dispatch(register(userDetails));
    if(register.fulfilled.match(result)){
       setMessage("Registered SuccessFully")
        setUserDetails({
            name : '',
            email : '',
            password : ''
        });
        setTimeout(() => {
 router.push("/login");
}, 1000);
    }else{
        setMessage(result?.payload?.message || "Signup failed")
    } 

  }
  return (
    <UserLayout>
   <div className = {styles.cardContainer}>
        <div className={styles.registerCard}>
    
        <h4>REGISTER</h4>
       <div>
        <p className={styles.para}>Already have an Account? 
        <Link href={'/login'} > Login here.</Link>
        </p>
    </div>

<form onSubmit={handleSignup}>

  <div className={styles.input}>
    <label htmlFor="name">Name</label>

    <input type="text" id="name" className={styles.inputField} name="name"
      value={userDetails.name}  onChange={handleInputChange}  placeholder="name"  required/>
  </div>

  <div className={styles.input}>
    <label htmlFor="email">Email</label>
    <input
      type="email"  id="email"  className={styles.inputField}  name="email"  value={userDetails.email}
      onChange={handleInputChange}  placeholder="abc@gmail.com"  required/>
  </div>

  <div className={styles.input}>
    <label htmlFor="password">Password</label>
    <input type="password" id="password" name="password"
      value={userDetails.password} className={styles.inputField} onChange={handleInputChange}
      placeholder="***********" required/>
  </div>
  {message && (
    <p className={isError ? styles.errorMessage : styles.successMessage}>
      {message}
    </p>
  )}
  <button className={styles.loginBtn}  type="submit"  disabled={isLoading}>
    {isLoading ? "Signing up..." : "Signup"}
  </button>
</form>
           
 </div>
</div>  
 </UserLayout>
  )
}

export default Register