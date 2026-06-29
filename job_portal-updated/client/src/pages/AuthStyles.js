import styled from 'styled-components'

export const AuthPage = styled.div`
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 34px 24px;
  color: ${({ theme }) => theme.text};
`

export const AuthShell = styled.div`
  width: min(100%, 1120px);
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(360px, 460px);
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  background: ${({ theme }) => theme.surface};
  box-shadow: ${({ theme }) => theme.shadowStrong};

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`

export const AuthVisual = styled.aside`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 640px;
  padding: 34px;
  background: linear-gradient(135deg, ${({ theme }) => theme.backgroundSoft}, ${({ theme }) => theme.surface});
  border-right: 1px solid ${({ theme }) => theme.border};

  @media (max-width: 900px) {
    min-height: auto;
    border-right: 0;
    border-bottom: 1px solid ${({ theme }) => theme.border};
  }
`

export const Brand = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  font-size: 18px;
  font-weight: 500;

  span {
    width: 44px;
    height: 44px;
    display: grid;
    place-items: center;
    border-radius: 8px;
    background: ${({ theme }) => theme.primary};
    color: #fff;
    box-shadow: 0 14px 28px rgba(15, 139, 141, 0.24);
  }
`

export const VisualCopy = styled.div`
  max-width: 560px;
  margin: 46px 0;

  h1 {
    margin: 0;
    font-size: clamp(34px, 6vw, 64px);
    font-weight: 400;
    line-height: 1.02;
    letter-spacing: 0;
  }

  p {
    margin: 16px 0 0;
    color: ${({ theme }) => theme.mutedText};
    font-size: 17px;
  }
`

export const VisualCards = styled.div`
  display: grid;
  gap: 12px;
`

export const MiniCard = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  width: ${({ $wide }) => ($wide ? '100%' : '88%')};
  margin-left: ${({ $offset }) => ($offset ? 'auto' : '0')};
  padding: 14px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  background: ${({ theme }) => theme.surface};
  box-shadow: 0 12px 30px rgba(20, 33, 61, 0.08);
  transition: transform .18s ease, border-color .18s ease;

  &:hover {
    transform: translateY(-3px);
    border-color: ${({ theme }) => theme.primary};
  }

  svg {
    color: ${({ theme }) => theme.primary};
  }

  strong {
    display: block;
    font-weight: 500;
  }

  span {
    color: ${({ theme }) => theme.mutedText};
    font-size: 13px;
  }
`

export const FormPanel = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 34px;

  @media (max-width: 560px) {
    padding: 24px 18px;
  }
`

export const FormHeader = styled.div`
  margin-bottom: 24px;

  span {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
    padding: 7px 11px;
    border-radius: 999px;
    background: ${({ theme }) => theme.accentSoft};
    color: ${({ theme }) => theme.accent};
    font-size: 12px;
    font-weight: 500;
    text-transform: uppercase;
  }

  h2 {
    margin: 0;
    font-size: 34px;
    font-weight: 400;
  }

  p {
    margin: 8px 0 0;
    color: ${({ theme }) => theme.mutedText};
  }
`

export const Form = styled.form`
  display: grid;
  gap: 15px;
`

export const Field = styled.label`
  display: grid;
  gap: 8px;

  span {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    font-size: 13px;
    font-weight: 500;
  }

  svg {
    color: ${({ theme }) => theme.primary};
  }
`

export const Input = styled.input`
  width: 100%;
  min-height: 48px;
  padding: 0 14px;
  background: ${({ theme }) => theme.inputBg};
  color: ${({ theme }) => theme.text};
  border: 1px solid ${({ theme, $error }) => ($error ? theme.danger : theme.border)};
  border-radius: 8px;
  font-size: 15px;
  transition: border-color .18s ease, box-shadow .18s ease, transform .18s ease;

  &:focus {
    outline: none;
    transform: translateY(-1px);
    border-color: ${({ theme, $error }) => ($error ? theme.danger : theme.primary)};
    box-shadow: ${({ $error, theme }) => ($error ? `0 0 0 4px ${theme.danger}22` : '0 0 0 4px rgba(15, 139, 141, 0.14)')};
  }
`

export const ErrorText = styled.p`
  margin: -4px 0 0;
  color: ${({ theme }) => theme.danger};
  font-size: 13px;
  font-weight: 500;
`

export const SubmitButton = styled.button`
  min-height: 48px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 4px;
  border: 1px solid ${({ theme }) => theme.primary};
  border-radius: 8px;
  background: ${({ theme }) => theme.primary};
  color: #fff;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: transform .18s ease, background .18s ease, box-shadow .18s ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    background: ${({ theme }) => theme.primaryHover};
    box-shadow: 0 14px 28px rgba(15, 139, 141, 0.24);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: .65;
    transform: none;
    box-shadow: none;
  }
`

export const SwitchText = styled.p`
  margin: 18px 0 0;
  color: ${({ theme }) => theme.mutedText};
  text-align: center;

  button {
    border: 0;
    background: transparent;
    color: ${({ theme }) => theme.primary};
    font: inherit;
    font-weight: 500;
    cursor: pointer;
  }
`

export const UploadBox = styled.label`
  display: grid;
  grid-template-columns: 46px minmax(0, 1fr);
  gap: 12px;
  align-items: center;
  padding: 14px;
  border: 1px dashed ${({ theme, $error }) => ($error ? theme.danger : theme.border)};
  border-radius: 8px;
  background: ${({ theme }) => theme.surfaceAlt};
  cursor: pointer;
  transition: transform .18s ease, border-color .18s ease, background .18s ease;

  &:hover {
    transform: translateY(-1px);
    border-color: ${({ theme }) => theme.primary};
    background: ${({ theme }) => theme.backgroundSoft};
  }

  input {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
  }
`

export const UploadIcon = styled.span`
  width: 46px;
  height: 46px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  background: ${({ theme }) => theme.primary};
  color: #fff;
`

export const UploadText = styled.div`
  min-width: 0;

  strong {
    display: block;
    font-weight: 500;
    overflow-wrap: anywhere;
  }

  p {
    margin: 3px 0 0;
    color: ${({ theme }) => theme.mutedText};
    font-size: 13px;
  }
`
