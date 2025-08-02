import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Tooltip, OverlayTrigger } from "react-bootstrap";
import { useTheme } from "@mui/material/styles";
import "./addrecordmodal.css";

const telecomPartners = ["Airtel", "Vi", "Jio"];

const UpdateModal = ({
  show,
  handleClose,
  record,
  handleChange,
  handleSave,
}) => {
  const [localRecord, setLocalRecord] = useState(record);
  const theme = useTheme();

  useEffect(() => {
    setLocalRecord(record);
  }, [record]);

  const handleFieldChange = (e) => {
    handleChange(e.target.name, e.target.value);
    setLocalRecord((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };


  const resetFields = () => {
    setLocalRecord({
      cugNumber: "",
      rechargePlan: "",
      status: "",
      employeeCode: "",
    });
  };

  const handleCloseModal = () => {
    resetFields();
    handleClose();
  };

  const employeeCodeInfo = (
    <Tooltip id="employeeCodeInfo">
      Enter those Employee Code
      <br />
      whose request is
      <br />
      Pending
    </Tooltip>
  );

  return (
    <Modal
      show={show}
      onHide={handleCloseModal}
      size="md"
      centered
      className="custom-modal"
      style={{ marginTop: "40px" }}
    >
      <Modal.Header
        closeButton
        style={{
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
        }}
      >
        <Modal.Title>Update Record</Modal.Title>
      </Modal.Header>
      <Modal.Body
        style={{
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          maxHeight: "60vh",
          overflowY: "auto",
        }}
      >
        <Form>
          <Form.Group className="mb-3" controlId="formTelecomPartner">
            <Form.Label>Telecom Partner</Form.Label>
            <Form.Control
              as="select"
              name="telecomPartner"
              value={localRecord.telecomPartner || ""}
              onChange={handleFieldChange}
              style={{
                backgroundColor: theme.palette.background.default,
                color: theme.palette.text.primary,
              }}
              disabled
            >
              <option value="" disabled>
                Select Telecom Partner
              </option>
              {telecomPartners.map((partner) => (
                <option key={partner} value={partner}>
                  {partner}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formIccid">
            <Form.Label>ICCID Number</Form.Label>
            <Form.Control
              type="text"
              name="iccidNumber"
              value={localRecord.iccidNumber || ""}
              onChange={handleFieldChange}
              style={{
                backgroundColor: theme.palette.background.default,
                color: theme.palette.text.primary,
              }}
              readOnly
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formImsi">
            <Form.Label>IMSI Number</Form.Label>
            <Form.Control
              type="text"
              name="imsiNumber"
              value={localRecord.imsiNumber || ""}
              onChange={handleFieldChange}
              style={{
                backgroundColor: theme.palette.background.default,
                color: theme.palette.text.primary,
              }}
              readOnly
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formImsi">
            <Form.Label>Telecom Circle</Form.Label>
            <Form.Control
              type="text"
              name="telecomCircle"
              value={localRecord.telecomCircle || ""}
              onChange={handleFieldChange}
              style={{
                backgroundColor: theme.palette.background.default,
                color: theme.palette.text.primary,
              }}
              readOnly
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formImsi">
            <Form.Label>Authorized Signatory</Form.Label>
            <Form.Control
              type="text"
              name="authosign"
              value={localRecord.authosign || ""}
              onChange={handleFieldChange}
              style={{
                backgroundColor: theme.palette.background.default,
                color: theme.palette.text.primary,
              }}
              readOnly
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formCugNumber">
            <Form.Label>CUG Number</Form.Label>
            <Form.Control
              type="text"
              name="cugNumber"
              value={localRecord.cugNumber || ""}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*$/.test(value)) {
                  handleFieldChange(e);
                }
              }}
              style={{
                backgroundColor: theme.palette.background.default,
                color: theme.palette.text.primary,
              }}
              maxLength={10}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formRechargePlan">
            <Form.Label>Recharge Plan</Form.Label>
            <Form.Control
              type="text"
              name="rechargePlan"
              value={localRecord.rechargePlan || ""}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*$/.test(value)) {
                  handleFieldChange(e);
                }
              }}
              style={{
                backgroundColor: theme.palette.background.default,
                color: theme.palette.text.primary,
              }}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formEmployeeCode">
            <Form.Label>
              Employee Code
              <OverlayTrigger placement="top" overlay={employeeCodeInfo}>
                <span className="info-icon">
                  <i
                    className="bi bi-info-circle"
                    style={{ color: "black" }}
                  ></i>
                </span>
              </OverlayTrigger>
            </Form.Label>
            <Form.Control
              type="text"
              name="employeeCode"
              value={localRecord.employeeCode || ""}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*$/.test(value)) {
                  handleFieldChange(e);
                }
              }}
              style={{
                backgroundColor: theme.palette.background.default,
                color: theme.palette.text.primary,
              }}
              maxLength={6}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer
        style={{
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Button variant="secondary" onClick={handleCloseModal}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UpdateModal;
