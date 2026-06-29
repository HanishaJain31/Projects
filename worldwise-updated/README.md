# WorldWise

WorldWise is a React travel tracking app for saving the cities you have visited, viewing them on an interactive map, and reviewing your travel history through lists, dashboards, and insights.

## Features

- Interactive map for adding and viewing visited cities
- City details with travel dates and notes
- Country list generated from saved cities
- Dashboard summary for saved trips
- Insights page with travel statistics and visual breakdowns
- Protected app area with a simple demo authentication flow
- Local JSON server for city data during development

## Tech Stack

- React
- Vite
- React Router
- React Leaflet and Leaflet
- JSON Server
- jsPDF and jsPDF AutoTable
- ESLint

## Getting Started

Install dependencies:

```bash
npm install
```

Start the JSON server:

```bash
npm run server
```

In another terminal, start the development server:

```bash
npm run dev
```

Open the local Vite URL shown in the terminal.

## Available Scripts

```bash
npm run dev
npm run build
npm run lint
npm run preview
npm run server
```

## Project Structure

```text
src/
  components/   Reusable UI and app components
  contexts/     Cities and authentication context providers
  data/         Local city data for JSON server
  hooks/        Custom location and URL hooks
  pages/        Route-level pages
  utils/        Export and helper utilities
```

## Notes

The app uses `src/data/cities.json` as the local development data source. Keep `npm run server` running while using city create, update, or delete features.
