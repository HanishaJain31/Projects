import "react-datepicker/dist/react-datepicker.css";

import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { useNavigate, useParams } from "react-router-dom";
import { useCities } from "../contexts/CitiesContext";
import BackButton from "./BackButton";
import Button from "./Button";
import Message from "./Message";
import Spinner from "./Spinner";
import styles from "./Form.module.css";

export default function EditCityForm() {
  const { id } = useParams();
  const { currentCity, getCity, isLoading } = useCities();

  useEffect(function () {
    if (id) getCity(id);
  }, [id, getCity]);

  if (isLoading || (currentCity?.id && String(currentCity.id) !== String(id))) return <Spinner />;

  if (!currentCity || !currentCity.id) {
    return <Message message="City not found." />;
  }

  return <EditCityFields city={currentCity} />;
}

function EditCityFields({ city }) {
  const navigate = useNavigate();
  const { error, isLoading, updateCity } = useCities();
  const [cityName, setCityName] = useState(city.cityName || "");
  const [country, setCountry] = useState(city.country || "");
  const [emoji, setEmoji] = useState(city.emoji || "");
  const [date, setDate] = useState(city.date ? new Date(city.date) : new Date());
  const [notes, setNotes] = useState(city.notes || "");

  async function handleSubmit(e) {
    e.preventDefault();

    if (!cityName || !country) return;

    try {
      await updateCity(city.id, {
        cityName,
        country,
        emoji,
        date,
        notes,
      });
      navigate(`/app/cities/${city.id}`);
    } catch {
      return;
    }
  }

  return (
    <form className={`${styles.form} ${isLoading ? styles.loading : ""}`} onSubmit={handleSubmit}>
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="country">Country</label>
        <input
          id="country"
          onChange={(e) => setCountry(e.target.value)}
          value={country}
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="emoji">Flag or emoji</label>
        <input
          id="emoji"
          onChange={(e) => setEmoji(e.target.value)}
          value={emoji}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        <DatePicker id="date" onChange={(date) => setDate(date)} selected={date} dateFormat="dd/MM/yyyy" />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      {error && <Message message={error} />}

      <div className={styles.buttons}>
        <Button type="primary">Save</Button>
        <BackButton />
      </div>
    </form>
  );
}
