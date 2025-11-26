import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  InputAdornment,
  TablePagination,
  Grid,
} from "@mui/material";
import { Search, History } from "@mui/icons-material";
import { toast } from "react-toastify";
import axios from "axios";
import api from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import { COLORS } from "../constants/colors";

export default function AuditLog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [totalCount, setTotalCount] = useState(0);

  const fetchLogs = async (signal) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("page", page + 1); // API uses 1-based pagination
      params.append("limit", rowsPerPage);

      if (actionFilter) {
        params.append("action", actionFilter);
      }
      if (startDate) {
        params.append("startDate", startDate);
      }
      if (endDate) {
        params.append("endDate", endDate);
      }

      const res = await api.get(`/audit?${params.toString()}`, { signal });
      setLogs(res.data.logs || res.data.data || res.data);
      setTotalCount(res.data.total || res.data.logs?.length || 0);
    } catch (err) {
      if (!axios.isCancel(err)) {
        toast.error("Failed to load audit logs");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchLogs(controller.signal);
    return () => controller.abort();
  }, [page, rowsPerPage, actionFilter, startDate, endDate]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Client-side search filtering (by performer name)
  const filteredLogs = logs.filter((log) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return log.performedByDetails?.name?.toLowerCase().includes(query);
  });

  if (loading) {
    return <LoadingSpinner text="Loading audit logs..." />;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <History sx={{ fontSize: 32, mr: 1, color: COLORS.primary.main }} />
        <Typography variant="h5" fontWeight="bold">
          Audit Log
        </Typography>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            placeholder="Search by user name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Grid>
        <Grid item xs={12} md={2.5}>
          <TextField
            fullWidth
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              setPage(0);
            }}
            slotProps={{
              inputLabel: { shrink: true }
            }}
          />
        </Grid>
        <Grid item xs={12} md={2.5}>
          <TextField
            fullWidth
            label="End Date"
            type="date"
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
              setPage(0);
            }}
            slotProps={{
              inputLabel: { shrink: true }
            }}
          />
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Timestamp</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>Performed By</TableCell>
              <TableCell>Target</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredLogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <EmptyState
                    message={
                      searchQuery || actionFilter || startDate || endDate
                        ? "No audit logs found matching your filters"
                        : "No audit logs available"
                    }
                  />
                </TableCell>
              </TableRow>
            ) : (
              filteredLogs.map((log) => (
                <TableRow key={log._id} hover>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
                      {formatDate(log.timestamp || log.createdAt)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
                      {log.action}
                    </Typography>
                  </TableCell>
                  <TableCell>
                   <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
                      {log?.performedByDetails?.name }
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {log.target}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={totalCount}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[10, 20, 50, 100]}
        />
      </TableContainer>
    </Box>
  );
}
