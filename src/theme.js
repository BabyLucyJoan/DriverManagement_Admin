// theme.js - Unified MCMove Theme Configuration
import { createTheme } from "@mui/material/styles";
import { COLORS } from "./constants/colors";

const theme = createTheme({
  palette: {
    primary: {
      main: COLORS.primary.main,
      light: COLORS.primary.light,
      dark: COLORS.primary.dark,
      contrastText: COLORS.primary.contrastText,
    },
    secondary: {
      main: COLORS.secondary.main,
      light: COLORS.secondary.light,
      dark: COLORS.secondary.dark,
      contrastText: COLORS.secondary.contrastText,
    },
    background: {
      default: COLORS.background.default,
      paper: COLORS.background.paper,
    },
    success: { main: COLORS.status.success },
    warning: { main: COLORS.status.warning },
    error: { main: COLORS.status.error },
    info: { main: COLORS.status.info },
    text: {
      primary: COLORS.text.primary,
      secondary: COLORS.text.secondary,
      disabled: COLORS.text.disabled,
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      color: COLORS.text.primary,
    },
    h5: {
      fontWeight: 600,
      color: COLORS.text.primary,
    },
    h6: {
      fontWeight: 500,
      color: COLORS.text.primary,
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
          transition: 'all 0.3s ease',
          fontWeight: 600,
        },
        contained: {
          boxShadow: '0 2px 8px rgba(246, 139, 30, 0.3)',
          '&:hover': {
            boxShadow: '0 4px 16px rgba(246, 139, 30, 0.4)',
            transform: 'translateY(-1px)',
          },
        },
        containedSecondary: {
          boxShadow: '0 2px 8px rgba(0, 105, 92, 0.3)',
          '&:hover': {
            boxShadow: '0 4px 16px rgba(0, 105, 92, 0.4)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
        elevation3: {
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            backgroundColor: 'transparent',
            color: COLORS.text.primary,
            fontWeight: 700,
            fontSize: '0.875rem',
            borderBottom: `2px solid ${COLORS.primary.main}`,
            paddingBottom: '12px',
            paddingTop: '12px',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid #F0F0F0`,
          padding: '16px',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: 'rgba(246, 139, 30, 0.04)',
            transform: 'scale(1.001)',
          },
          '&:last-child td': {
            borderBottom: 0,
          },
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          border: `1px solid #F0F0F0`,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        },
      },
    },
  },
});

export default theme;
