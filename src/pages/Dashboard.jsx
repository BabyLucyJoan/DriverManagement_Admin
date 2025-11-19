// Dashboard.jsx
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Grid, Card, CardContent, Typography, Box } from "@mui/material";
import api from "../services/api";
import Sidebar from "../components/Sidebar";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalDrivers: 0,
    activeStaff: 0,
    pendingApprovals: 0,
    todayRevenue: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/stats");
        setStats(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  const isAdmin = user.role === "admin";

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary">Total Drivers</Typography>
                <Typography variant="h5">{stats.totalDrivers}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary">Active Staff</Typography>
                <Typography variant="h5">{stats.activeStaff}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary">Pending Approvals</Typography>
                <Typography variant="h5">{stats.pendingApprovals}</Typography>
              </CardContent>
            </Card>
          </Grid>

          {isAdmin && (
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ bgcolor: "#e3f2fd" }}>
                <CardContent>
                  <Typography color="primary">Today's Revenue</Typography>
                  <Typography variant="h5">GHS {stats.todayRevenue}</Typography>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;
