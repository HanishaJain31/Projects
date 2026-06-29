import styled from 'styled-components'

export const AdminPage = styled.div`
  max-width: 1200px;
  min-height: 78vh;
  margin: 0 auto;
  padding: 34px 24px;
  color: ${({ theme }) => theme.text};

  @media (max-width: 640px) {
    padding: 24px 16px;
  }
`

export const AdminHero = styled.section`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 22px;
  margin-bottom: 22px;
  padding: 28px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  background: linear-gradient(135deg, ${({ theme }) => theme.surface}, ${({ theme }) => theme.backgroundSoft});
  box-shadow: ${({ theme }) => theme.shadow};

  @media (max-width: 760px) {
    align-items: flex-start;
    flex-direction: column;
  }
`

export const HeroText = styled.div`
  min-width: 0;

  span {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 9px;
    padding: 7px 11px;
    border-radius: 999px;
    background: ${({ theme }) => theme.accentSoft};
    color: ${({ theme }) => theme.accent};
    font-size: 12px;
    font-weight: 500;
    text-transform: uppercase;
  }

  h1 {
    margin: 0;
    font-size: clamp(30px, 5vw, 48px);
    font-weight: 400;
    line-height: 1.05;
    letter-spacing: 0;
  }

  p {
    margin: 8px 0 0;
    color: ${({ theme }) => theme.mutedText};
  }
`

export const HeroActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`

export const AdminButton = styled.button`
  min-height: 42px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0 14px;
  border: 1px solid ${({ theme, $variant }) => ($variant === 'ghost' ? theme.border : theme.primary)};
  border-radius: 8px;
  background: ${({ theme, $variant }) => ($variant === 'ghost' ? theme.surface : theme.primary)};
  color: ${({ theme, $variant }) => ($variant === 'ghost' ? theme.text : '#fff')};
  font-weight: 500;
  cursor: pointer;
  transition: transform .18s ease, background .18s ease, border-color .18s ease, box-shadow .18s ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    background: ${({ theme, $variant }) => ($variant === 'ghost' ? theme.surfaceAlt : theme.primaryHover)};
    border-color: ${({ theme }) => theme.primary};
    box-shadow: ${({ $variant }) => ($variant === 'ghost' ? 'none' : '0 12px 24px rgba(15, 139, 141, 0.2)')};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: .55;
    transform: none;
    box-shadow: none;
  }
`

export const Toolbar = styled.div`
  display: grid;
  grid-template-columns: ${({ $columns }) => $columns || 'minmax(280px, 1fr) 190px 190px'};
  gap: 14px;
  align-items: center;
  margin-bottom: 18px;
  padding: 16px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  background: ${({ theme }) => theme.surface};
  box-shadow: 0 12px 30px rgba(20, 33, 61, 0.06);

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`

export const TablePanel = styled.div`
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  background: ${({ theme }) => theme.surface};
  box-shadow: ${({ theme }) => theme.shadow};
`

export const TableScroll = styled.div`
  overflow-x: auto;
`

export const AdminTable = styled.table`
  width: 100%;
  min-width: 760px;
  border-collapse: collapse;
`

export const TableHeader = styled.th`
  padding: 14px 16px;
  background: ${({ theme }) => theme.surfaceAlt};
  color: ${({ theme }) => theme.mutedText};
  border-bottom: 1px solid ${({ theme }) => theme.border};
  text-align: left;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
`

export const TableCell = styled.td`
  padding: 15px 16px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  color: ${({ theme }) => theme.text};
  vertical-align: middle;
`

export const ActionGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
`

export const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 7px 10px;
  border-radius: 999px;
  background: ${({ theme, $status }) => {
    if ($status === 'approved' || $status === 'active') return 'rgba(18, 158, 99, 0.12)'
    if ($status === 'rejected' || $status === 'closed' || $status === 'inactive') return 'rgba(217, 45, 32, 0.12)'
    return theme.accentSoft
  }};
  color: ${({ theme, $status }) => {
    if ($status === 'approved' || $status === 'active') return theme.success
    if ($status === 'rejected' || $status === 'closed' || $status === 'inactive') return theme.danger
    return theme.accent
  }};
  font-size: 12px;
  font-weight: 500;
  text-transform: capitalize;
`

export const EmptyState = styled.div`
  margin-top: 24px;
  padding: 24px;
  border: 1px dashed ${({ theme }) => theme.border};
  border-radius: 8px;
  background: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.text};
`
