import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import CityList from './components/CityList'
import CountryList from './components/CountryList'
import City from './components/City'
import Form from './components/Form'
import Dashboard from './components/Dashboard'
import EditCityForm from './components/EditCityForm'
import { CitiesProvider } from './contexts/CitiesContext'
import { AuthProvider } from './contexts/FakeAuthContext'
import ProtectedRoute from './pages/ProtectedRoute'
import SpinnerFullPage from './components/SpinnerFullPage'

const Homepage = lazy(() => import('./pages/Homepage'))
const Explore = lazy(() => import('./pages/Explore'))
const Insights = lazy(() => import('./pages/Insights'))
const PageNotFound = lazy(() => import('./pages/PageNotFound'))
const Login = lazy(() => import('./pages/Login'))
const AppLayout = lazy(() => import('./pages/AppLayout'))

export default function App() {
  

  return (
    <>
    <AuthProvider>
    <CitiesProvider>
      <BrowserRouter>
      <Suspense fallback={<SpinnerFullPage />}>
        <Routes>
          {/* <Route index element={<Homepage/>} /> */}
          <Route path='/' element={<Homepage/>} />
          <Route path='explore' element={<Explore/>} />
          <Route path='insights' element={<Insights/>} />
          <Route path='login' element={<Login/>} />

          <Route path='app' element={
            <ProtectedRoute>
              <AppLayout/>
            </ProtectedRoute>
          }> 
            <Route index element={<Dashboard />} />
            <Route path='dashboard' element={<Dashboard />} />
            <Route path='cities' element={<CityList />}/>

            <Route path='cities/:id' element={<City />} />
            <Route path='cities/:id/edit' element={<EditCityForm />} />
            <Route path='countries' element={<CountryList />}/>
            <Route path='form' element={<Form />}/>
          </Route>

          <Route path='*' element={<PageNotFound/>} />
        </Routes>
      </Suspense>
      </BrowserRouter>
    </CitiesProvider>
    </AuthProvider>
    </>
  )
}
