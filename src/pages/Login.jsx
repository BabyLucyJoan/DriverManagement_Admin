// Login.jsx
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  TextField,
  Button,
  Paper,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
} from "@mui/material";
import { DirectionsCar as CarIcon } from "@mui/icons-material";
import { COLORS } from "../constants/colors";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("staff");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password, role);
    navigate("/");
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        bgcolor: COLORS.background.default,
        backgroundImage: `linear-gradient(135deg, ${COLORS.background.default} 0%, ${COLORS.background.dark} 100%)`,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          width: 400,
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <Avatar
            sx={{
              bgcolor: COLORS.primary.main,
              width: 64,
              height: 64,
              mb: 2,
            }}
          >
            <CarIcon sx={{ fontSize: 40 }} />
          </Avatar>
          <Typography
            variant="h5"
            align="center"
            sx={{
              fontWeight: 700,
              color: COLORS.text.primary,
              mb: 0.5,
            }}
          >
            MCMove
          </Typography>
          <Typography
            variant="body2"
            align="center"
            color="textSecondary"
          >
            Login to your account
          </Typography>
        </Box>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <FormControl fullWidth margin="normal" variant="outlined">
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              labelId="role-label"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              label="Role"
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="staff">Staff</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 3,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600,
            }}
          >
            Login
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;
