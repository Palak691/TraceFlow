import React from 'react'
import styles from './style.module.css'

const LoadingSpinner = ({message = "Loading..."}) => {
  return (
      <div className={styles.loadingScreen}>
      <div className={styles.spinner} />
      <p>{message}</p>
    </div>
  )
}

export default LoadingSpinner