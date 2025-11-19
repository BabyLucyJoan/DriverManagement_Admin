// // DriverApproval.jsx
// import { useEffect, useState, useContext } from "react";
// import { AuthContext } from "../context/AuthContext";
// import { Navigate } from "react-router-dom";
// import api from "../services/api";
// import {
//   Button,
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableRow,
//   Paper,
//   Typography,
//   Box,
//   Chip,
// } from "@mui/material";

// const DriverApproval = () => {
//   const { user } = useContext(AuthContext);
//   const [drivers, setDrivers] = useState([]);

//   const hasPermission =
//     user.role === "admin" || user.permissions.includes("approve_drivers");

//   useEffect(() => {
//     const fetchDrivers = async () => {
//       try {
//         const res = await api.get("/drivers");
//         setDrivers(res.data);
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     fetchDrivers();
//   }, []);

//   const handleApprove = async (id) => {
//     try {
//       await api.patch(`/drivers/${id}/approve`);
//       setDrivers(
//         drivers.map((d) => (d._id === id ? { ...d, isApproved: true } : d))
//       );
//     } catch (err) {
//       alert("Approval failed");
//     }
//   };

//   if (!hasPermission) return <Navigate to="/unauthorized" />;

//   return (
//     <Box sx={{ p: 3 }}>
//       <Typography variant="h5" gutterBottom>
//         Driver Approval
//       </Typography>
//       <Paper>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Name</TableCell>
//               <TableCell>Ghana Card</TableCell>
//               <TableCell>Phone</TableCell>
//               <TableCell>Status</TableCell>
//               <TableCell>Action</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {drivers.map((d) => (
//               <TableRow key={d._id}>
//                 <TableCell>{d.name}</TableCell>
//                 <TableCell>{d.ghanaCard}</TableCell>
//                 <TableCell>{d.phone}</TableCell>
//                 <TableCell>
//                   <Chip
//                     label={d.isApproved ? "Approved" : "Pending"}
//                     color={d.isApproved ? "success" : "warning"}
//                   />
//                 </TableCell>
//                 <TableCell>
//                   {!d.isApproved && (
//                     <Button
//                       variant="contained"
//                       size="small"
//                       onClick={() => handleApprove(d._id)}
//                     >
//                       Approve
//                     </Button>
//                   )}
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </Paper>
//     </Box>
//   );
// };

// export default DriverApproval;

// // MCMove/src/pages/DriverApproval.jsx
// import { useEffect, useState, useContext } from "react";
// import { AuthContext } from "../context/AuthContext";
// import { Navigate } from "react-router-dom";
// import api from "../services/api";
// import {
//   Button,
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableRow,
//   Paper,
//   Typography,
//   Box,
//   Chip,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   FormControlLabel,
//   Checkbox,
//   Alert,
// } from "@mui/material";
// import { Add as AddIcon } from "@mui/icons-material";

// const DriverApproval = () => {
//   const { user } = useContext(AuthContext);
//   const [drivers, setDrivers] = useState([]);
//   const [open, setOpen] = useState(false);
//   const [form, setForm] = useState({
//     name: "",
//     phone: "",
//     ghanaCard: "",
//     password: "",
//     isApproved: true, // For testing — set to false in production
//   });
//   const [message, setMessage] = useState("");

//   const hasPermission =
//     user.role === "admin" || user.permissions.includes("approve_drivers");

//   useEffect(() => {
//     fetchDrivers();
//   }, []);

//   const fetchDrivers = async () => {
//     try {
//       const res = await api.get("/drivers");
//       setDrivers(res.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleApprove = async (id) => {
//     try {
//       await api.patch(`/drivers/${id}/approve`);
//       setDrivers(
//         drivers.map((d) => (d._id === id ? { ...d, isApproved: true } : d))
//       );
//       setMessage("Driver approved!");
//       setTimeout(() => setMessage(""), 3000);
//     } catch (err) {
//       setMessage("Approval failed");
//     }
//   };

//   const handleAddDriver = async () => {
//     if (!form.name || !form.phone || !form.ghanaCard || !form.password) {
//       setMessage("All fields are required");
//       return;
//     }

//     try {
//       await api.post("/auth/driver/register", form);
//       setMessage("Driver added successfully!");
//       setOpen(false);
//       setForm({
//         name: "",
//         phone: "",
//         ghanaCard: "",
//         password: "",
//         isApproved: true,
//       });
//       fetchDrivers(); // Refresh list
//     } catch (err) {
//       setMessage(err.response?.data?.message || "Failed to add driver");
//     }
//   };

