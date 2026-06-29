import Header from './Header'
import Footer from './Footer'
import { Outlet } from 'react-router-dom'
import styled from 'styled-components'

const Layout = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
`

const Main = styled.main`
  flex: 1;
`

export default function AppLayout() {  
  return (
    <Layout>
      <Header />
      <Main>
        <Outlet />
      </Main>
      <Footer />
    </Layout>
  )
}
