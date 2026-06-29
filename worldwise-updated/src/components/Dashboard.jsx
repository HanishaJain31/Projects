import { NavLink } from "react-router-dom";
import { useCities } from "../contexts/CitiesContext";
import { exportTripsCSV, exportTripsPDF } from "../utils/exportTrips";
import styles from "./Dashboard.module.css";

function formatDate(date) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export default function Dashboard() {
  const { cities } = useCities();
  const countries = [...new Set(cities.map((city) => city.country))];
  const recentCities = [...cities]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 4);
  const citiesWithNotes = cities.filter((city) => city.notes?.trim());

  return (
    <div className={styles.dashboard}>
      <section className={styles.header}>
        <p>Overview</p>
        <h2>Your travel dashboard</h2>
        <span>
          Keep an eye on saved cities, countries, notes, and the next place you
          want to remember.
        </span>
      </section>

      <section className={styles.stats}>
        <article>
          <strong>{cities.length}</strong>
          <span>Cities</span>
        </article>
        <article>
          <strong>{countries.length}</strong>
          <span>Countries</span>
        </article>
        <article>
          <strong>{citiesWithNotes.length}</strong>
          <span>Notes</span>
        </article>
      </section>

      <section className={styles.panel}>
        <div className={styles.panelTitle}>
          <h3>Export trips</h3>
        </div>
        <p className={styles.panelText}>
          Download your saved trips as a spreadsheet-friendly CSV or a simple PDF report.
        </p>
        <div className={styles.exportActions}>
          <button
            type="button"
            onClick={() => exportTripsCSV(cities)}
            disabled={cities.length === 0}
          >
            Export CSV
          </button>
          <button
            type="button"
            onClick={() => exportTripsPDF(cities)}
            disabled={cities.length === 0}
          >
            Export PDF
          </button>
        </div>
      </section>

      <section className={styles.panel}>
        <div className={styles.panelTitle}>
          <h3>Recent cities</h3>
          <NavLink to="/app/cities">View all</NavLink>
        </div>

        {recentCities.length > 0 ? (
          <ul className={styles.recentList}>
            {recentCities.map((city) => (
              <li key={city.id}>
                <span>{city.emoji}</span>
                <div>
                  <strong>{city.cityName}</strong>
                  <small>
                    {city.country} - {formatDate(city.date)}
                  </small>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.empty}>Click the map to save your first city.</p>
        )}
      </section>

      <section className={styles.panel}>
        <div className={styles.panelTitle}>
          <h3>Travel notes</h3>
          <NavLink to="/app/form">Add city</NavLink>
        </div>

        <div className={styles.notes}>
          {citiesWithNotes.slice(0, 3).map((city) => (
            <blockquote key={city.id}>
              <p>{city.notes}</p>
              <cite>
                {city.emoji} {city.cityName}
              </cite>
            </blockquote>
          ))}
          {citiesWithNotes.length === 0 && (
            <p className={styles.empty}>No notes yet. Add memories to your next city.</p>
          )}
        </div>
      </section>

      <section className={styles.panel}>
        <h3>Next improvements</h3>
        <ul className={styles.checklist}>
          <li>Mark favorite destinations</li>
          <li>Add trip photos and ratings</li>
          <li>Filter cities by country or year</li>
          <li>Show weather for selected cities</li>
        </ul>
      </section>
    </div>
  );
}
