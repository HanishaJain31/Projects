import styles from './AppNav.module.css'
import { NavLink } from 'react-router-dom'

export default function AppNav() {
  return (
    <div>
      <nav className={styles.nav}>
        <ul>
            <li>
                <NavLink to='dashboard'>Dashboard</NavLink>
            </li>
            <li>
                <NavLink to='cities'>Cities</NavLink>
            </li>
            <li>
                <NavLink to='countries'>Countries</NavLink>
            </li>
        </ul>
      </nav>
    </div>
  )
}
