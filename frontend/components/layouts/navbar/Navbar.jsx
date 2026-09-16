'use client'
import React, { useEffect, useState } from 'react'
import styles from './styles.module.css'
import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from "next/navigation";
import { reset } from '@/config/redux/reducer/authReducer'
import Image from 'next/image'
import { getUserProfileData } from '@/config/redux/action/authAction'
export const Navbar = () => {
  const {token,username} = useSelector((state)=>state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  useEffect(()=>{
    if (token) {
    dispatch(getUserProfileData(token));
  }
  },[token,dispatch])


  
  async function logoutBtn(){
    localStorage.removeItem('token')
     await dispatch(reset());
     router.push('/')
  }
  return (
     <nav className={styles.navContainer}>
        <div>
     
      <Link href="/" className={styles.brand}>
      <Image src="/TraceFlow.jpeg" alt="TraceFlow logo" width={40} height={40} />

        <span>TraceFlow</span>
      </Link>
      </div>
      {username ? (
  <div className={styles.userArea}>
    <button
      className={styles.profileBtn}
      onClick={() => router.push('/myProfile')}
      aria-label="My Profile" >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4.2 3.6-7 8-7s8 2.8 8 7" />
      </svg>
    </button>

    <span onClick={() => router.push('/myProfile')}>
      Welcome, {username}
    </span>

    <button className={styles.logoutBtn} onClick={logoutBtn}>
      Logout
    </button>
  </div>
) : (

  <div className={styles.navRight}>
    <Link href={'/login'}>login</Link>
    <Link href={'/register'}>Sign up</Link>
  </div>
)}
     </nav>
     
  )
}
