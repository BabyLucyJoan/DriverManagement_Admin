import { Box, Typography, Button, Paper } from "@mui/material";
import { Lock as LockIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { COLORS } from "../constants/colors";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
        p: 3,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 6,
          textAlign: "center",
          maxWidth: 500,
          borderRadius: 3,
        }}
      >
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            bgcolor: 'rgba(244, 67, 54, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
          }}
        >
          <LockIcon sx={{ fontSize: 48, color: COLORS.status.error }} />
        </Box>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: COLORS.status.error,
            mb: 2,
          }}
        >
          403 - Unauthorized
        </Typography>
        <Typography
          variant="body1"
          color="textSecondary"
          sx={{ mb: 4 }}
        >
          You don't have permission to access this page. Please contact your administrator if you believe this is an error.
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/")}
          sx={{
            px: 4,
            py: 1.5,
          }}
        >
          Go to Dashboard
        </Button>
      </Paper>
    </Box>
  );
};

export default Unauthorized;
