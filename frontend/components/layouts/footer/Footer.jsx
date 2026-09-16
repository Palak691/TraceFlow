import React from 'react'
import Link from 'next/link'
import styles from './style.module.css'

const Footer = () => {
    const year = new Date().getFullYear()
  return (
     <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.brand}>
          <span className={styles.brandName}>TraceFlow</span>
          <p className={styles.tagline}>Never lose track of what matters.</p>
        </div>

        <div className={styles.links}>
          <Link href="/">Home</Link>
          <Link href="/create-project">Create Project</Link>
          <Link href="/login">Login</Link>
        </div>
      </div>

      <div className={styles.bottomBar}>
        <p>© {year} TraceFlow. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer