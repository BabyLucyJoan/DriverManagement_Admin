// Dashboard.jsx
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Grid, Card, CardContent, Typography, Box, Avatar } from "@mui/material";
import {
  People as PeopleIcon,
  BadgeOutlined as BadgeIcon,
  PendingActions as PendingIcon,
  AttachMoney as MoneyIcon,
} from "@mui/icons-material";
import axios from "axios";
import api from "../services/api";
import { toast } from "react-toastify";
import LoadingSpinner from "../components/LoadingSpinner";
import { COLORS } from "../constants/colors";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalDrivers: 0,
    activeStaff: 0,
    pendingApprovals: 0,
    todayRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const fetchStats = async () => {
      setLoading(true);
      try {
        const res = await api.get("/stats", { signal: controller.signal });
        setStats(res.data);
      } catch (err) {
        if (!axios.isCancel(err)) {
          toast.error(err.response?.data?.message || "Failed to load dashboard statistics");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchStats();

    return () => controller.abort();
  }, []);

  const isAdmin = user.role === "admin";

  if (loading) {
    return <LoadingSpinner text="Loading dashboard statistics..." />;
  }

  const statCards = [
    {
      title: "Total Drivers",
      value: stats.totalDrivers,
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      color: COLORS.primary.main,
      bgColor: 'rgba(246, 139, 30, 0.1)',
    },
    {
      title: "Active Staff",
      value: stats.activeStaff,
      icon: <BadgeIcon sx={{ fontSize: 40 }} />,
      color: COLORS.secondary.main,
      bgColor: 'rgba(0, 105, 92, 0.1)',
    },
    {
      title: "Pending Approvals",
      value: stats.pendingApprovals,
      icon: <PendingIcon sx={{ fontSize: 40 }} />,
      color: COLORS.status.warning,
      bgColor: 'rgba(255, 152, 0, 0.1)',
    },
  ];

  if (isAdmin) {
    statCards.push({
      title: "Today's Revenue",
      value: `GHS ${stats.todayRevenue}`,
      icon: <MoneyIcon sx={{ fontSize: 40 }} />,
      color: COLORS.status.success,
      bgColor: 'rgba(76, 175, 80, 0.1)',
    });
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 700 }}>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'visible',
              }}
            >
              <CardContent sx={{ flexGrow: 1, pt: 3 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    mb: 2,
                  }}
                >
                  <Box>
                    <Typography
                      color="textSecondary"
                      variant="body2"
                      sx={{ fontSize: '0.875rem', mb: 1 }}
                    >
                      {card.title}
                    </Typography>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        color: card.color,
                      }}
                    >
                      {card.value}
                    </Typography>
                  </Box>
                  <Avatar
                    sx={{
                      bgcolor: card.bgColor,
                      color: card.color,
                      width: 56,
                      height: 56,
                    }}
                  >
                    {card.icon}
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard;
