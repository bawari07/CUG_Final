import React, { useEffect } from "react";
import { Modal, Button, Form, Container, Row, Col } from "react-bootstrap";
import { useTheme } from "@mui/material/styles";

const RequestInitiationModal = ({
  open,
  onClose,
  onSubmit,
  employeeCode,
  setEmployeeCode,
  oldEmployeeCode,
  oldEmployeeName,
  simId,
  remarksByHR,
  setRemark, 
}) => {
  const theme = useTheme();

  const resetFields = () => {
    setEmployeeCode("");
    setRemark("");
  };

  useEffect(() => {
    if (!open) {
      resetFields();
    }
  }, [open]);

  const handleSubmit = () => {
    onSubmit(employeeCode, remarksByHR); 
    onClose();
  };

  return (
    <Modal show={open} onHide={onClose} centered>
      <div style={{ backgroundColor: theme.palette.background.paper }}>
        <Modal.Header closeButton>
          <Modal.Title>Request Initiation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Form>
              <Form.Group as={Row} controlId="formSimId" className="mt-3">
                <Form.Label
                  style={{ color: theme.palette.text.primary }}
                  column
                  sm={4}
                >
                  SIM ID
                </Form.Label>
                <Col sm={8}>
                  <Form.Control type="text" value={simId} readOnly />
                </Col>
              </Form.Group>
              <Form.Group
                as={Row}
                controlId="formOldEmployeeCode"
                className="mt-3"
              >
                <Form.Label
                  style={{ color: theme.palette.text.primary }}
                  column
                  sm={4}
                >
                  Old Employee Code
                </Form.Label>
                <Col sm={8}>
                  <Form.Control type="text" value={oldEmployeeCode} readOnly />
                </Col>
              </Form.Group>
              <Form.Group
                as={Row}
                controlId="formOldEmployeeName"
                className="mt-3"
              >
                <Form.Label
                  style={{ color: theme.palette.text.primary }}
                  column
                  sm={4}
                >
                  Old Employee Name
                </Form.Label>
                <Col sm={8}>
                  <Form.Control type="text" value={oldEmployeeName} readOnly />
                </Col>
              </Form.Group>
              <Form.Group
                as={Row}
                controlId="formEmployeeCode"
                className="mt-3"
              >
                <Form.Label
                  style={{ color: theme.palette.text.primary }}
                  column
                  sm={4}
                >
                  Employee Code
                </Form.Label>
                <Col sm={8}>
                  <Form.Control
                    type="text"
                    // new code
                    // maxLength="6"
                    maxLength="10"
                    value={employeeCode}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*$/.test(value)) {
                        setEmployeeCode(value);
                      }
                    }}
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} controlId="formRemark" className="mt-3">
                <Form.Label
                  style={{ color: theme.palette.text.primary }}
                  column
                  sm={4}
                >
                  Remark
                </Form.Label>
                <Col sm={8}>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={remarksByHR}
                    onChange={(e) => setRemark(e.target.value)} 
                  />
                </Col>
              </Form.Group>
            </Form>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </Modal.Footer>
      </div>
    </Modal>
  );
};

export default RequestInitiationModal;
