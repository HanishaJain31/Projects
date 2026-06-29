import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import AppLayout from './ui/AppLayout'
import JobList from './pages/user/JobList'
import JobDetails from './pages/user/JobDetails'
import ApplyJob from './pages/user/ApplyJob'
import MyApplications from './pages/user/MyApplications'
import UserProfile from './pages/UserProfile'
import Signup from './pages/user/Signup'
import Login from './pages/Login'
import AdminDashboard from './pages/admin/AdminDashboard'
import UserDashboard from './pages/user/UserDashboard'
import { ThemeProvider } from 'styled-components'
import GlobalStyles from './styles/GlobalStyles'
import ThemeProviderCustom from './context/ThemeContext'
import useTheme from './context/useTheme'
import { darkTheme, lightTheme } from './styles/theme'
import AdminHomePage from './pages/admin/AdminHomePage'
import UserActions from './pages/admin/UserActions'
import JobActions from './pages/admin/JobActions'
import ApplicationActions from './pages/admin/ApplicationActions'
import ProtectedRoute from './ui/ProtectedRoute'

function ThemedApp() {
  const {darkMode} = useTheme();
  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <GlobalStyles />
      <RouterProvider router={router} />
      <Toaster position='top-right' reverseOrder={false} />
    </ThemeProvider>
  )
}


const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: '/',
        element: <JobList />
      },
      {
        path: '/job/:id',
        element: <JobDetails />
      },
      {
        path: '/apply-job/:id',
        element: (
          <ProtectedRoute allowedRoles={['user']}>
            <ApplyJob />
          </ProtectedRoute>
        )
      },
      {
        path: '/my-applications',
        element: (
          <ProtectedRoute allowedRoles={['user']}>
            <MyApplications />
          </ProtectedRoute>
        )
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        )
      },
      {
        path: '/signup',
        element: <Signup />
      },
      {
        path: '/login',
        element: <Login />
      },
      {
        path: '/user',
        element: (
          <ProtectedRoute allowedRoles={['user']}>
            <UserDashboard />
          </ProtectedRoute>
        )
      },
      {
        path: '/admin',
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        )
      },
      {
        path: '/admin/home',
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminHomePage />
          </ProtectedRoute>
        )
      },
      {
        path: '/admin/users',
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <UserActions />
          </ProtectedRoute>
        )
      },
      {
        path: '/admin/jobs',
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <JobActions />
          </ProtectedRoute>
        )
      },
      {
        path: '/admin/applications',
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <ApplicationActions />
          </ProtectedRoute>
        )
      }
    ]
  }

])

export default function App() {
  return (
    <>
    <ThemeProviderCustom>
      <ThemedApp />
    </ThemeProviderCustom>
    </>
  )
}
