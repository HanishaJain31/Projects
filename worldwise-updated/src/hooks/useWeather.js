import { useEffect, useReducer } from "react";

const initialState = {
  weather: null,
  units: {},
  isLoadingWeather: false,
  weatherError: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return {
        ...state,
        isLoadingWeather: true,
        weatherError: "",
      };
    case "weather/loaded":
      return {
        ...state,
        isLoadingWeather: false,
        weather: action.payload.weather,
        units: action.payload.units,
        weatherError: "",
      };
    case "weather/rejected":
      return {
        ...state,
        isLoadingWeather: false,
        weather: null,
        weatherError: action.payload,
      };
    default:
      throw new Error("Unknown weather action");
  }
}

export function getWeatherLabel(code) {
  if (code === 0) return "Clear sky";
  if ([1, 2, 3].includes(code)) return "Partly cloudy";
  if ([45, 48].includes(code)) return "Foggy";
  if ([51, 53, 55, 56, 57].includes(code)) return "Drizzle";
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "Rain";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "Snow";
  if ([95, 96, 99].includes(code)) return "Thunderstorm";

  return "Weather update";
}

export function useWeather(lat, lng) {
  const [{ weather, units, isLoadingWeather, weatherError }, dispatch] =
    useReducer(reducer, initialState);

  useEffect(
    function () {
      if (lat == null || lng == null) return;

      const controller = new AbortController();

      async function fetchWeather() {
        dispatch({ type: "loading" });

        try {
          const res = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m`,
            { signal: controller.signal }
          );

          if (!res.ok) throw new Error("Could not load weather");

          const data = await res.json();

          dispatch({
            type: "weather/loaded",
            payload: {
              weather: data.current,
              units: data.current_units || {},
            },
          });
        } catch (error) {
          if (error.name === "AbortError") return;

          dispatch({
            type: "weather/rejected",
            payload: "Weather unavailable right now.",
          });
        }
      }

      fetchWeather();

      return function () {
        controller.abort();
      };
    },
    [lat, lng]
  );

  return { weather, units, isLoadingWeather, weatherError };
}
