import { NavLink } from "react-router-dom";
import styles from "./Homepage.module.css";
import { PageNav } from "../components/PageNav";

export default function Homepage() {
  return (
    <main className={styles.homepage}>
      <div className={styles.hero}>
        <PageNav />

        <section>
          <h1>
            You travel the world.
            <br />
            WorldWise keeps track of your adventures.
          </h1>
          <h2>
            A world map that tracks your footsteps into every city you can think
            of. Never forget your wonderful experiences, and show your friends
            how you have wandered the world.
          </h2>

          <NavLink to="/app" className="cta">
            Start tracking now
          </NavLink>
        </section>
      </div>

      <section className={styles.story}>
        <div>
          <p>Travel journal</p>
          <h2>Save the places that made the trip worth remembering.</h2>
          <span>
            WorldWise gives every city a place on your map, with trip dates and
            notes close by whenever you want to look back.
          </span>
        </div>
        <img src="img-2.jpg" alt="city skyline from above" />
      </section>

      <section className={styles.features}>
        <article>
          <strong>01</strong>
          <h3>Click the map</h3>
          <p>Choose any point and create a city entry in seconds.</p>
        </article>
        <article>
          <strong>02</strong>
          <h3>Add memories</h3>
          <p>Attach dates and notes so each stop has context.</p>
        </article>
        <article>
          <strong>03</strong>
          <h3>Review progress</h3>
          <p>Track cities, countries, and recent trips from the dashboard.</p>
        </article>
      </section>
    </main>
  );
}
