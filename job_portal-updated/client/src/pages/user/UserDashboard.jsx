import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { FiCheckCircle, FiClock, FiFileText, FiSearch, FiXCircle } from 'react-icons/fi'
import Spinner from '../../ui/Spinner'
import { dashboardData } from '../../features/user/userProfileSlice'

const Dashboard = styled.div`
  max-width: 1180px;
  min-height: 70vh;
  margin: 0 auto;
  padding: 38px 24px;

  @media (max-width: 640px) {
    padding: 26px 16px;
  }
`

const Header = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 270px;
  gap: 22px;
  align-items: stretch;
  margin-bottom: 24px;

  @media (max-width: 820px) {
    grid-template-columns: 1fr;
  }
`

const Intro = styled.div`
  padding: 30px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  background: linear-gradient(135deg, ${({ theme }) => theme.surface}, ${({ theme }) => theme.backgroundSoft});
  box-shadow: ${({ theme }) => theme.shadow};

  h1 {
    margin: 0 0 8px;
    font-size: clamp(30px, 5vw, 44px);
    font-weight: 500;
    line-height: 1.05;
  }

  p {
    margin: 0;
    color: ${({ theme }) => theme.mutedText};
  }
`

const FocusCard = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 20px;
  padding: 24px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  background: ${({ theme }) => theme.surface};
  box-shadow: ${({ theme }) => theme.shadow};

  span {
    width: 46px;
    height: 46px;
    display: grid;
    place-items: center;
    border-radius: 8px;
    background: ${({ theme }) => theme.accentSoft};
    color: ${({ theme }) => theme.accent};
  }

  strong {
    font-size: 28px;
    font-weight: 500;
  }

  p {
    margin: 0;
    color: ${({ theme }) => theme.mutedText};
    font-weight: 500;
  }
`

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 980px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`

const Card = styled.div`
  position: relative;
  overflow: hidden;
  min-height: 180px;
  padding: 22px;
  background: ${({ theme }) => theme.surface};
  border-radius: 8px;
  box-shadow: 0 12px 30px rgba(20, 33, 61, 0.06);
  border: 1px solid ${({ theme }) => theme.border};
  transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease;

  &:before {
    content: "";
    position: absolute;
    inset: 0 0 auto;
    height: 4px;
    background: ${(props) => props.$color || props.theme.primary};
  }

  &:hover {
    transform: translateY(-5px);
    border-color: ${(props) => props.$color || props.theme.primary};
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
  background: ${(props) => props.$color || props.theme.primary}18;
  color: ${(props) => props.$color || props.theme.primary};
`

const CardLabel = styled.p`
  margin: 0 0 8px;
  color: ${({ theme }) => theme.mutedText};
  font-size: 14px;
  font-weight: 500;
`

const CardValue = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.text};
  font-size: 38px;
  font-weight: 500;
  line-height: 1;
`

const ErrorText = styled.p`
  color: ${({ theme }) => theme.danger};
`

export default function UserDashboard() {
  const dispatch = useDispatch()
  const { dashboardData: stats, isLoading, error } = useSelector((state) => state.profile)
  const safeStats = stats || {}

  useEffect(() => {
    dispatch(dashboardData())
  }, [dispatch])

  const cards = [
    {
      label: 'Total Applications',
      value: safeStats.total_applications || 0,
      color: '#0f8b8d',
      icon: <FiFileText />,
    },
    {
      label: 'Pending Applications',
      value: safeStats.pending_applications || 0,
      color: '#f59f00',
      icon: <FiClock />,
    },
    {
      label: 'Approved Applications',
      value: safeStats.approved_applications || 0,
      color: '#129e63',
      icon: <FiCheckCircle />,
    },
    {
      label: 'Rejected Applications',
      value: safeStats.rejected_applications || 0,
      color: '#d92d20',
      icon: <FiXCircle />,
    },
  ]

  return (
    <Dashboard>
      <Header>
        <Intro>
          <h1>Your application command center.</h1>
          <p>Track every role, keep momentum visible, and spot what needs attention next.</p>
        </Intro>
        <FocusCard>
          <span><FiSearch /></span>
          <div>
            <strong>{safeStats.pending_applications || 0}</strong>
            <p>applications waiting for a decision</p>
          </div>
        </FocusCard>
      </Header>

      {isLoading && <Spinner />}
      {error && <ErrorText>{error.message || error}</ErrorText>}

      {!isLoading && (
        <CardGrid>
          {cards.map((card) => (
            <Card key={card.label} $color={card.color}>
              <IconBubble $color={card.color}>{card.icon}</IconBubble>
              <CardLabel>{card.label}</CardLabel>
              <CardValue>{card.value}</CardValue>
            </Card>
          ))}
        </CardGrid>
      )}
    </Dashboard>
  )
}
