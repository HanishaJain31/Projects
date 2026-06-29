import { useState } from 'react'
import styles from './CityItem.module.css'
import { Link } from 'react-router-dom';
import { useCities } from '../contexts/CitiesContext';

const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));

export default function CityItem({city}) {
    const {currentCity, deleteCity } = useCities()
    const {cityName, emoji, date, id, position } = city;
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)

    function handleDelete(e) {
        e.preventDefault();
        setIsConfirmOpen(true)
    }

    function confirmDelete() {
        deleteCity(id)
    }                

    return (
        <li>
            <Link
                className={`${styles.cityItem} ${id === currentCity?.id ? styles["cityItem--active"] : ''}`}
                to={`${id}${position?.lat !== undefined && position?.lng !== undefined ? `?lat=${position.lat}&lng=${position.lng}` : ''}`}>
                <span className={styles.emoji}>
                    {emoji}
                </span>
                <h3 className={styles.name}>
                    {cityName}
                </h3>
                <time className={styles.date}>
                    ({formatDate(date)})
                </time>
                <button className={styles.deleteBtn} onClick={handleDelete}>
                    &times;
                </button>
            </Link>

            {isConfirmOpen && (
                <div className={styles.overlay} role="presentation">
                    <div
                        className={styles.confirmBox}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby={`delete-city-${id}`}
                    >
                        <h2 id={`delete-city-${id}`}>Delete {cityName}?</h2>
                        <p>This city will be removed from your saved trips.</p>
                        <div className={styles.actions}>
                            <button
                                className={styles.cancelBtn}
                                onClick={() => setIsConfirmOpen(false)}
                            >
                                Cancel
                            </button>
                            <button className={styles.confirmBtn} onClick={confirmDelete}>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </li>
    )
}
