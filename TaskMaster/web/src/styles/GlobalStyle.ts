import { createGlobalStyle } from 'styled-components';
import { useTheme } from '../context/ThemeContext';

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Roboto', 'Segoe UI', 'Arial', sans-serif;
    font-size: 16px;
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    transition: background-color 0.3s ease, color 0.3s ease;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  button, input, select, textarea {
    font-family: inherit;
    font-size: inherit;
  }

  button {
    cursor: pointer;
    border: none;
    background: none;
  }

  ul, ol {
    list-style: none;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  /* Scrollbar styling */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${() => {
      const { themeType } = useTheme();
      return themeType === 'light' ? '#f1f1f1' : '#2d2d2d';
    }};
  }

  ::-webkit-scrollbar-thumb {
    background: ${() => {
      const { themeType } = useTheme();
      return themeType === 'light' ? '#c1c1c1' : '#555';
    }};
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${() => {
      const { themeType } = useTheme();
      return themeType === 'light' ? '#a8a8a8' : '#777';
    }};
  }
`;