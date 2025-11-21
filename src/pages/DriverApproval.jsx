// MCMove/src/pages/DriverApproval.jsx
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import api from "../services/api";
import { VALIDATION, ERROR_MESSAGES } from "../constants";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";

const DriverApproval = () => {
  const { user } = useContext(AuthContext);
  const [drivers, setDrivers] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    ghanaCard: "",
  });
  const [message, setMessage] = useState("");

  const hasPermission =
    user.role === "admin" || user.permissions.includes("approve_drivers");

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      const res = await api.get("/drivers");
      setDrivers(res.data);
    } catch (err) {
      console.error("Failed to fetch drivers:", err);
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.patch(`/drivers/${id}/approve`);
      setDrivers(
        drivers.map((d) => (d._id === id ? { ...d, isApproved: true } : d))
      );
      setMessage("Driver approved successfully!");
      setTimeout(() => setMessage(""), 4000);
    } catch {
      setMessage("Approval failed");
    }
  };

  const handleAddDriver = async () => {
    if (!form.name || !form.phone || !form.ghanaCard) {
      setMessage("All fields are required");
      return;
    }

    // Phone validation
    if (!VALIDATION.PHONE.test(form.phone)) {
      setMessage(ERROR_MESSAGES.PHONE_INVALID);
      return;
    }

    // Ghana Card validation
    if (!VALIDATION.GHANA_CARD.test(form.ghanaCard)) {
      setMessage(ERROR_MESSAGES.GHANA_CARD_INVALID);
      return;
    }

    // Name validation
    if (!VALIDATION.NAME.test(form.name)) {
      setMessage(ERROR_MESSAGES.NAME_INVALID);
      return;
    }

    try {
      await api.post("/auth/driver/register", {
        name: form.name,
        phone: form.phone,
        ghanaCard: form.ghanaCard,
      });

      setMessage("Driver added successfully! Pending approval.");
      setOpen(false);
      setForm({ name: "", phone: "", ghanaCard: "" });
      fetchDrivers();
    } catch (err) {
      setMessage(
        err.response?.data?.message ||
          "Failed to add driver (maybe phone exists)"
      );
    }
  };

  if (!hasPermission) return <Navigate to="/unauthorized" />;

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          Driver Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
        >
          Add Driver
        </Button>
      </Box>

      {message && (
        <Alert
          severity={message.includes("success") ? "success" : "error"}
          sx={{ mb: 2 }}
        >
          {message}
        </Alert>
      )}

      <Paper elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Ghana Card</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {drivers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  No drivers registered yet
                </TableCell>
              </TableRow>
            ) : (
              drivers.map((d) => (
                <TableRow key={d._id} hover>
                  <TableCell>{d.name}</TableCell>
                  <TableCell>{d.ghanaCard}</TableCell>
                  <TableCell>{d.phone}</TableCell>
                  <TableCell>
                    <Chip
                      label={d.isApproved ? "Approved" : "Pending"}
                      color={d.isApproved ? "success" : "warning"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {!d.isApproved && (
                      <Button
                        variant="contained"
                        size="small"
                        color="primary"
                        onClick={() => handleApprove(d._id)}
                      >
                        Approve
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add New Driver</DialogTitle>
        <DialogContent>
          <TextField
            label="Full Name"
            fullWidth
            margin="normal"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <TextField
            label="Phone Number"
            fullWidth
            margin="normal"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="+233241234567"
            helperText="Use your whitelisted number for testing"
            required
          />
          <TextField
            label="Ghana Card Number"
            fullWidth
            margin="normal"
            value={form.ghanaCard}
            onChange={(e) => setForm({ ...form, ghanaCard: e.target.value })}
            placeholder="GHA-123456789-0"
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddDriver}>
            Add Driver
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DriverApproval;
