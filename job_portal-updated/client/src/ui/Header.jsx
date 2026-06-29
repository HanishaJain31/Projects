import styled from 'styled-components'
import { NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-hot-toast'
import { FiBriefcase, FiLogIn, FiLogOut, FiMenu, FiMoon, FiSun, FiUser, FiX } from 'react-icons/fi'
import useTheme from '../context/useTheme'
import { logoutUser } from '../features/auth/authSlice'
import getToastMessage from '../utils/getToastMessage'

const StyledHeader = styled.header`
    position: sticky;
    top: 0;
    z-index: 900;
    background: ${({ theme }) => theme.surface}e8;
    color: ${({ theme }) => theme.text};
    border-bottom: 1px solid ${({ theme }) => theme.border};
    box-shadow: 0 8px 24px rgba(20, 33, 61, 0.06);
    backdrop-filter: blur(16px);
`

const HeaderInner = styled.div`
    max-width: 1200px;
    height: 74px;
    margin: 0 auto;
    padding: 0 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    @media (max-width: 760px) {
        padding: 0 16px;
    }
`

const Brand = styled.button`
    display: inline-flex;
    align-items: center;
    gap: 10px;
    border: 0;
    background: transparent;
    color: ${({ theme }) => theme.text};
    cursor: pointer;
`

const BrandMark = styled.span`
    width: 42px;
    height: 42px;
    display: grid;
    place-items: center;
    border-radius: 8px;
    background: ${({ theme }) => theme.primary};
    color: #fff;
    box-shadow: 0 10px 24px rgba(15, 139, 141, 0.26);
`

const BrandText = styled.span`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    line-height: 1.1;

    strong {
        font-size: 20px;
        letter-spacing: 0;
    }

    small {
        color: ${({ theme }) => theme.mutedText};
        font-size: 12px;
        font-weight: 500;
    }
`

const UserInfo = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;

    button {
        white-space: nowrap;
    }

    @media (max-width: 860px) {
        position: fixed;
        top: 74px;
        right: 12px;
        left: 12px;
        display: ${({ $open }) => ($open ? 'grid' : 'none')};
        grid-template-columns: 1fr;
        align-items: stretch;
        gap: 10px;
        padding: 14px;
        border: 1px solid ${({ theme }) => theme.border};
        border-radius: 8px;
        background: ${({ theme }) => theme.surface};
        box-shadow: ${({ theme }) => theme.shadowStrong};
    }
`

const NavItem = styled(NavLink)`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-height: 40px;
    padding: 0 12px;
    border-radius: 8px;
    color: ${({ theme }) => theme.mutedText};
    font-weight: 500;
    font-size: 14px;
    transition: transform .18s ease, background .18s ease, color .18s ease;

    &:hover,
    &.active {
        color: ${({ theme }) => theme.text};
        background: ${({ theme }) => theme.surfaceAlt};
        transform: translateY(-1px);
    }
`

const HeaderButton = styled.button`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-height: 40px;
    padding: 0 12px;
    border: 1px solid ${({ theme, $primary }) => ($primary ? theme.primary : theme.border)};
    border-radius: 8px;
    background: ${({ theme, $primary }) => ($primary ? theme.primary : theme.surfaceAlt)};
    color: ${({ theme, $primary }) => ($primary ? '#fff' : theme.text)};
    font-weight: 500;
    cursor: pointer;
    transition: transform .18s ease, background .18s ease, border-color .18s ease, color .18s ease;

    &:hover {
        transform: translateY(-1px);
        background: ${({ theme, $primary }) => ($primary ? theme.primaryHover : theme.card)};
        border-color: ${({ theme }) => theme.primary};
    }
`

const MenuButton = styled(HeaderButton)`
    display: none;

    @media (max-width: 860px) {
        display: inline-flex;
        width: 42px;
        padding: 0;
    }
`

const ModalOverlay = styled.div`
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
    width: min(100%, 420px);
    padding: 28px;
    border-radius: 8px;
    background: ${({ theme }) => theme.surface};
    color: ${({ theme }) => theme.text};
    border: 1px solid ${({ theme }) => theme.border};
    box-shadow: ${({ theme }) => theme.shadow};

    h2 {
        margin: 0 0 10px;
        font-size: 24px;
    }

    p {
        margin: 0;
        color: ${({ theme }) => theme.mutedText};
        line-height: 1.5;
    }
`

const ModalActions = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 24px;
`

const ModalButton = styled.button`
    border: 1px solid ${({ theme, variant }) => variant === 'secondary' ? theme.border : theme.primary};
    border-radius: 8px;
    background: ${({ theme, variant }) => variant === 'secondary' ? theme.surfaceAlt : theme.primary};
    color: ${({ theme, variant }) => variant === 'secondary' ? theme.text : '#fff'};
    padding: 10px 16px;
    cursor: pointer;

    &:hover:not(:disabled) {
        background: ${({ theme, variant }) => variant === 'secondary' ? theme.card : theme.primaryHover};
    }

    &:disabled {
        cursor: not-allowed;
        opacity: 0.65;
    }
`

export default function Header() {
  const { darkMode, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isLoading, role, token } = useSelector((state) => state.auth)
  const [isLogoutOpen, setIsLogoutOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const currentRole = role || localStorage.getItem('role')
  const isLoggedIn = Boolean(token || localStorage.getItem('token'))
  const isAdmin = currentRole === 'admin'

  async function handleConfirmLogout() {
    const action = await dispatch(logoutUser())

    if (logoutUser.fulfilled.match(action)) {
        setIsLogoutOpen(false)
        toast.success('Logged out successfully')
        navigate('/login')
        return
    }

    toast.error(getToastMessage(action.payload, 'Logout failed'))
  }

  function closeMenu() {
    setIsMenuOpen(false)
  }

  return (
    <>
    <StyledHeader>
        <HeaderInner>
        <Brand type="button" onClick={() => navigate(isAdmin ? '/admin/home' : '/')}>
            <BrandMark><FiBriefcase size={20} /></BrandMark>
            <BrandText>
                <strong>HireNest</strong>
                <small>Job Portal</small>
            </BrandText>
        </Brand>

        <MenuButton type="button" onClick={() => setIsMenuOpen((open) => !open)} aria-label="Toggle navigation">
            {isMenuOpen ? <FiX /> : <FiMenu />}
        </MenuButton>

        <UserInfo $open={isMenuOpen} onClick={closeMenu}>
            {!isAdmin && (
                <NavItem to="/">Home</NavItem>
            )}

            {isLoggedIn && isAdmin && (
                <>
                <NavItem to="/admin/home">Home</NavItem>
                <NavItem to="/admin">Dashboard</NavItem>
                </>
            )}

            {isLoggedIn && !isAdmin && (
                <>
                    <NavItem to="/user">Dashboard</NavItem>
                    <NavItem to="/my-applications">Applications</NavItem>

                </>
            )}

            {isLoggedIn && (
                <NavItem to="/profile"><FiUser /> Profile</NavItem>
            )}

            <HeaderButton type="button" onClick={toggleTheme} aria-label="Toggle theme">
                {darkMode ? <FiSun /> : <FiMoon />}
                {darkMode ? 'Light' : 'Dark'}
            </HeaderButton>

            {isLoggedIn ? (
                <HeaderButton type="button" onClick={() => setIsLogoutOpen(true)}><FiLogOut /> Logout</HeaderButton>
            ) : (
                <>
                    <HeaderButton type="button" onClick={() => navigate('/login')}><FiLogIn /> Login</HeaderButton>
                    <HeaderButton type="button" $primary onClick={() => navigate('/signup')}>Signup</HeaderButton>
                </>
            )}
        </UserInfo>
        </HeaderInner>
    </StyledHeader>
    {isLogoutOpen && (
        <ModalOverlay onClick={() => setIsLogoutOpen(false)}>
            <Modal onClick={(event) => event.stopPropagation()}>
                <h2>Confirm logout</h2>
                <p>Are you sure you want to logout? You will need to login again to access your account.</p>
                <ModalActions>
                    <ModalButton type="button" variant="secondary" onClick={() => setIsLogoutOpen(false)}>
                        Cancel
                    </ModalButton>
                    <ModalButton type="button" onClick={handleConfirmLogout} disabled={isLoading}>
                        {isLoading ? 'Logging out...' : 'Logout'}
                    </ModalButton>
                </ModalActions>
            </Modal>
        </ModalOverlay>
    )}
    </>
  )
}

