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
  InputAdornment,
  IconButton
} from "@mui/material";
import { Add, Search, Visibility, Delete, CheckCircle } from "@mui/icons-material";

const Penalties = () => {
  const { user } = useContext(AuthContext);
  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);

  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [viewDriver, setViewDriver] = useState(null);
  const [driverPenalties, setDriverPenalties] = useState([]);
  const [loadingPenalties, setLoadingPenalties] = useState(false);
  const [penaltyType, setPenaltyType] = useState("");
  const [penaltyAmount, setPenaltyAmount] = useState(0);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [penaltyToDelete, setPenaltyToDelete] = useState(null);
  const [penaltyCounts, setPenaltyCounts] = useState({});

  const hasAddPermission =
    user.role === "admin" || user.permissions.includes("add_penalties");
  const hasViewPermission =
    user.role === "admin" || user.permissions.includes("view_penalties");
  const hasDeletePermission =
    user.role === "admin" || user.permissions.includes("delete_penalties");
  const hasMarkPaidPermission = user.role === "admin" 

  useEffect(() => {
    const controller = new AbortController();

    const fetchDrivers = async () => {
      setLoading(true);
      try {
        const res = await api.get("/drivers", { signal: controller.signal });
        console.log(res.data)
        setDrivers(res.data);

        // Fetch penalty counts for each driver (only unpaid)
        const counts = {};
        await Promise.all(
          res.data.map(async (driver) => {
            try {
              const penaltyRes = await api.get(`/penalties/driver/${driver._id}`);
              counts[driver._id] = Array.isArray(penaltyRes.data.penalties)
                ? penaltyRes.data.penalties.filter(p => !p.isPaid).length
                : 0;
            } catch {
              counts[driver._id] = 0;
            }
          })
        );
        setPenaltyCounts(counts);
      } catch (err) {
        if (!axios.isCancel(err)) {
          toast.error(err.response?.data?.message || "Failed to load drivers");
        }
      } finally {
        // Only hide loading after both drivers and penalty counts are fetched
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
      const driverId = selectedDriver._id;
      setSelectedDriver(null);
      setPenaltyType("");
      setPenaltyAmount(0);
      setReason("");
      toast.success("Penalty added successfully");

      // Update penalty count for the specific driver
      try {
        const penaltyRes = await api.get(`/penalties/driver/${driverId}`);
        setPenaltyCounts(prev => ({
          ...prev,
          [driverId]: Array.isArray(penaltyRes.data.penalties)
            ? penaltyRes.data.penalties.length
            : 0
        }));
      } catch {
        // Fallback: just increment the count
        setPenaltyCounts(prev => ({
          ...prev,
          [driverId]: (prev[driverId] || 0) + 1
        }));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add penalty");
    }
  };

  // Fetch penalties for a specific driver
  const fetchDriverPenalties = async (driverId) => {
    setLoadingPenalties(true);
    try {
      const res = await api.get(`/penalties/driver/${driverId}`);
      // Ensure we always set an array
      setDriverPenalties(Array.isArray(res.data.penalties) ? res.data.penalties : []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load penalties");
      setDriverPenalties([]);
    } finally {
      setLoadingPenalties(false);
    }
  };

  // Mark a penalty as paid
  const handleMarkAsPaid = async (penaltyId) => {
    try {
      await api.patch(`/penalties/${penaltyId}/pay`);
      toast.success("Penalty marked as paid successfully");
      // Refresh the driver's penalties
      if (viewDriver) {
        await fetchDriverPenalties(viewDriver._id);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to mark penalty as paid");
    }
  };

  // Delete a penalty
  const handleDeletePenalty = async () => {
    if (!penaltyToDelete) return;

    try {
      await api.delete(`/penalties/${penaltyToDelete}`);
      toast.success("Penalty deleted successfully");
      // Refresh the driver's penalties
      if (viewDriver) {
        await fetchDriverPenalties(viewDriver._id);

        // Update penalty count for the specific driver
        try {
          const penaltyRes = await api.get(`/penalties/driver/${viewDriver._id}`);
          setPenaltyCounts(prev => ({
            ...prev,
            [viewDriver._id]: Array.isArray(penaltyRes.data.penalties)
              ? penaltyRes.data.penalties.length
              : 0
          }));
        } catch {
          // Fallback: just decrement the count
          setPenaltyCounts(prev => ({
            ...prev,
            [viewDriver._id]: Math.max((prev[viewDriver._id] || 0) - 1, 0)
          }));
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete penalty");
    } finally {
      setDeleteDialogOpen(false);
      setPenaltyToDelete(null);
    }
  };

  const filteredDrivers = drivers.filter((d) =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!hasViewPermission) return <Navigate to="/unauthorized" />;

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
                    label={penaltyCounts[d._id] || 0}
                    color={penaltyCounts[d._id] > 0 ? "error" : "default"}
                    size="small"
                    sx={{
                      color: penaltyCounts[d._id] > 0 ? "white" : "inherit"
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Visibility />}
                    onClick={async () => {
                      setViewDriver(d);
                      setViewOpen(true);
                      await fetchDriverPenalties(d._id);
                    }}
                    sx={{ mr: 1, py: 0.5, px: 1.5, fontSize: '0.75rem' }}
                  >
                    View
                  </Button>
                  {hasAddPermission && (
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
                  )}
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
          setDriverPenalties([]);
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Penalties for {viewDriver?.name}
        </DialogTitle>
        <DialogContent>
          {loadingPenalties ? (
            <Box sx={{ py: 3, textAlign: "center" }}>
              <LoadingSpinner text="Loading penalties..." />
            </Box>
          ) : driverPenalties.length === 0 ? (
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
                    <TableCell>Status</TableCell>
                    <TableCell>Date</TableCell>
                    {(hasDeletePermission || hasMarkPaidPermission) && <TableCell>Action</TableCell>}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {driverPenalties.map((penalty) => (
                    <TableRow key={penalty._id}>
                      <TableCell>{penalty.type}</TableCell>
                      <TableCell>{penalty.amount}</TableCell>
                      <TableCell>{penalty.reason}</TableCell>
                      <TableCell>
                        <Chip
                          label={penalty.isPaid ? "Paid" : "Unpaid"}
                          color={penalty.isPaid ? "success" : "warning"}
                          size="small"
                          sx={{
                            color: "white",
                            fontWeight: 500
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(penalty.createdAt).toLocaleDateString()}
                      </TableCell>
                      {(hasDeletePermission || hasMarkPaidPermission) && (
                        <TableCell>
                          {hasMarkPaidPermission && !penalty.isPaid && (
                            <IconButton
                              color="success"
                              size="small"
                              onClick={() => handleMarkAsPaid(penalty._id)}
                              title="Mark as paid"
                              sx={{ mr: 1 }}
                            >
                              <CheckCircle fontSize="small" />
                            </IconButton>
                          )}
                          {hasDeletePermission && (
                            <IconButton
                              color="error"
                              size="small"
                              onClick={() => {
                                setPenaltyToDelete(penalty._id);
                                setDeleteDialogOpen(true);
                              }}
                              title="Delete penalty"
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          )}
                        </TableCell>
                      )}
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
            setDriverPenalties([]);
          }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setPenaltyToDelete(null);
        }}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this penalty?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setDeleteDialogOpen(false);
              setPenaltyToDelete(null);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeletePenalty}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Penalties;
