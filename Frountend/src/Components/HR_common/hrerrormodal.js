import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Lottie from 'react-lottie';
import animationData from '../animation/erroranimation.json';

const NoEmployeeModal = ({ open, handleClose, errorMessage }) => {
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
      onClose={handleClose}
      BackdropProps={{
        sx: {
          backdropFilter: "blur(5px)",
          backgroundColor: "rgba(0, 0, 0, 0.4)",
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
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          textAlign: 'center',
          border: '2px solid black',
        }}
      >
        <Lottie options={defaultOptions} height={150} width={150} />
        <Typography sx={{ mt: 2, fontWeight: 'bold' }}>
          {errorMessage}
        </Typography>
        <Button onClick={handleClose} sx={{ mt: 2 }} variant="contained" color="primary">
          Close
        </Button>
      </Box>
    </Modal>
  );
};

export default NoEmployeeModal;
