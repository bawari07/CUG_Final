import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Lottie from 'react-lottie';
import animationData from '../../animation/tickanimation.json'; 

const SuccessModal = ({ open, onClose }) => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };
  
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="success-modal-title"
      aria-describedby="success-modal-description"
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          p: 4,
          borderRadius: 2,
          boxShadow: 24,
          textAlign: 'center',
          border: '2px solid black',
        }}
      >
        <Lottie options={defaultOptions} height={150} width={150} />
        <Typography
          id="success-modal-title"
          sx={{ mt: 2, fontWeight: 'bold' }}
        >
          Swap Request Initiated successfully
        </Typography>
        <Button
          onClick={onClose}
          sx={{ mt: 2 }}
          variant="contained"
          color="primary"
        >
          Close
        </Button>
      </Box>
    </Modal>
  );
};

export default SuccessModal;
