import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

export default function WarningModal({ open, onClose, onConfirm ,status}) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="h6">Employee Not Active</Typography>
      </DialogTitle>
      <DialogContent>
        <Typography>
          Warning: The employee status is  <strong>{status}</strong>. Are you sure you want to move forward?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={onConfirm} color="primary" variant="contained">
          Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
}
