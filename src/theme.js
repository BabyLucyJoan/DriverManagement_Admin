// theme.js (copy to both apps)
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#F68B1E", // Jumia Orange
    },
    secondary: {
      main: "#1A237E", // Jumia Dark Blue
    },
    background: {
      default: "#F5F5F5",
      paper: "#FFFFFF",
    },
    success: { main: "#4CAF50" },
    warning: { main: "#FF9800" },
    error: { main: "#F44336" },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h5: { fontWeight: 600 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8 },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" },
      },
    },
  },
});

export default theme;
