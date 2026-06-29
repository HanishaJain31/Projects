import styled from 'styled-components'

const StyledSpinner = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
`
const P = styled.p`
    font-size: 24px;
    color: ${({ theme }) => theme.primary};
`

export default function Spinner() {
  return (
    <StyledSpinner>
        <P>Loading...</P>
    </StyledSpinner>
  )
}
