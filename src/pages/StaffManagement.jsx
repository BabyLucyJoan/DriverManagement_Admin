// // StaffManagement.jsx
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

// const StaffManagement = () => {
//   const { user } = useContext(AuthContext);
//   const [staff, setStaff] = useState([]);

//   useEffect(() => {
//     const fetchStaff = async () => {
//       try {
//         const res = await api.get("/staff");
//         setStaff(res.data);
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     if (user.role === "admin") fetchStaff();
//   }, [user]);

//   const handleDelete = async (id) => {
//     if (!window.confirm("Delete this staff?")) return;
//     try {
//       await api.delete(`/staff/${id}`);
//       setStaff(staff.filter((s) => s._id !== id));
//     } catch (err) {
//       alert("Delete failed");
//     }
//   };

//   if (user.role !== "admin") return <Navigate to="/unauthorized" />;

//   return (
//     <Box sx={{ p: 3 }}>
//       <Typography variant="h5" gutterBottom>
//         Staff Management
//       </Typography>
//       <Paper>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Name</TableCell>
//               <TableCell>Email</TableCell>
//               <TableCell>Phone</TableCell>
//               <TableCell>Permissions</TableCell>
//               <TableCell>Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {staff.map((s) => (
//               <TableRow key={s._id}>
//                 <TableCell>{s.name}</TableCell>
//                 <TableCell>{s.email}</TableCell>
//                 <TableCell>{s.phone}</TableCell>
//                 <TableCell>
//                   {s.permissions.map((p) => (
//                     <Chip key={p} label={p} size="small" sx={{ m: 0.5 }} />
//                   ))}
//                 </TableCell>
//                 <TableCell>
//                   <Button
//                     color="error"
//                     size="small"
//                     onClick={() => handleDelete(s._id)}
//                   >
//                     Delete
//                   </Button>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </Paper>
//     </Box>
//   );
// };

// export default StaffManagement;

// ONLY THIS FILE — NEW
import { useEffect, useState } from "react";
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
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import api from "../services/api";

export default function StaffManagement() {
  const [staff, setStaff] = useState([]);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("staff");

  const fetchStaff = async () => {
    const res = await api.get("/staff");
    setStaff(res.data);
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleAdd = async () => {
    await api.post("/staff", { name, email, role });
    setOpen(false);
    setName("");
    setEmail("");
    fetchStaff();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this staff?")) {
      await api.delete(`/staff/${id}`);
      fetchStaff();
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">
          Staff Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpen(true)}
        >
          Add Staff
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: "#1A237E" }}>
            <TableRow>
              <TableCell sx={{ color: "white" }}>Name</TableCell>
              <TableCell sx={{ color: "white" }}>Email</TableCell>
              <TableCell sx={{ color: "white" }}>Role</TableCell>
              <TableCell sx={{ color: "white" }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {staff.map((s) => (
              <TableRow key={s._id}>
                <TableCell>{s.name}</TableCell>
                <TableCell>{s.email}</TableCell>
                <TableCell>
                  <Chip
                    label={s.role}
                    color={s.role === "admin" ? "error" : "primary"}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton color="error" onClick={() => handleDelete(s._id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add New Staff</DialogTitle>
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
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAdd}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
