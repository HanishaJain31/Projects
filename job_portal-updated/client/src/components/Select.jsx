import styled from 'styled-components'

const StyledSelect = styled.select`
    width: 100%;
    height: 44px;
    padding: 0 12px;
    background: ${({ theme }) => theme.inputBg};
    color: ${({ theme }) => theme.text};
    border: 1px solid ${({ theme }) => theme.border};
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    transition: border-color .18s ease, box-shadow .18s ease;

    &:focus {
        outline: none;
        border-color: ${({ theme }) => theme.primary};
        box-shadow: 0 0 0 4px rgba(15, 139, 141, 0.14);
    }
`

export default function Select({ value, onChange, label, options}) {
  return (
    <StyledSelect value={value} onChange={onChange}>
        <option value="">{label}</option>
        {options.map((option) => (
            <option key={option.value} value={option.value}>
                {option.label}
            </option>
        ))}
    </StyledSelect>
  )
}