//   if (!hasPermission) return <Navigate to="/unauthorized" />;

//   return (
//     <Box sx={{ p: 3 }}>
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           mb: 3,
//         }}
//       >
//         <Typography variant="h5" fontWeight="bold">
//           Driver Management
//         </Typography>
//         <Button
//           variant="contained"
//           startIcon={<AddIcon />}
//           onClick={() => setOpen(true)}
//         >
//           Add Driver
//         </Button>
//       </Box>

//       {message && (
//         <Alert
//           severity={
//             message.includes("success") || message.includes("approved")
//               ? "success"
//               : "error"
//           }
//           sx={{ mb: 2 }}
//         >
//           {message}
//         </Alert>
//       )}

//       <Paper>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>
//                 <strong>Name</strong>
//               </TableCell>
//               <TableCell>
//                 <strong>Ghana Card</strong>
//               </TableCell>
//               <TableCell>
//                 <strong>Phone</strong>
//               </TableCell>
//               <TableCell>
//                 <strong>Status</strong>
//               </TableCell>
//               <TableCell>
//                 <strong>Action</strong>
//               </TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {drivers.length === 0 ? (
//               <TableRow>
//                 <TableCell colSpan={5} align="center">
//                   No drivers yet
//                 </TableCell>
//               </TableRow>
//             ) : (
//               drivers.map((d) => (
//                 <TableRow key={d._id}>
//                   <TableCell>{d.name}</TableCell>
//                   <TableCell>{d.ghanaCard}</TableCell>
//                   <TableCell>{d.phone}</TableCell>
//                   <TableCell>
//                     <Chip
//                       label={d.isApproved ? "Approved" : "Pending"}
//                       color={d.isApproved ? "success" : "warning"}
//                       size="small"
//                     />
//                   </TableCell>
//                   <TableCell>
//                     {!d.isApproved && (
//                       <Button
//                         variant="contained"
//                         size="small"
//                         onClick={() => handleApprove(d._id)}
//                       >
//                         Approve
//                       </Button>
//                     )}
//                   </TableCell>
//                 </TableRow>
//               ))
//             )}
//           </TableBody>
//         </Table>
//       </Paper>

//       {/* ADD DRIVER DIALOG */}
//       <Dialog
//         open={open}
//         onClose={() => setOpen(false)}
//         maxWidth="sm"
//         fullWidth
//       >
//         <DialogTitle>Add New Driver</DialogTitle>
//         <DialogContent>
//           <TextField
//             label="Full Name"
//             fullWidth
//             margin="normal"
//             value={form.name}
//             onChange={(e) => setForm({ ...form, name: e.target.value })}
//           />
//           <TextField
//             label="Phone (e.g. +233241234567)"
//             fullWidth
//             margin="normal"
//             value={form.phone}
//             onChange={(e) => setForm({ ...form, phone: e.target.value })}
//             placeholder="+233241234567"
//           />
//           <TextField
//             label="Ghana Card Number"
//             fullWidth
//             margin="normal"
//             value={form.ghanaCard}
//             onChange={(e) => setForm({ ...form, ghanaCard: e.target.value })}
//           />
//           <TextField
//             label="Password"
//             type="password"
//             fullWidth
//             margin="normal"
//             value={form.password}
//             onChange={(e) => setForm({ ...form, password: e.target.value })}
//           />
//           <FormControlLabel
//             control={
//               <Checkbox
//                 checked={form.isApproved}
//                 onChange={(e) =>
//                   setForm({ ...form, isApproved: e.target.checked })
//                 }
//               />
//             }
//             label="Auto-approve (for testing)"
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpen(false)}>Cancel</Button>
//           <Button variant="contained" onClick={handleAddDriver}>
//             Add Driver
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default DriverApproval;

// MCMove/src/pages/DriverApproval.jsx
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
    } catch (err) {
      setMessage("Approval failed");
    }
  };

  const handleAddDriver = async () => {
    if (!form.name || !form.phone || !form.ghanaCard) {
      setMessage("All fields are required");
      return;
    }

    try {
      await api.post("/auth/driver/register", {
        name: form.name,
        phone: form.phone,
        ghanaCard: form.ghanaCard,
        // Password will be set by driver on first login via SMS or app
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
          <TableHead sx={{ bgcolor: "#1A237E" }}>
            <TableRow>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Name
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Ghana Card
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Phone
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Status
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Action
              </TableCell>
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

      {/* ADD DRIVER DIALOG */}
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
