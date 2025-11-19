import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import api from "../services/api";
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

const PENALTIES = [
  { name: "Overspeeding", amount: 50 },
  { name: "Geofencing", amount: 200 },
  { name: "Late Payment", amount: 50 },
  { name: "Locking Car", amount: 50 },
  { name: "Car Sharing", amount: 200 },
  { name: "Number of Trips", amount: 100 },
  { name: "Photocheck", amount: 100 },
  { name: "Self Repair", amount: 100 },
  { name: "Servicing Show Up Failure", amount: 50 },
  { name: "Inspection Show Up Failure", amount: 100 },
  { name: "Recovery (Based on Location)", amount: 150 },
  { name: "Accident (20% of total cost)", amount: "20%" },
];

const Penalties = () => {
  const { user } = useContext(AuthContext);
  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);

  const [open, setOpen] = useState(false);
  const [penaltyType, setPenaltyType] = useState("");
  const [penaltyAmount, setPenaltyAmount] = useState(0);
  const [reason, setReason] = useState("");

  const hasPermission =
    user.role === "admin" || user.permissions.includes("add_penalties");

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const res = await api.get("/drivers");
        setDrivers(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDrivers();
  }, []);

  const handleAddPenalty = async () => {
    try {
      await api.post("/penalties", {
        driverId: selectedDriver._id,
        type: penaltyType,
        amount,
        reason,
      });
      setOpen(false);
      // Refresh drivers or penalties
      // ...
    } catch (err) {
      alert("Failed to add penalty");
    }
  };

  if (!hasPermission) return <Navigate to="/unauthorized" />;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Penalties Management
      </Typography>

      <Paper>
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
