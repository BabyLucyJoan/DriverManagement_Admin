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
  TableContainer,
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
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  InputAdornment,
} from "@mui/material";
import { Add, Edit, Search } from "@mui/icons-material";
import { toast } from "react-toastify";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";

const DriverApproval = () => {
  const { user } = useContext(AuthContext);
  const [drivers, setDrivers] = useState([]);
  const [open, setOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingDriverId, setEditingDriverId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    ghanaCard: "",
    isApproved: false,
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const hasPermission =
    user.role === "admin" || user.permissions.includes("approve_drivers");

  useEffect(() => {
    const controller = new AbortController();
    fetchDrivers();
    return () => controller.abort();
  }, []);

  const fetchDrivers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/drivers");
      setDrivers(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load drivers");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.patch(`/drivers/${id}/approve`);
      setDrivers(
        drivers.map((d) => (d._id === id ? { ...d, isApproved: true } : d))
      );
      toast.success("Driver approved successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Approval failed");
    }
  };

  const handleEdit = (driver) => {
    setIsEditMode(true);
    setEditingDriverId(driver._id);
    setForm({
      name: driver.name,
      phone: driver.phone,
      ghanaCard: driver.ghanaCard,
      isApproved: driver.isApproved,
    });
    setOpen(true);
  };

  const handleUpdate = async () => {
    if (!form.name || !form.phone || !form.ghanaCard) {
      toast.error("All fields are required");
      return;
    }

    // Name validation
    if (!VALIDATION.NAME.test(form.name)) {
      toast.error(ERROR_MESSAGES.NAME_INVALID);
      return;
    }

    // Phone validation
    if (!VALIDATION.PHONE.test(form.phone)) {
      toast.error(ERROR_MESSAGES.PHONE_INVALID);
      return;
    }

    // Ghana Card validation
    if (!VALIDATION.GHANA_CARD.test(form.ghanaCard)) {
      toast.error(ERROR_MESSAGES.GHANA_CARD_INVALID);
      return;
    }

    try {
      const updateData = {
        name: form.name,
        phone: form.phone,
        ghanaCard: form.ghanaCard,
        isApproved: form.isApproved,
      };
      await api.put(`/drivers/${editingDriverId}`, updateData);
      setOpen(false);
      setIsEditMode(false);
      setEditingDriverId(null);
      setForm({ name: "", phone: "", ghanaCard: "", isApproved: false });
      fetchDrivers();
      toast.success("Driver updated successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update driver");
    }
  };

  const handleAddDriver = async () => {
    if (!form.name || !form.phone || !form.ghanaCard) {
      toast.error("All fields are required");
      return;
    }

    // Name validation
    if (!VALIDATION.NAME.test(form.name)) {
      toast.error(ERROR_MESSAGES.NAME_INVALID);
      return;
    }

    // Phone validation
    if (!VALIDATION.PHONE.test(form.phone)) {
      toast.error(ERROR_MESSAGES.PHONE_INVALID);
      return;
    }

    // Ghana Card validation
    if (!VALIDATION.GHANA_CARD.test(form.ghanaCard)) {
      toast.error(ERROR_MESSAGES.GHANA_CARD_INVALID);
      return;
    }

    try {
      await api.post("/drivers/register", {
        name: form.name,
        phone: form.phone,
        ghanaCard: form.ghanaCard,
      });

      setOpen(false);
      setForm({ name: "", phone: "", ghanaCard: "" });
      fetchDrivers();
      toast.success("Driver added successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add driver");
    }
  };

  const filteredDrivers = drivers.filter((d) =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!hasPermission) return <Navigate to="/unauthorized" />;

  if (loading) {
    return <LoadingSpinner text="Loading drivers..." />;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">
          Driver Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {
            setIsEditMode(false);
            setEditingDriverId(null);
            setForm({ name: "", phone: "", ghanaCard: "", isApproved: false });
            setOpen(true);
          }}
        >
          Add Driver
        </Button>
      </Box>

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          slotProps ={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <TableContainer component={Paper}>
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
            {filteredDrivers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <EmptyState
                    message={searchQuery ? "No drivers found matching your search" : "No drivers registered yet"}
                    actionText={searchQuery ? "" : "Add First Driver"}
                    onAction={searchQuery ? undefined : () => {
                      setIsEditMode(false);
                      setEditingDriverId(null);
                      setForm({ name: "", phone: "", ghanaCard: "", isApproved: false });
                      setOpen(true);
                    }}
                  />
                </TableCell>
              </TableRow>
            ) : (
              filteredDrivers.map((d) => (
                <TableRow key={d._id}>
                  <TableCell>{d.name}</TableCell>
                  <TableCell>{d.ghanaCard}</TableCell>
                  <TableCell>{d.phone}</TableCell>
                  <TableCell>
                    <Chip
                      label={d.isApproved ? "Approved" : "Pending"}
                      color={d.isApproved ? "success" : "error"}
                      size="small"
                      sx={{ color: "white" }}
                    />
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Edit Driver">
                      <IconButton
                        onClick={() => handleEdit(d)}
                        aria-label={`Edit ${d.name}`}
                        sx={{ color: '#1976d2' }}
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    {!d.isApproved && (
                      <Button
                        variant="contained"
                        size="small"
                        color="primary"
                        onClick={() => handleApprove(d._id)}
                        sx={{ fontSize: '0.75rem', py: 0.5, px: 1.5, ml: 1 }}
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
      </TableContainer>

      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
          setIsEditMode(false);
          setEditingDriverId(null);
          setForm({ name: "", phone: "", ghanaCard: "", isApproved: false });
        }}
      >
        <DialogTitle>{isEditMode ? "Edit Driver" : "Add New Driver"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Full Name"
            fullWidth
            sx={{ mt: 2 }}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <TextField
            label="Phone Number"
            fullWidth
            sx={{ mt: 2 }}
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="+233XXXXXXXXX or 0XXXXXXXXX"
          />
          <TextField
            label="Ghana Card Number"
            fullWidth
            sx={{ mt: 2 }}
            value={form.ghanaCard}
            onChange={(e) => setForm({ ...form, ghanaCard: e.target.value })}
            placeholder="GHA-123456789-0"
          />
          {isEditMode && (
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={form.isApproved}
                label="Status"
                onChange={(e) => setForm({ ...form, isApproved: e.target.value })}
              >
                <MenuItem value={false}>Pending</MenuItem>
                <MenuItem value={true}>Approved</MenuItem>
              </Select>
            </FormControl>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setOpen(false);
            setIsEditMode(false);
            setEditingDriverId(null);
            setForm({ name: "", phone: "", ghanaCard: "", isApproved: false });
          }}>Cancel</Button>
          <Button variant="contained" onClick={isEditMode ? handleUpdate : handleAddDriver}>
            {isEditMode ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DriverApproval;
