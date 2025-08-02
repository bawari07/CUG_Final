import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Lottie from 'react-lottie';
import animationData from '../animation/oopsanimation.json'; 

const LoginErrorModal = ({ open, onClose }) => {
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
      BackdropProps={{
        style: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)', 
          backdropFilter: 'blur(8px)', 
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
          bgcolor: '#ADD8E6', 
          boxShadow: 50,
          p: 4,
          borderRadius: 2,
          textAlign: 'center',
          border: '3px solid black',
          border: 'none', 
          boxShadow: '0 0 10px 3px red', 
          animation: 'blink 1.5s infinite', 
          '@keyframes blink': { 
            '0%': { boxShadow: '0 0 5px 2px red' },
            '50%': { boxShadow: '0 0 5px 2px rgba(255, 0, 0, 0.5)' },
            '100%': { boxShadow: '0 0 5px 2px red' },
          },
        }}
      >
        <Lottie options={defaultOptions} height={150} width={150} />
        <Typography sx={{ mt: 2, fontWeight: 'bold', color: 'red' }}>
          Wrong credentials! Please relogin.
        </Typography>
        <Button onClick={onClose} sx={{ mt: 2 }} variant="contained" color="error">
          Close
        </Button>
      </Box>
    </Modal>
  );
};

export default LoginErrorModal;
