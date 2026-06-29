import { useMemo, useState } from 'react'
import styles from './CityList.module.css'
import Spinner from './Spinner'
import CityItem from './CityItem'
import Message from './Message'
import { useCities } from '../contexts/CitiesContext'

export default function CityList() {
  const [query, setQuery] = useState('')
  const [selectedCountry, setSelectedCountry] = useState('all')
  const [sortOrder, setSortOrder] = useState('newest')
  const {cities, isLoading} = useCities()

  const countries = useMemo(
    () => [...new Set(cities.map(city => city.country))].sort((a, b) => a.localeCompare(b)),
    [cities]
  )

  const filteredCities = useMemo(() => {
    return cities
      .filter(city => {
        const searchText = `${city.cityName} ${city.country}`.toLowerCase()
        const matchesQuery = searchText.includes(query.trim().toLowerCase())
        const matchesCountry = selectedCountry === 'all' || city.country === selectedCountry

        return matchesQuery && matchesCountry
      })
      .sort((a, b) => {
        const dateA = new Date(a.date)
        const dateB = new Date(b.date)

        return sortOrder === 'newest' ? dateB - dateA : dateA - dateB
      })
  }, [cities, query, selectedCountry, sortOrder])

  if(isLoading){
    return <Spinner />
  }

  if(cities.length === 0){
    return <Message message="Add your first city by clicking on a city on the map"/>
  }
  
  return (
    <div className={styles.listWrapper}>
      <div className={styles.controls}>
        <input
          type="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search city or country..."
          aria-label="Search city or country"
        />

        <select
          value={selectedCountry}
          onChange={e => setSelectedCountry(e.target.value)}
          aria-label="Filter by country"
        >
          <option value="all">All countries</option>
          {countries.map(country => (
            <option value={country} key={country}>{country}</option>
          ))}
        </select>

        <select
          value={sortOrder}
          onChange={e => setSortOrder(e.target.value)}
          aria-label="Sort by trip date"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>
      </div>

      {filteredCities.length === 0 ? (
        <Message message="No cities match your search or filter." />
      ) : (
      <ul className={styles.cityList}>
        {filteredCities.map(city => <CityItem city={city} key={city.id}/>)}
      </ul>
      )}
    </div>
  )
}
