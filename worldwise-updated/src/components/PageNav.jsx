import { NavLink } from 'react-router-dom'
import  styles from './PageNav.module.css'
import Logo from './Logo'
 
export const PageNav = () => {
  return (
    <nav className={styles.nav}>
        <Logo/>
        <ul>
            <li>
                <NavLink to='/explore'>Explore</NavLink>
            </li>
            <li>
                <NavLink to='/insights'>Insights</NavLink>
            </li>
            <li>
                <NavLink className={styles.ctaLink} to='/login'>Login</NavLink>
            </li>
        </ul>
    </nav>
  )
}
 
