import React from 'react'
import UserLayout from '../UserLayout/UserLayout'
import styles from './style.module.css'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'

const DashboardLayout = ({children}) => {
  const {id} = useParams();
  const pathname = usePathname();

  const navItems = [
    { label: 'Dashboard', href: `/projectOverview/${id}`},
    { label: 'My Tasks', href: `/my-tasks/${id}`},
    { label: 'Communication', href: `/communication/${id}`},
    { label: 'Decisions', href: `/decision/${id}`}
  ]
  return (
      <UserLayout>
      <div className={styles.DashboardLayouT}>
        <div className={styles.dashboard_leftContainer}>
          {navItems.map((item) => (
            <div
              key={item.href}
              className={`${styles.navItem} ${pathname === item.href ? styles.active : ''}`}
            >
              <Link href={item.href}>{item.label}</Link>
            </div>
          ))}

          <div className={styles.bottom}>Settings</div>
        </div>
        <div className={styles.dashboard_rightContainer}>
          {children}
        </div>
      </div>
    </UserLayout>
  )
}

export default DashboardLayout