import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useTheme } from '@mui/material/styles';
import "./addrecordmodal.css"; 

const ErrorModal = ({ show, handleClose, message, isError }) => {
  const theme = useTheme();
  
  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="md"
      centered
      className="custom-modal" 
    >
      <Modal.Header
        closeButton
        style={{
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
        }}
      >
        <Modal.Title>{isError ? 'Error' : 'Success'}</Modal.Title>
      </Modal.Header>
      <Modal.Body
        style={{
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
        }}
      >
        {message}
      </Modal.Body>
      <Modal.Footer
        style={{
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ErrorModal;
