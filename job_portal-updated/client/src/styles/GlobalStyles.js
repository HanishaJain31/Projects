import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  *{
    margin:0;
    padding:0;
    box-sizing:border-box;
  }

  html{
    scroll-behavior:smooth;
  }

  body{
    background:
      radial-gradient(circle at top left, ${({ theme }) => theme.backgroundSoft} 0, transparent 36rem),
      ${({ theme }) => theme.background};
    color:${({ theme }) => theme.text};
    min-height:100vh;
    transition:background .3s ease, color .3s ease;
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    line-height:1.5;
  }

  a{
    color:${({ theme }) => theme.text};
    text-decoration:none;
  }

  button{
    font:inherit;
  }

  button,
  a,
  input,
  select,
  textarea{
    -webkit-tap-highlight-color: transparent;
  }

  input,
  select,
  textarea{
    background:${({ theme }) => theme.inputBg};
    color:${({ theme }) => theme.text};
    border:1px solid ${({ theme }) => theme.border};
  }

  input::placeholder,
  textarea::placeholder{
    color:${({ theme }) => theme.mutedText};
    opacity:.8;
  }

  ::selection{
    background:${({ theme }) => theme.accent};
    color:#fff;
  }

  #root{
    min-height:100vh;
  }
`;

export default GlobalStyles;
