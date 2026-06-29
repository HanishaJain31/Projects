import { NavLink, useParams } from "react-router-dom";
import styles from "./City.module.css";
import { useEffect } from "react";
import { useCities } from "../contexts/CitiesContext";
import { getWeatherLabel, useWeather } from "../hooks/useWeather";
import Spinner from "./Spinner";
import BackButton from "./BackButton";

const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  }).format(new Date(date));

function City() {
  const { id } = useParams()
  const { getCity, currentCity, isLoading } = useCities()
  const { weather, units, isLoadingWeather, weatherError } = useWeather(
    currentCity?.position?.lat,
    currentCity?.position?.lng
  )

  useEffect(function() {
    if (id) getCity(id)
  }, [id, getCity])

  if(isLoading) return <Spinner/>

  if (!currentCity || !currentCity.id) {
    return <div style={{padding:20}}>City not found</div>
  }

  const { cityName, emoji, date, notes } = currentCity;

  return (
    <div className={styles.city}>
      <div className={styles.row}>
        <h6>City name</h6>
        <h3>
          <span>{emoji}</span> {cityName}
        </h3>
      </div>

      <div className={styles.row}>
        <h6>You went to {cityName} on</h6>
        <p>{formatDate(date || null)}</p>
      </div>

      <div className={styles.row}>
        <h6>Current weather</h6>
        <div className={styles.weatherBox}>
          {isLoadingWeather && <p>Loading weather...</p>}
          {weatherError && <p>{weatherError}</p>}
          {weather && (
            <>
              <strong>{getWeatherLabel(weather.weather_code)}</strong>
              <p>
                {weather.temperature_2m}
                {units.temperature_2m || "°C"} · Wind {weather.wind_speed_10m}{" "}
                {units.wind_speed_10m || "km/h"}
              </p>
              <span>
                Humidity {weather.relative_humidity_2m}
                {units.relative_humidity_2m || "%"}
              </span>
            </>
          )}
        </div>
      </div>

      {notes && (
        <div className={styles.row}>
          <h6>Your notes</h6>
          <p>{notes}</p>
        </div>
      )}

      <div className={styles.row}>
        <h6>Learn more</h6>
        <a
          href={`https://en.wikipedia.org/wiki/${cityName}`}
          target="_blank"
          rel="noreferrer"
        >
          Check out {cityName} on Wikipedia &rarr;
        </a>
      </div>

      <div className={styles.actions}>
        <NavLink className={styles.editBtn} to="edit">
          Edit
        </NavLink>
        <BackButton/>
      </div>
    </div>
  );
}

export default City;
