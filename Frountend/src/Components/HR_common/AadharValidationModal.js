import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Alert,
} from "@mui/material";

function AadharValidationModal({
  open,
  onClose,
  onManualEntry,
  fetchedAadhar,
}) {
  const hasInvalidAadhar = fetchedAadhar && fetchedAadhar.length > 0;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{ bgcolor: "warning.light", color: "warning.contrastText" }}
      >
        {hasInvalidAadhar ? "Invalid Aadhar Number" : "Aadhar Number Required"}
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          {hasInvalidAadhar
            ? "The Aadhar number fetched from the database is invalid."
            : "No Aadhar number was found in the HRone database."}
        </Alert>

        {hasInvalidAadhar && (
          <Typography variant="body1" gutterBottom>
            <strong>Fetched Aadhar:</strong> {fetchedAadhar}
            <Typography variant="caption" color="error" sx={{ ml: 1 }}>
              (Expected: 12 digits)
            </Typography>
          </Typography>
        )}

        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          You must enter a valid 12-digit Aadhar number to proceed.
        </Typography>

        <Alert severity="info" sx={{ mt: 2 }}>
          Please click "Enter Manually" to provide the correct Aadhar number.
        </Alert>
      </DialogContent>
      <DialogActions>
        {/* Remove Cancel button - make it mandatory */}
        <Button
          onClick={onManualEntry}
          variant="contained"
          color="primary"
          sx={{ width: "100%" }}
        >
          Enter Aadhar Manually
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AadharValidationModal;
