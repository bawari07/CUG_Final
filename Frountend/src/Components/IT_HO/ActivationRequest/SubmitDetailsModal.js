import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Alert } from 'react-bootstrap';
import { useTheme } from '@mui/material/styles';

function SubmitDetailsModal({
  open,
  onClose,
  onSubmit,
  rechargePlan,
  CUG_number,
  setCUGNumber,
  setRechargePlan,
  requestId,
  remarksByIT,
  setRemark,
}) {

  const theme = useTheme();
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setCUGNumber('');
      setRechargePlan('');
      setError('');
      setRemark('')
    }
  }, [open, setCUGNumber, setRechargePlan]);

  const handleSubmit = () => {
    if (!CUG_number || CUG_number.length !== 10 || isNaN(CUG_number)) {
      setError('CUG Number must be exactly 10 digits.');
      return;
    }
    if (!rechargePlan || isNaN(rechargePlan)) {
      setError('Recharge Plan must be numeric.');
      return;
    }
    if (!remarksByIT.trim()) {
      setError('Remark is required.')
      return
    }

    const formData = new FormData();
    formData.append('ReqID', requestId);
    formData.append('CUG_Number', CUG_number);
    formData.append('Recharge_Plan', rechargePlan);
    formData.append('remarksByIT', remarksByIT); 

    onSubmit(formData);
  };

  const handleClose = () => {
    setCUGNumber('');
    setRechargePlan('');
    setError('');
    setRemark('')
    onClose();
  };

  const handleCUGNumberChange = (e) => {
    const value = e.target.value;
    if (value.length <= 10 && /^\d*$/.test(value)) { 
      setCUGNumber(value);
      setError(''); 
    }
  };

  const handleRechargePlanChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setRechargePlan(value);
      setError('');
    }
  };

  const handleRemarkChange = (e) => {
    setRemark(e.target.value)
    setError('')
  };

  return (
    <Modal show={open} onHide={handleClose} centered>
      <div style={{
        backgroundColor: theme.palette.background.paper,
      }}>
        <Modal.Header closeButton>
          <Modal.Title>Submit Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group as={Row} controlId="formReqID">
              <Form.Label column sm={4} style={{ color: theme.palette.text.primary }}>
                ReqID
              </Form.Label>
              <Col sm={8}>
                <Form.Control type="text" value={requestId} readOnly />
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="cugNumber" className="mt-3">
              <Form.Label column sm={4} style={{ color: theme.palette.text.primary }}>
                CUG Number
              </Form.Label>
              <Col sm={8}>
                <Form.Control
                  type="text"
                  value={CUG_number}
                  onChange={handleCUGNumberChange}
                  isInvalid={!!error && CUG_number.length !== 10}
                />
                <Form.Control.Feedback type="invalid">
                  CUG Number must be exactly 10 digits.
                </Form.Control.Feedback>
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="rechargePlan" className="mt-3">
              <Form.Label column sm={4} style={{ color: theme.palette.text.primary }}>
                Recharge Plan
              </Form.Label>
              <Col sm={8}>
                <Form.Control
                  type="text"
                  value={rechargePlan}
                  onChange={handleRechargePlanChange}
                  isInvalid={!!error && isNaN(rechargePlan)}
                />
                <Form.Control.Feedback type="invalid">
                  Recharge Plan must be numeric.
                </Form.Control.Feedback>
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="remark" className="mt-3">
              <Form.Label column sm={4} style={{ color: theme.palette.text.primary }}>
                Remark
              </Form.Label>
              <Col sm={8}>
                <Form.Control
                  type="text"
                  value={remarksByIT}
                  onChange={handleRemarkChange}
                  isInvalid={!!error && !remarksByIT.trim()}
                />
                <Form.Control.Feedback type="invalid">Remark is required.</Form.Control.Feedback>
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
          <Button variant="primary" onClick={handleSubmit} disabled={!!error}>
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

export default SubmitDetailsModal;
