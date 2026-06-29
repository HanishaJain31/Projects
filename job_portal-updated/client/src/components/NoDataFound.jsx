import styled from 'styled-components'

const Wrapper = styled.div`
  width: min(100%, 680px);
  margin: 32px auto;
  padding: 40px 28px;
  text-align: center;
  background: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.text};
  border: 1px dashed ${({ theme }) => theme.border};
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadow};
`

const Icon = styled.div`
  width: 56px;
  height: 56px;
  margin: 0 auto 16px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: ${({ theme }) => theme.surfaceAlt};
  color: ${({ theme }) => theme.accent};
  font-size: 28px;
  font-weight: 500;
`

const Title = styled.h2`
  margin: 0 0 8px;
  font-size: 22px;
`

const Message = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.mutedText};
  line-height: 1.6;
`

export default function NoDataFound({
  title = 'No data found',
  message = 'There is nothing to show here right now.',
}) {
  return (
    <Wrapper>
      <Icon>!</Icon>
      <Title>{title}</Title>
      <Message>{message}</Message>
    </Wrapper>
  )
}
