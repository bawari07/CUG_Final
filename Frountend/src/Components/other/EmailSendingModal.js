// import React from 'react';
// import Modal from '@mui/material/Modal';
// import Box from '@mui/material/Box';
// import Typography from '@mui/material/Typography';
// import Lottie from 'react-lottie';
// import animationData from '../animation/emailanimation.json';

// const EmailSendingModal = ({ open, onClose }) => {
//   const handleClose = (event) => {
//     event.stopPropagation(); 
//   };

//   const defaultOptions = {
//     loop: true,
//     autoplay: true,
//     animationData: animationData,
//     rendererSettings: {
//       preserveAspectRatio: 'xMidYMid slice',
//     },
//   };

//   return (
//     <Modal
//       open={open}
//       onClose={handleClose}  
//       BackdropProps={{
//         style: {
//           backgroundColor: 'rgba(0, 0, 0, 0.5)',
//           backdropFilter: 'blur(4px)',
//         },
//       }}
//     >
//       <Box
//         sx={{
//           position: 'absolute',
//           top: '50%',
//           left: '50%',
//           transform: 'translate(-50%, -50%)',
//           width: 400,
//           bgcolor: 'background.paper',
//           boxShadow: 24,
//           p: 4,
//           borderRadius: 2,
//           textAlign: 'center',
//           border: '2px solid black',
//         }}
//       >
//         <Lottie options={defaultOptions} height={150} width={150} /> 
//         <Typography sx={{ mt: 2, fontWeight: 'bold' }}>
//           Sending email
//         </Typography>
//         <Typography sx={{ mt: 2 }}>
//           Please wait... The modal will close automatically once the email is sent successfully.
//         </Typography>
//       </Box>
//     </Modal>
//   );
// };

// export default EmailSendingModal;
