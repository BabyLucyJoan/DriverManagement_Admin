const Unauthorized = () => (
  <Box sx={{ p: 3, textAlign: "center" }}>
    <Typography variant="h5" color="error">
      403 - Unauthorized
    </Typography>
    <Typography>You don't have permission to access this page.</Typography>
  </Box>
);

export default Unauthorized;
