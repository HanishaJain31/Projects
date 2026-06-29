import React from 'react'
import styles from './AppLayout.module.css'
import Sidebar from '../components/Sidebar'
import Map from '../components/Map'
import User from '../components/User'
import ProtectedRoute from './ProtectedRoute'

export default function AppLayout() {
  return (
    <div className={styles.app}>
      <ProtectedRoute>
        <Sidebar />
        <Map />
        <User />
      </ProtectedRoute>
    </div>
  )
}
