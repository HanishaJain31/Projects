import styled from 'styled-components'

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: ${({ theme }) => theme.overlay};
`

const Modal = styled.div`
  width: min(100%, 520px);
  padding: 24px;
  background: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.text};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 10px;
  box-shadow: ${({ theme }) => theme.shadow};
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
`

const Title = styled.h2`
  margin: 0;
  font-size: 24px;
`

const CloseButton = styled.button`
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.text};
  font-size: 24px;
  cursor: pointer;
`

const Details = styled.div`
  display: grid;
  gap: 12px;
`

const DetailRow = styled.div`
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  background: ${({ theme }) => theme.surfaceAlt};
`

const Label = styled.p`
  margin: 0 0 4px;
  color: ${({ theme }) => theme.mutedText};
  font-size: 13px;
  font-weight: 500;
`

const Value = styled.p`
  margin: 0;
`

export default function ViewUserAction({ isOpen, user, onClose }) {
  if (!isOpen || !user) return null

  const fields = [
    ['Name', user.name],
    ['Email', user.email],
    ['Job Role', user.job_role],
    ['Status', user.is_active ? 'Active' : 'Inactive'],
  ]

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(event) => event.stopPropagation()}>
        <Header>
          <Title>View User</Title>
          <CloseButton type="button" onClick={onClose}>x</CloseButton>
        </Header>

        <Details>
          {fields.map(([label, value]) => (
            <DetailRow key={label}>
              <Label>{label}</Label>
              <Value>{value || 'N/A'}</Value>
            </DetailRow>
          ))}
        </Details>
      </Modal>
    </Overlay>
  )
}
