import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import api from "../services/api";
import { PENALTIES } from "../constants";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  TextField,
  InputAdornment
} from "@mui/material";
import { Add, Search, Visibility } from "@mui/icons-material";

const Penalties = () => {
  const { user } = useContext(AuthContext);
  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);

  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [viewDriver, setViewDriver] = useState(null);
  const [penaltyType, setPenaltyType] = useState("");
  const [penaltyAmount, setPenaltyAmount] = useState(0);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

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
        if (!axios.isCancel(err)) {
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
    if (!selectedDriver) {
      toast.error("Please select a driver");
      return;
    }
    if (!penaltyType) {
      toast.error("Please select a penalty type");
      return;
    }
    if (!reason.trim()) {
      toast.error("Please provide a reason");
      return;
    }

    try {
      await api.post("/penalties", {
        driverId: selectedDriver._id,
        type: penaltyType,
        amount: penaltyAmount,
        reason,
      });
      setOpen(false);
      setSelectedDriver(null);
      setPenaltyType("");
      setPenaltyAmount(0);
      setReason("");
      toast.success("Penalty added successfully");
      // Refresh drivers list to update penalty counts
      const res = await api.get("/drivers");
      setDrivers(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add penalty");
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
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">
          Penalties Management
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          slotProps={{
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
              <TableCell>Penalties</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredDrivers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4}>
                  <EmptyState
                    message={searchQuery ? "No drivers found matching your search" : "No drivers available"}
                    actionText={searchQuery ? "" : "Add First Penalty"}
                    onAction={searchQuery ? undefined : () => {
                      setSelectedDriver(null);
                      setPenaltyType("");
                      setPenaltyAmount(0);
                      setReason("");
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
                <TableCell>
                  <Chip
                    label={d.penalties.length}
                    color="warning"
                    size="small"
                    sx={{ color: "white" }}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Visibility />}
                    onClick={() => {
                      setViewDriver(d);
                      setViewOpen(true);
                    }}
                    sx={{ mr: 1, py: 0.5, px: 1.5, fontSize: '0.75rem' }}
                  >
                    View
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Add />}
                    onClick={() => {
                      setSelectedDriver(d);
                      setPenaltyType("");
                      setPenaltyAmount(0);
                      setReason("");
                      setOpen(true);
                    }}
                    sx={{ py: 0.5, px: 1.5, fontSize: '0.75rem' }}
                  >
                    Add Penalty
                  </Button>
                </TableCell>
              </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => {
        setOpen(false);
        setSelectedDriver(null);
        setPenaltyType("");
        setPenaltyAmount(0);
        setReason("");
      }}>
        <DialogTitle>Add Penalty{selectedDriver ? ` for ${selectedDriver.name}` : ""}</DialogTitle>
        <DialogContent>
          {!selectedDriver && (
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Select Driver</InputLabel>
              <Select
                value={selectedDriver?._id || ""}
                label="Select Driver"
                onChange={(e) => {
                  const driver = drivers.find(d => d._id === e.target.value);
                  setSelectedDriver(driver);
                }}
              >
                {drivers.map((driver) => (
                  <MenuItem key={driver._id} value={driver._id}>
                    {driver.name} ({driver.ghanaCard})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Penalty Type</InputLabel>
            <Select
              value={penaltyType}
              label="Penalty Type"
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
            multiline
            rows={3}
            sx={{ mt: 2 }}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Provide a detailed reason for this penalty"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setOpen(false);
            setSelectedDriver(null);
            setPenaltyType("");
            setPenaltyAmount(0);
            setReason("");
          }}>Cancel</Button>
          <Button variant="contained" onClick={handleAddPenalty}>
            Add Penalty
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Penalties Dialog */}
      <Dialog
        open={viewOpen}
        onClose={() => {
          setViewOpen(false);
          setViewDriver(null);
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Penalties for {viewDriver?.name}
        </DialogTitle>
        <DialogContent>
          {viewDriver && viewDriver.penalties.length === 0 ? (
            <Box sx={{ py: 3, textAlign: "center" }}>
              <Typography variant="body1" color="text.secondary">
                No penalties recorded for this driver
              </Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Type</TableCell>
                    <TableCell>Amount (GHS)</TableCell>
                    <TableCell>Reason</TableCell>
                    <TableCell>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {viewDriver?.penalties.map((penalty, index) => (
                    <TableRow key={index}>
                      <TableCell>{penalty.type}</TableCell>
                      <TableCell>{penalty.amount}</TableCell>
                      <TableCell>{penalty.reason}</TableCell>
                      <TableCell>
                        {new Date(penalty.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setViewOpen(false);
            setViewDriver(null);
          }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Penalties;
