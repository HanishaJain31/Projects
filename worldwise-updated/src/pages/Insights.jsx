import { NavLink } from "react-router-dom";
import { PageNav } from "../components/PageNav";
import { useCities } from "../contexts/CitiesContext";
import styles from "./FeaturePages.module.css";

function formatDate(date) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

function getChartData(items, getLabel) {
  const counts = items.reduce((acc, item) => {
    const label = getLabel(item);
    if (!label) return acc;

    acc[label] = (acc[label] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value || a.label.localeCompare(b.label));
}

function ChartPanel({ title, data }) {
  const maxValue = Math.max(...data.map((item) => item.value), 1);

  return (
    <article className={styles.chartPanel}>
      <h2>{title}</h2>

      {data.length > 0 ? (
        <div className={styles.chart}>
          {data.map((item) => (
            <div className={styles.barRow} key={item.label}>
              <span className={styles.barLabel}>{item.label}</span>
              <div className={styles.barTrack}>
                <div
                  className={styles.barFill}
                  style={{ width: `${(item.value / maxValue) * 100}%` }}
                />
              </div>
              <strong>{item.value}</strong>
            </div>
          ))}
        </div>
      ) : (
        <p>No chart data yet. Save a city to begin.</p>
      )}
    </article>
  );
}

export default function Insights() {
  const { cities } = useCities();
  const countries = new Set(cities.map((city) => city.country));
  const citiesWithNotes = cities.filter((city) => city.notes?.trim()).length;
  const latestCity = [...cities].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  )[0];

  const stats = [
    { label: "Cities saved", value: cities.length },
    { label: "Countries visited", value: countries.size },
    { label: "Trips with notes", value: citiesWithNotes },
  ];
  const topCountries = [...countries].slice(0, 6);
  const countryChartData = getChartData(cities, (city) => city.country);
  const yearChartData = getChartData(cities, (city) =>
    new Date(city.date).getFullYear().toString()
  ).sort((a, b) => b.label.localeCompare(a.label));

  return (
    <main className={styles.page}>
      <PageNav />

      <section className={styles.hero}>
        <div>
          <p className={styles.kicker}>Travel insights</p>
          <h1>Your journey, summarized in one place.</h1>
          <p>
            Track how your travel list is growing and jump back into the app
            whenever you want to add the next stop.
          </p>
          <NavLink to="/app/cities" className="cta">
            View saved cities
          </NavLink>
        </div>

        <div className={styles.statsPanel}>
          {stats.map((stat) => (
            <article className={styles.stat} key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.summary}>
        <h2>Latest saved trip</h2>
        {latestCity ? (
          <p>
            {latestCity.emoji} {latestCity.cityName}, {latestCity.country} was
            saved for {formatDate(latestCity.date)}.
          </p>
        ) : (
          <p>No trips yet. Open the map and save your first city.</p>
        )}
      </section>

      <section className={styles.split}>
        <div>
          <p className={styles.kicker}>Country coverage</p>
          <h2>See where your travel story is growing.</h2>
          <p>
            Use this section as a quick snapshot of the countries already in
            your collection.
          </p>
        </div>

        <div className={styles.countryCloud}>
          {topCountries.length > 0 ? (
            topCountries.map((country) => <span key={country}>{country}</span>)
          ) : (
            <p>No countries saved yet.</p>
          )}
        </div>
      </section>

      <section className={styles.chartsSection}>
        <div className={styles.sectionIntro}>
          <p className={styles.kicker}>Visual breakdown</p>
          <h2>Understand your saved travel data at a glance.</h2>
        </div>

        <div className={styles.chartGrid}>
          <ChartPanel title="Cities per country" data={countryChartData} />
          <ChartPanel title="Trips per year" data={yearChartData} />
        </div>
      </section>

      <section className={styles.banner}>
        <h2>Every trip adds more useful insight.</h2>
        <NavLink to="/app" className="cta">
          Continue tracking
        </NavLink>
      </section>
    </main>
  );
}
