import { NavLink } from "react-router-dom";
import { PageNav } from "../components/PageNav";
import styles from "./FeaturePages.module.css";

const features = [
  {
    title: "Interactive travel map",
    text: "Click anywhere on the map to save a city, then revisit every place from one clean view.",
  },
  {
    title: "City memories",
    text: "Store travel dates and notes so each marker becomes more than just a pin.",
  },
  {
    title: "Country collection",
    text: "See the countries you have covered and grow your travel footprint over time.",
  },
  {
    title: "Private trip space",
    text: "Keep your travel dashboard behind login and continue your journey from the app area.",
  },
];

const steps = [
  "Open the travel map and choose a city.",
  "Save the date, notes, and country details.",
  "Return anytime to review your cities and countries.",
];

export default function Explore() {
  return (
    <main className={styles.page}>
      <PageNav />

      <section className={styles.hero}>
        <div>
          <p className={styles.kicker}>Explore smarter</p>
          <h1>Plan, save, and remember every city you visit.</h1>
          <p>
            WorldWise helps you turn a map into a personal travel journal with
            places, notes, dates, and quick country tracking.
          </p>
          <NavLink to="/app" className="cta">
            Open travel map
          </NavLink>
        </div>

        <img src="img-1.jpg" alt="traveler looking across mountains" />
      </section>

      <section className={styles.grid}>
        {features.map((feature) => (
          <article className={styles.card} key={feature.title}>
            <h2>{feature.title}</h2>
            <p>{feature.text}</p>
          </article>
        ))}
      </section>

      <section className={styles.split}>
        <div>
          <p className={styles.kicker}>How it works</p>
          <h2>Build your world map one memory at a time.</h2>
          <p>
            The app is designed around a simple travel habit: choose a location,
            save the moment, and let your map become a living archive.
          </p>
        </div>

        <ol className={styles.steps}>
          {steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>

      <section className={styles.banner}>
        <h2>Ready to save your next destination?</h2>
        <NavLink to="/app/form" className="cta">
          Add a city
        </NavLink>
      </section>
    </main>
  );
}
