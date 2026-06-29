import styled from 'styled-components'
import { FiSearch } from 'react-icons/fi'

const StyledSearch = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
`

const SearchIcon = styled.span`
    position: absolute;
    left: 16px;
    color: ${({ theme }) => theme.mutedText};
    pointer-events: none;
`

const Input = styled.input`
    width: 100%;
    height: 54px;
    padding: 0 18px 0 46px;
    background: ${({ theme }) => theme.inputBg};
    color: ${({ theme }) => theme.text};
    border: 1px solid ${({ theme }) => theme.border};
    border-radius: 8px;
    font-size: 16px;
    box-shadow: 0 10px 26px rgba(20, 33, 61, 0.06);
    transition: border-color .18s ease, box-shadow .18s ease, transform .18s ease;

    &:focus {
        outline: none;
        border-color: ${({ theme }) => theme.primary};
        box-shadow: 0 0 0 4px rgba(15, 139, 141, 0.15), 0 16px 34px rgba(20, 33, 61, 0.1);
        transform: translateY(-1px);
    }
`


export default function Search({ value, onChange }) {    
  return (
    <StyledSearch>
        <SearchIcon><FiSearch /></SearchIcon>
        <Input type="text" placeholder='Search by role, company, location, or skill' value={value} onChange={onChange} />
    </StyledSearch>
  )
}
