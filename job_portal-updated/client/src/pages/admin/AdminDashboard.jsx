import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { FiActivity, FiArchive, FiBriefcase, FiCheckCircle, FiInbox, FiUsers } from 'react-icons/fi'
import { fetchDashboardStats } from '../../features/admin/adminProfileSlice'
import Spinner from '../../ui/Spinner'
import { AdminHero, AdminPage, HeroText } from './AdminStyles'

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (max-width: 680px) {
    grid-template-columns: 1fr;
  }
`

const StatCard = styled.article`
  position: relative;
  overflow: hidden;
  min-height: 170px;
  padding: 20px;
  background: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.text};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  box-shadow: 0 12px 30px rgba(20, 33, 61, 0.06);
  transition: transform .2s ease, border-color .2s ease, box-shadow .2s ease;

  &:before {
    content: "";
    position: absolute;
    inset: 0 0 auto;
    height: 4px;
    background: ${({ $color }) => $color};
  }

  &:hover {
    transform: translateY(-5px);
    border-color: ${({ $color }) => $color};
    box-shadow: ${({ theme }) => theme.shadowStrong};
  }
`

const IconBubble = styled.span`
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  margin-bottom: 18px;
  background: ${({ $color }) => $color}18;
  color: ${({ $color }) => $color};
`

const StatTitle = styled.h2`
  margin: 0 0 8px;
  color: ${({ theme }) => theme.mutedText};
  font-size: 14px;
  font-weight: 500;
`

const StatValue = styled.p`
  margin: 0;
  font-size: 38px;
  font-weight: 400;
  line-height: 1;
`

const ErrorText = styled.p`
  color: ${({ theme }) => theme.danger};
  margin-top: 16px;
`

export default function AdminDashboard() {
  const dispatch = useDispatch()
  const { dashboardStats, isLoading, error } = useSelector((state) => state.adminProfile)
  const { token } = useSelector((state) => state.auth)
  const authToken = token || localStorage.getItem('token')

  useEffect(() => {
    if (authToken) {
      dispatch(fetchDashboardStats())
    }
  }, [authToken, dispatch])

  const stats = [
    { label: 'Total Jobs', value: dashboardStats.total_jobs ?? 0, color: '#0f8b8d', icon: <FiBriefcase /> },
    { label: 'Active Jobs', value: dashboardStats.active_jobs ?? 0, color: '#129e63', icon: <FiCheckCircle /> },
    { label: 'Closed Jobs', value: dashboardStats.closed_jobs ?? 0, color: '#d92d20', icon: <FiArchive /> },
    { label: 'Applications', value: dashboardStats.total_application ?? 0, color: '#f59f00', icon: <FiInbox /> },
    { label: 'Users', value: dashboardStats.total_users ?? 0, color: '#2563eb', icon: <FiUsers /> },
  ]

  return (
    <AdminPage>
      <AdminHero>
        <HeroText>
          <span><FiActivity /> Admin Overview</span>
          <h1>Command center</h1>
          <p>Monitor hiring activity, job health, applications, and user growth from one place.</p>
        </HeroText>
      </AdminHero>

      {isLoading && <Spinner />}

      {!isLoading && (
        <StatsGrid>
          {stats.map((stat) => (
            <StatCard key={stat.label} $color={stat.color}>
              <IconBubble $color={stat.color}>{stat.icon}</IconBubble>
              <StatTitle>{stat.label}</StatTitle>
              <StatValue>{stat.value}</StatValue>
            </StatCard>
          ))}
        </StatsGrid>
      )}

      {error && <ErrorText>{error.message || error}</ErrorText>}
    </AdminPage>
  )
}
