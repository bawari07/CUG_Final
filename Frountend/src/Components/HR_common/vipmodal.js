import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

const VipModal = ({ open, onClose, onYes }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      BackdropProps={{
        sx: {
          backdropFilter: 'blur(5px)',
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
        },
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          height: 200,
          bgcolor: 'background.paper',
          boxShadow: 40,
          p: 4,
          borderRadius: 2,
          textAlign: 'center',
          border: '2px solid black',
        }}
      >
        <Typography sx={{ mt: 2, fontWeight: 'bold' }}>
          Are you sure you want to generate a request for a VIP number?
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button onClick={onYes} variant="contained" color="primary">
            Yes
          </Button>
          <Button
            onClick={onClose}
            sx={{ ml: 2 }} 
            variant="contained"
            color="error" 
          >
            No
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default VipModal;
