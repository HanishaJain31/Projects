
import styled from 'styled-components'
import { FiBriefcase, FiMail, FiMapPin } from 'react-icons/fi'

const StyledFooter = styled.footer`
  margin-top: 40px;
  padding: 30px 24px;
  background: ${({ theme }) => theme.surface}cc;
  color: ${({ theme }) => theme.mutedText};
  border-top: 1px solid ${({ theme }) => theme.border};
`

const FooterInner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 18px;

  @media (max-width: 700px) {
    flex-direction: column;
    align-items: flex-start;
  }
`

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: ${({ theme }) => theme.text};
  font-weight: 500;
`

const FooterLinks = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  font-size: 14px;

  span {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
`

export default function Footer() {
  return (
    <StyledFooter>
      <FooterInner>
        <Brand><FiBriefcase /> HireNest</Brand>
        <FooterLinks>
          <span><FiMapPin /> Remote-first opportunities</span>
          <span><FiMail /> support@hirenest.local</span>
          <span>Built for focused job discovery</span>
        </FooterLinks>
      </FooterInner>
    </StyledFooter>
  )
}
