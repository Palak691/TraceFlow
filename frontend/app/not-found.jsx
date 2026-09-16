import Link from 'next/link'
import React from 'react'
import styles from './not-found.module.css'

const NotFound = () => {
  return (
   <div className={styles.notFoundPage}>
      <h1>404</h1>
      <p>This page doesn't exist.</p>
      <Link href="/" className={styles.homeBtn}>Back to Home</Link>
    </div>
  )
}

export default NotFound