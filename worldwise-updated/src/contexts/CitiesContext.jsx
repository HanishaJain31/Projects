import { createContext, useCallback, useContext, useEffect, useReducer } from "react";

const BASE_URL = 'http://localhost:5050'

const CitiesContext = createContext()

const initialState = {
    cities: [],
    isLoading: false,
    currentCity: {},
    error: ""
}

function reducer(state, action){
    switch(action.type){
        case 'loading':
            return{
                ...state,
                isLoading: true,
                error: ""
            }
        case 'cities/loaded':
            return {
                ...state,
                isLoading: false,
                cities: action.payload,
                error: ""
            }
        case 'city/loaded':
            return {
                ...state,
                isLoading: false,
                currentCity: action.payload,
                error: ""
            }
        case 'cities/created':
            return {
                ...state,
                isLoading: false,
                cities: [...state.cities, action.payload],
                currentCity: action.payload,
                error: ""
            }
        case 'cities/deleted':
            return {
                ...state,
                isLoading: false,
                cities: state.cities.filter(city => city.id !== action.payload),
                currentCity: {},
                error: ""
            }
        case 'city/updated':
            return {
                ...state,
                isLoading: false,
                cities: state.cities.map(city => city.id === action.payload.id ? action.payload : city),
                currentCity: action.payload,
                error: ""
            }
        case "rejected":
            return{
                ...state,
                isLoading: false,
                error: action.payload
            }
        case 'default':
            throw new Error("Unknown action type")
    }
}

function CitiesProvider({children}){
    const [{cities, isLoading, currentCity, error}, dispatch] = useReducer(reducer, initialState)


    useEffect(function () {
        async function fetchCities() {
            dispatch({type: 'loading'})
            try{
                const res = await fetch(`${BASE_URL}/cities`)
                const data = await res.json()
                dispatch({type: 'cities/loaded', payload: data})
            }
        catch{
            dispatch({type: 'rejected', payload: "Error loading data..."})
        }
        }

        fetchCities()

    }, [])

    const getCity = useCallback(async function getCity(id){
        if(Number(id) === currentCity.id) return;

        dispatch({type: 'loading'})
        try{
            const res = await fetch(`${BASE_URL}/cities/${id}`)
            const data = await res.json()
            dispatch({type: 'city/loaded', payload: data})
        }
        catch{
            dispatch({type: 'rejected', payload: "Error loading city..."})
        }
    }, [currentCity.id])

    async function createCity(newCity){
        dispatch({type: 'loading'})
        try{
            const res = await fetch(`${BASE_URL}/cities`, {
                method: 'POST',
                body: JSON.stringify(newCity),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if (!res.ok) throw new Error("Failed to create city")

            const data = await res.json()
            dispatch({type: 'cities/created', payload: data})
            return data
        }
        catch(error){
            dispatch({type: 'rejected', payload: "Error creating city"})
            throw error
        }
    }

    async function deleteCity(id){
        dispatch({type: 'loading'})
        try{
            await fetch(`${BASE_URL}/cities/${id}`, {
                method: 'DELETE'
            })
            dispatch({type: 'cities/deleted', payload: id})
        }
        catch{
            dispatch({type: 'rejected', payload: "Error deleting city"})
        }
    }

    async function updateCity(id, updatedCity){
        dispatch({type: 'loading'})
        try{
            const res = await fetch(`${BASE_URL}/cities/${id}`, {
                method: 'PATCH',
                body: JSON.stringify(updatedCity),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if (!res.ok) throw new Error("Failed to update city")

            const data = await res.json()
            dispatch({type: 'city/updated', payload: data})
            return data
        }
        catch(error){
            dispatch({type: 'rejected', payload: "Error updating city"})
            throw error
        }
    }

    return(
        <CitiesContext.Provider value={{cities, isLoading, currentCity, getCity, createCity, deleteCity, updateCity, error}}>
            {children}
        </CitiesContext.Provider>
    )
}

function useCities(){
    const context = useContext(CitiesContext)
    if(context === undefined){
        throw new Error('useCities must be used within a CitiesProvider')
    }

    return context
}

export { CitiesProvider, useCities }
