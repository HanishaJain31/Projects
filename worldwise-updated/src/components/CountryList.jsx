import { useState } from 'react'
import React from 'react'
import Spinner from './Spinner'
import Message from './Message'
import styles from './CountryList.module.css'
import CountryItem from './CountryItem'
import { useCities } from '../contexts/CitiesContext'

export default function CountryList() {
  const {cities, isLoading} = useCities()
  
  if(isLoading){
    return <Spinner />
  }

  if(cities.length === 0){
    return <Message message="Add your first city by clicking on a city on the map"/>
  }

  const countries = cities.reduce((acc, city) => {
    if(!acc.map(el => el.country).includes(city.country)){
      return [...acc, {country: city.country, emoji: city.emoji}]
    }
    else{
      return acc
    }
  }, [])

  return (
    <div>
      <ul className={styles.countryList}>
        {countries.map(country => <CountryItem country={country} key={country.country}/>)}
      </ul>
    </div>
  )
}
