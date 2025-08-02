import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col,Alert } from "react-bootstrap";
import { useTheme } from '@mui/material/styles';

function SubmitDetailsDeactivationmodal({
  open,
  onClose,
  onSubmit,
  requestId,
  remarksByIT,
  setRemark
}) {
  const theme = useTheme();
  const [error, setError] = useState('');
  
  useEffect(() => {
    if (open) {
      setRemark('');
      setError('');
    }
  }, [open]);

  const handleSubmit = () => {
    if (!remarksByIT.trim()) {
      setError('Remark is required.');
      return;
    }
    const formData = new FormData();
    formData.append("requestID", requestId);
    formData.append("remarksByIT", remarksByIT);

    onSubmit(formData);
  };

  const handleRemarkChange = (e) => {
    setRemark(e.target.value);
    setError(''); 
  };

  const handleClose = () => {
    setRemark('');
    setError('');
    onClose();
  };

  return (
    <Modal show={open} onHide={handleClose} centered>
      <div
        style={{
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Submit Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group as={Row} controlId="formReqID" className="mt-3">
              <Form.Label
                column
                sm={4}
                style={{ color: theme.palette.text.primary }}
              >
                ReqID
              </Form.Label>
              <Col sm={8}>
                <Form.Control type="text" value={requestId} readOnly />
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="formRemark" className="mt-3">
              <Form.Label
                column
                sm={4}
                style={{ color: theme.palette.text.primary }}
              >
                Remark
              </Form.Label>
              <Col sm={8}>
                <Form.Control
                  type="text"
                  value={remarksByIT}
                  onChange={handleRemarkChange}
                  isInvalid={!!error}
                />
                <Form.Control.Feedback type="invalid">
                  {error}
                </Form.Control.Feedback>
              </Col>
            </Form.Group>
            {error && (
              <Alert variant="danger" className="mt-3">
                {error}
              </Alert>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleSubmit}>
            Submit
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
        </Modal.Footer>
      </div>
    </Modal>
  );
}

export default SubmitDetailsDeactivationmodal;
