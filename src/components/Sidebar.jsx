import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  Button,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Drawer variant="permanent" sx={{ width: 240, flexShrink: 0 }}>
      <Box sx={{ width: 240, pt: 8 }}>
        <List>
          <ListItem button component={Link} to="/">
            <ListItemText primary="Dashboard" />
          </ListItem>

          {user.role === "admin" && (
            <ListItem button component={Link} to="/staff">
              <ListItemText primary="Staff Management" />
            </ListItem>
          )}

          {(user.role === "admin" ||
            user.permissions.includes("approve_drivers")) && (
            <ListItem button component={Link} to="/drivers">
              <ListItemText primary="Driver Approval" />
            </ListItem>
          )}
          {(user.role === "admin" ||
            user.permissions.includes("add_penalties")) && (
            <ListItem button component={Link} to="/penalties">
              <ListItemText primary="Penalties" />
            </ListItem>
          )}
          <ListItem>
            <Button
              variant="outlined"
              color="error"
              fullWidth
              onClick={handleLogout}
            >
              Logout
            </Button>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
