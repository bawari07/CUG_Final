import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col, Alert } from "react-bootstrap";
import { useTheme } from "@mui/material/styles";

function SubmitDetailsModal({
  open,
  onClose,
  onSubmit,
  requestId,
  employeeCode,
  remarksByIT,
  setRemark
}) {
  const theme = useTheme();
  const [error, setError] = useState("");
  const [rechargePlan, setRechargePlan] = useState("");

  useEffect(() => {
    if (open) {
      setError("");
      setRechargePlan("");
    }
  }, [open]);

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("requestID", requestId);
    formData.append("employeeCode", employeeCode);
    formData.append("rechargePlan", rechargePlan);
    formData.append("remarksByIT", remarksByIT);

    console.log("FormData Content:", Array.from(formData.entries()));
    onSubmit(formData);
  };

  const handleClose = () => {
    onClose();
  };

  const handleRechargePlanChange = (event) => {
    setRechargePlan(event.target.value);
  };

  return (
    <Modal show={open} onHide={handleClose} centered>
      <div style={{ backgroundColor: theme.palette.background.paper }}>
        <Modal.Header closeButton>
          <Modal.Title>Submit Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group as={Row} controlId="formReqID">
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
            <Form.Group as={Row} controlId="formEmployeeCode" className="mt-3">
              <Form.Label
                column
                sm={4}
                style={{ color: theme.palette.text.primary }}
              >
                Employee Code
              </Form.Label>
              <Col sm={8}>
                <Form.Control type="text" value={employeeCode} readOnly />
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="rechargePlan" className="mt-3">
              <Form.Label
                column
                sm={4}
                style={{ color: theme.palette.text.primary }}
              >
                Recharge Plan
              </Form.Label>
              <Col sm={8}>
                <Form.Control
                  type="text"
                  value={rechargePlan}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value)) {
                      handleRechargePlanChange(e);
                    }
                  }}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="formRemarksByIT" className="mt-3">
              <Form.Label
                column
                sm={4}      
                style={{ color: theme.palette.text.primary }}
              >
                Remarks 
              </Form.Label>
              <Col sm={8}>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={remarksByIT}
                  onChange={(e) => setRemark(e.target.value)}
                />
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

export default SubmitDetailsModal;
