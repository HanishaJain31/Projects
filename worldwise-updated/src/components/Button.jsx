import React from 'react'
import styles from './Button.module.css'    

export default function Button({children, onClick, type}) {
  return (
    <div>
      <button onClick={onClick} className={`${styles.btn} ${styles[type]}`}>
        {children}
      </button>
    </div>
  )
}
