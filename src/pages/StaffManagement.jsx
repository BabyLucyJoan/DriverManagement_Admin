// StaffManagement.jsx
import { useEffect, useState } from "react";
import { VALIDATION, ERROR_MESSAGES } from "../constants";
import {
  Box,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Add, Delete, Edit } from "@mui/icons-material";
import { toast } from "react-toastify";
import api from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";

export default function StaffManagement() {
  const [staff, setStaff] = useState([]);
  const [open, setOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingStaffId, setEditingStaffId] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [permissions, setPermissions] = useState([]);
  const [availablePermissions, setAvailablePermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const res = await api.get("/staff");
      setStaff(res.data);
    } catch  {
      toast.error("Failed to load staff members");
    } finally {
      setLoading(false);
    }
  };

  const fetchPermissions = async () => {
    try {
      const res = await api.get("/permissions");
      setAvailablePermissions(res.data);
    } catch {
      toast.error("Failed to load permissions");
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchStaff();
    fetchPermissions();
    return () => controller.abort();
  }, []);

  const handleAdd = async () => {
    // Validation
    if (!name || !email || !phone || !password || !permissions.length) {
      toast.error("All fields are required");
      return;
    }

    // Name validation
    if (!VALIDATION.NAME.test(name)) {
      toast.error(ERROR_MESSAGES.NAME_INVALID);
      return;
    }

    // Email validation
    if (!VALIDATION.EMAIL.test(email)) {
      toast.error(ERROR_MESSAGES.EMAIL_INVALID);
      return;
    }

    // Phone validation
    if (!VALIDATION.PHONE.test(phone)) {
      toast.error(ERROR_MESSAGES.PHONE_INVALID);
      return;
    }

    // Password validation`
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      await api.post("/auth/staff/register", { name, email, phone, password, permissions });
      setOpen(false);
      setName("");
      setEmail("");
      setPhone("");
      setPassword("");
      setPermissions([]);
      fetchStaff();
      toast.success("Staff member added successfully");
    } catch(err) {
      console.log(err)
      toast.error("Failed to add staff member");
    }
  };

  const handleEdit = (staffMember) => {
    setIsEditMode(true);
    setEditingStaffId(staffMember._id);
    setName(staffMember.name);
    setEmail(staffMember.email);
    setPhone(staffMember.phone);
    setPermissions(staffMember.permissions || []);
    setPassword("");
    setOpen(true);
  };

  const handleUpdate = async () => {
    // Validation
    if (!name || !email || !phone || !permissions.length) {
      toast.error("All fields except password are required");
      return;
    }

    // Name validation
    if (!VALIDATION.NAME.test(name)) {
      toast.error(ERROR_MESSAGES.NAME_INVALID);
      return;
    }

    // Email validation
    if (!VALIDATION.EMAIL.test(email)) {
      toast.error(ERROR_MESSAGES.EMAIL_INVALID);
      return;
    }

    // Phone validation
    if (!VALIDATION.PHONE.test(phone)) {
      toast.error(ERROR_MESSAGES.PHONE_INVALID);
      return;
    }

    // Password validation (only if provided)
    if (password && password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      const updateData = { name, email, phone, permissions };
      if (password) {
        updateData.password = password;
      }
      await api.put(`/staff/${editingStaffId}`, updateData);
      setOpen(false);
      setIsEditMode(false);
      setEditingStaffId(null);
      setName("");
      setEmail("");
      setPhone("");
      setPassword("");
      setPermissions([]);
      fetchStaff();
      toast.success("Staff member updated successfully");
    } catch(err) {
      console.log(err);
      toast.error("Failed to update staff member");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this staff?")) {
      try {
        await api.delete(`/staff/${id}`);
        fetchStaff();
        toast.success("Staff member deleted successfully");
      } catch (err) {
        console.log(err)
        toast.error( "Failed to delete staff member");
      }
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading staff members..." />;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">
          Staff Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {
            setIsEditMode(false);
            setEditingStaffId(null);
            setName("");
            setEmail("");
            setPhone("");
            setPassword("");
            setPermissions([]);
            setOpen(true);
          }}
        >
          Add Staff
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Permissions</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {staff.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4}>
                  <EmptyState
                    message="No staff members found"
                    actionText="Add First Staff Member"
                    onAction={() => {
                      setIsEditMode(false);
                      setEditingStaffId(null);
                      setName("");
                      setEmail("");
                      setPhone("");
                      setPassword("");
                      setPermissions([]);
                      setOpen(true);
                    }}
                  />
                </TableCell>
              </TableRow>
            ) : (
              staff.map((s) => (
                <TableRow key={s._id}>
                  <TableCell>{s.name}</TableCell>
                  <TableCell>{s.email}</TableCell>
                  <TableCell>{s.phone}</TableCell>
                  <TableCell>
                    {Array.isArray(s.permissions)
                      ? s.permissions.map(perm =>
                          availablePermissions.find(p => p.name === perm)?.displayName || perm
                        ).join(", ")
                      : s.permissions
                    }
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={s.role}
                      color={s.role === "admin" ? "error" : "primary"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(s)}
                      aria-label={`Edit ${s.name}`}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(s._id)}
                      aria-label={`Delete ${s.name}`}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => {
        setOpen(false);
        setIsEditMode(false);
        setEditingStaffId(null);
        setName("");
        setEmail("");
        setPhone("");
        setPassword("");
        setPermissions([]);
      }}>
        <DialogTitle>{isEditMode ? "Edit Staff" : "Add New Staff"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            fullWidth
            sx={{ mt: 2 }}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            label="Email"
            fullWidth
            sx={{ mt: 2 }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Phone"
            fullWidth
            sx={{ mt: 2 }}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+233XXXXXXXXX or 0XXXXXXXXX"
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            sx={{ mt: 2 }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={isEditMode ? "Leave blank to keep current password" : ""}
            helperText={isEditMode ? "Optional: Only fill if you want to change password" : "Required"}
          />
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Permissions</InputLabel>
            <Select
              multiple
              value={permissions}
              label="Permissions"
              onChange={(e) => setPermissions(e.target.value)}
              renderValue={(selected) => selected.map(val =>
                availablePermissions.find(p => p.name === val)?.displayName || val
              ).join(", ")}
            >
              {availablePermissions.map((perm) => (
                <MenuItem key={perm.name} value={perm.name}>
                  {perm.displayName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setOpen(false);
            setIsEditMode(false);
            setEditingStaffId(null);
            setName("");
            setEmail("");
            setPhone("");
            setPassword("");
            setPermissions([]);
          }}>Cancel</Button>
          <Button variant="contained" onClick={isEditMode ? handleUpdate : handleAdd}>
            {isEditMode ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
