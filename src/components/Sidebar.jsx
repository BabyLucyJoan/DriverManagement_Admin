import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Box,
  Button,
  Typography,
  Divider,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  DirectionsCar as DriverIcon,
  Warning as WarningIcon,
  History as HistoryIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext, memo } from "react";
import { AuthContext } from "../context/AuthContext";
import { COLORS } from "../constants/colors";

const Sidebar = memo(() => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    {
      path: "/",
      label: "Dashboard",
      icon: <DashboardIcon />,
      show: true,
    },
    {
      path: "/staff",
      label: "Staff Management",
      icon: <PeopleIcon />,
      show: user.role === "admin",
    },
    {
      path: "/drivers",
      label: "Driver Approval",
      icon: <DriverIcon />,
      show: user.role === "admin" || user.permissions.includes("approve_drivers"),
    },
    {
      path: "/penalties",
      label: "Penalties",
      icon: <WarningIcon />,
      show: user.role === "admin" || user.permissions.includes("add_penalties"),
    },
    {
      path: "/audit-log",
      label: "Audit Log",
      icon: <HistoryIcon />,
      show: user.role === "admin",
    },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          bgcolor: COLORS.background.paper,
          borderRight: `1px solid ${COLORS.border.main}`,
        },
      }}
    >
      <Box sx={{ pt: 8, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ px: 2, py: 2 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: COLORS.primary.main,
              textAlign: 'center',
              mb: 1,
            }}
          >
            MCMove
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: COLORS.text.secondary,
              textAlign: 'center',
              display: 'block',
            }}
          >
            {user.role === "admin" ? "Admin Panel" : "Staff Panel"}
          </Typography>
        </Box>

        <Divider sx={{ mb: 1 }} />

        <List sx={{ flexGrow: 1, px: 1 }}>
          {menuItems.map(
            (item) =>
              item.show && (
                <ListItem
                  key={item.path}
                  button
                  component={Link}
                  to={item.path}
                  sx={{
                    borderRadius: 2,
                    mb: 0.5,
                    bgcolor: isActive(item.path)
                      ? 'rgba(246, 139, 30, 0.1)'
                      : 'transparent',
                    '&:hover': {
                      bgcolor: isActive(item.path)
                        ? 'rgba(246, 139, 30, 0.15)'
                        : 'rgba(0, 0, 0, 0.04)',
                    },
                    borderLeft: isActive(item.path)
                      ? `3px solid ${COLORS.primary.main}`
                      : '3px solid transparent',
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isActive(item.path)
                        ? COLORS.primary.main
                        : COLORS.text.secondary,
                      minWidth: 40,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: '0.875rem',
                      fontWeight: isActive(item.path) ? 600 : 400,
                      color: isActive(item.path)
                        ? COLORS.primary.main
                        : COLORS.text.primary,
                    }}
                  />
                </ListItem>
              )
          )}
        </List>

        <Divider sx={{ mb: 2 }} />

        <Box sx={{ px: 2, pb: 2 }}>
          <Button
            variant="outlined"
            color="error"
            fullWidth
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            Logout
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
});

Sidebar.displayName = "Sidebar";

export default Sidebar;
