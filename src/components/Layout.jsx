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

const Layout = ({ children, title }) => {
  const { user, logout } = useContext(AuthContext);

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="fixed" sx={{ zIndex: 1201, bgcolor: "#1A237E" }}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              {title}
            </Typography>
            <Typography variant="subtitle2" sx={{ mr: 2 }}>
              {user.name} ({user.role})
            </Typography>
            <IconButton color="inherit" onClick={logout}>
              <Logout />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Box sx={{ mt: 8, p: 3 }}>{children}</Box>
      </Box>
    </Box>
  );
};

export default Layout;
