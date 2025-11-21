// Reusable Loading Spinner Component
import { Box, CircularProgress, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { memo } from "react";

/**
 * Loading spinner component with optional text
 * @param {string} text - Optional loading text to display
 * @param {string} size - Size of the spinner: 'small', 'medium', 'large'
 */
const LoadingSpinner = memo(({ text = "Loading...", size = "medium" }) => {
  const sizeMap = {
    small: 30,
    medium: 40,
    large: 60,
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "50vh",
        gap: 2,
      }}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <CircularProgress size={sizeMap[size]} />
      {text && (
        <Typography variant="body2" color="text.secondary">
          {text}
        </Typography>
      )}
    </Box>
  );
});

LoadingSpinner.displayName = "LoadingSpinner";

LoadingSpinner.propTypes = {
  text: PropTypes.string,
  size: PropTypes.oneOf(["small", "medium", "large"]),
};

export default LoadingSpinner;
