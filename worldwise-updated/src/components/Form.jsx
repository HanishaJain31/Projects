// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"
import "react-datepicker/dist/react-datepicker.css"

import { useEffect, useState } from "react";

import styles from "./Form.module.css";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import BackButton from "./BackButton";
import useUrlPosition from "../hooks/useUrlPosition";
import Message from "./Message";
import Spinner from "./Spinner";
import DatePicker from "react-datepicker";
import { useCities } from "../contexts/CitiesContext";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

function Form() {
  const navigate = useNavigate();

  const {createCity, isLoading, error } = useCities()
  
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [emoji, setEmoji] = useState("")
  const [geoCodingError, setGeocodingError] = useState(null); 

    const [lat, lng] = useUrlPosition(); 
    const [isLoadingGeocoding, setIsLoadingGeocoding] = useState(false);

    useEffect(function () {
      if (!lat || !lng) return;

      async function fetchCityData() {
        try{
          setIsLoadingGeocoding(true);
          setGeocodingError(null);
          const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}`)
          const data = await response.json();

          if(!data.countryCode){
            throw new Error("No country found for the given coordinates.")
          }
          setCityName(data.city || data.locality || data.principalSubdivision || '')
          setCountry(data.countryName)
          setEmoji(convertToEmoji(data.countryCode))
        }
        catch(error){
          setGeocodingError(error.message)
        }
        finally{
          setIsLoadingGeocoding(false);
        }
      }

      fetchCityData();
    }, [lat, lng])

    if(isLoadingGeocoding){
      return <Spinner />
    }

    if(!lat && !lng){
      return <Message message="Start by clicking on the map." />
    }

    if(geoCodingError){
      return <Message message={geoCodingError} />
    }

    async function handleSubmit(e) {
      e.preventDefault();
      
      if (!cityName || !country) return;

      const cityData = {
        cityName,
        country,
        emoji,
        date,
        notes,
        position: {
          lat: Number(lat),
          lng: Number(lng)
        } 
      }

      try {
        await createCity(cityData)
        navigate("/app/cities")
      } catch {
        return
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
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        {/* <input
          id="date"
          onChange={(e) => setDate(e.target.value)}
          value={date}
        /> */}
        <DatePicker id="date" onChange={(date) => setDate(date)} selected={date} dateFormat="dd/MM/yyyy"/>
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
        <Button type='primary'>Add</Button>
        <BackButton />
      </div>
    </form>
  );

}

export default Form;
