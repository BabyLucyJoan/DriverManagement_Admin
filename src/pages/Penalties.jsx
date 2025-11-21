import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";
import { PENALTIES } from "../constants";
import LoadingSpinner from "../components/LoadingSpinner";
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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
} from "@mui/material";
import { Add } from "@mui/icons-material";

const Penalties = () => {
  const { user } = useContext(AuthContext);
  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);

  const [open, setOpen] = useState(false);
  const [penaltyType, setPenaltyType] = useState("");
  const [penaltyAmount, setPenaltyAmount] = useState(0);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(true);

  const hasPermission =
    user.role === "admin" || user.permissions.includes("add_penalties");

  useEffect(() => {
    const controller = new AbortController();

    const fetchDrivers = async () => {
      setLoading(true);
      try {
        const res = await api.get("/drivers", { signal: controller.signal });
        setDrivers(res.data);
      } catch (err) {
        if (err.name !== "AbortError") {
          toast.error("Failed to load drivers");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchDrivers();

    return () => controller.abort();
  }, []);

  const handleAddPenalty = async () => {
    try {
      await api.post("/penalties", {
        driverId: selectedDriver._id,
        type: penaltyType,
        amount: penaltyAmount,
        reason,
      });
      setOpen(false);
      toast.success("Penalty added successfully");
      // Refresh drivers or penalties
      // ...
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add penalty");
    }
  };

  if (!hasPermission) return <Navigate to="/unauthorized" />;

  if (loading) {
    return <LoadingSpinner text="Loading drivers..." />;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 700 }}>
        Penalties Management
      </Typography>

      <Paper elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Ghana Card</TableCell>
              <TableCell>Penalties</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {drivers.map((d) => (
              <TableRow key={d._id}>
                <TableCell>{d.name}</TableCell>
                <TableCell>{d.ghanaCard}</TableCell>
                <TableCell>
                  <Chip
                    label={d.penalties.length}
                    color="warning"
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Add />}
                    onClick={() => {
                      setSelectedDriver(d);
                      setOpen(true);
                    }}
                  >
                    Add Penalty
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add Penalty for {selectedDriver?.name}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Penalty Type</InputLabel>
            <Select
              value={penaltyType}
              onChange={(e) => {
                setPenaltyType(e.target.value);
                setPenaltyAmount(
                  PENALTIES.find((p) => p.name === e.target.value).amount
                );
              }}
            >
              {PENALTIES.map((p) => (
                <MenuItem key={p.name} value={p.name}>
                  {p.name} (GHS {p.amount})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Reason"
            fullWidth
            sx={{ mt: 2 }}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddPenalty}>
            Add Penalty
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Penalties;
