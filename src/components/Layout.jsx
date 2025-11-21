// MCMove/src/components/Layout.jsx
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
} from "@mui/material";
import Sidebar from "./Sidebar";
import { Logout } from "@mui/icons-material";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { COLORS } from "../constants";

const DRAWER_WIDTH = 240;

const Layout = ({ children, title }) => {
  const { user, logout } = useContext(AuthContext);

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          position="fixed"
          sx={{
            zIndex: (theme) => theme.zIndex.drawer + 1,
            bgcolor: '#FFFFFF',
            ml: `${DRAWER_WIDTH}px`,
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            borderBottom: `1px solid ${COLORS.border?.main || '#E0E0E0'}`,
            borderRadius: 0,
          }}
        >
          <Toolbar>
            <Typography
              variant="h6"
              sx={{
                flexGrow: 1,
                color: COLORS.primary?.main || '#F68B1E',
                fontWeight: 600,
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="subtitle2"
              sx={{
                mr: 2,
                color: COLORS.text?.secondary || '#757575',
              }}
            >
              {user.name} ({user.role})
            </Typography>
            <IconButton
              onClick={logout}
              aria-label="Logout"
              sx={{
                color: COLORS.text?.secondary || '#757575',
                '&:hover': {
                  bgcolor: 'rgba(246, 139, 30, 0.08)',
                  color: COLORS.primary?.main || '#F68B1E',
                },
              }}
            >
              <Logout />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Toolbar />
        <Box sx={{ p: 3 }}>{children}</Box>
      </Box>
    </Box>
  );
};

export default Layout;
