import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';

export default function ErrorDialog({ open, handleClose, errorMessages }) {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      sx={{
        backdropFilter: 'blur(3px)', 
        '& .MuiPaper-root': {
          border: '1px solid black',  
        },
      }}
    >
      <DialogTitle>Error</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {errorMessages.map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
