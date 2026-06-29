import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { logoutUser } from '../features/auth/authSlice'

const StyledLogout = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.text};
    text-align: center;
`

const LogoutModal = styled.div`
    background: ${({ theme }) => theme.surface};
    color: ${({ theme }) => theme.text};
    border: 1px solid ${({ theme }) => theme.border};
    border-radius: 8px;
    padding: 40px;
    box-shadow: ${({ theme }) => theme.shadow};
    max-width: 400px;
    width: 100%;
    h2 {
        margin-bottom: 20px;
        font-size: 1.5rem;
    }
    p {
        margin-bottom: 30px;
        font-size: 1rem;
    }
    button {
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        background: ${({ theme }) => theme.accent};
        color: #fff;
        cursor: pointer;
        transition: background 0.3s ease;
        &:hover {
            background: ${({ theme }) => theme.primaryHover};
        }
    }
`


export default function Logout() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleLogout = async () => {
        try {
            await dispatch(logoutUser())
            navigate('/login')
        } catch (error) {
            console.error('Logout failed:', error)
        }
    }

  return (
    <StyledLogout>
        <LogoutModal>
            <h2>Are you sure you want to logout?</h2>
            <p>You will need to login again to access your account.</p>
            <button onClick={handleLogout}>Logout</button>
        </LogoutModal>
    </StyledLogout>
  )
}
