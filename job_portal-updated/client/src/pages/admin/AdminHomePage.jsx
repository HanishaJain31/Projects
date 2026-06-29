import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import { FiArrowRight, FiBriefcase, FiGrid, FiInbox, FiUsers } from 'react-icons/fi'
import { AdminHero, AdminPage, HeroText } from './AdminStyles'

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`

const CardButton = styled.button`
  min-height: 220px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  text-align: left;
  padding: 22px;
  background: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.text};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  box-shadow: 0 12px 30px rgba(20, 33, 61, 0.06);
  cursor: pointer;
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-5px);
    border-color: ${({ theme }) => theme.primary};
    box-shadow: ${({ theme }) => theme.shadowStrong};
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.primary};
    outline-offset: 3px;
  }
`

const IconBubble = styled.span`
  width: 52px;
  height: 52px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  background: ${({ theme }) => theme.primary}18;
  color: ${({ theme }) => theme.primary};
`

const CardTitle = styled.h2`
  margin: 18px 0 8px;
  font-size: 24px;
  font-weight: 400;
`

const CardText = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.mutedText};
  font-size: 14px;
  line-height: 1.5;
`

const CardFooter = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 22px;
  color: ${({ theme }) => theme.primary};
  font-weight: 500;
`

export default function AdminHomePage() {
  const navigate = useNavigate()

  const cards = [
    { title: 'Manage Users', text: 'View accounts, check status, and activate or deactivate users.', icon: <FiUsers />, path: '/admin/users' },
    { title: 'Manage Jobs', text: 'Create, edit, review, and close job postings.', icon: <FiBriefcase />, path: '/admin/jobs' },
    { title: 'Applications', text: 'Review candidates and approve or reject applications.', icon: <FiInbox />, path: '/admin/applications' },
  ]

  return (
    <AdminPage>
      <AdminHero>
        <HeroText>
          <span><FiGrid /> Admin Home</span>
          <h1>Manage the hiring workspace.</h1>
          <p>Choose a module and keep the job portal moving with focused admin tools.</p>
        </HeroText>
      </AdminHero>

      <CardGrid>
        {cards.map((card) => (
          <CardButton key={card.title} onClick={() => navigate(card.path)}>
            <div>
              <IconBubble>{card.icon}</IconBubble>
              <CardTitle>{card.title}</CardTitle>
              <CardText>{card.text}</CardText>
            </div>
            <CardFooter>Open module <FiArrowRight /></CardFooter>
          </CardButton>
        ))}
      </CardGrid>
    </AdminPage>
  )
}
