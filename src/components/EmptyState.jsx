// Reusable Empty State Component
import { Box, Typography, Button } from "@mui/material";
import PropTypes from "prop-types";
import { memo } from "react";

/**
 * Empty state component for tables and lists
 * @param {string} message - Message to display
 * @param {string} actionText - Optional action button text
 * @param {function} onAction - Optional action button handler
 * @param {ReactNode} icon - Optional icon component
 */
const EmptyState = memo(({ message, actionText, onAction, icon }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: 6,
        px: 2,
      }}
    >
      {icon && (
        <Box sx={{ mb: 2, opacity: 0.5 }}>
          {icon}
        </Box>
      )}
      <Typography variant="body1" color="text.secondary" gutterBottom>
        {message}
      </Typography>
      {actionText && onAction && (
        <Button
          variant="contained"
          onClick={onAction}
          sx={{ mt: 2 }}
        >
          {actionText}
        </Button>
      )}
    </Box>
  );
});

EmptyState.displayName = "EmptyState";

EmptyState.propTypes = {
  message: PropTypes.string.isRequired,
  actionText: PropTypes.string,
  onAction: PropTypes.func,
  icon: PropTypes.node,
};

export default EmptyState;
