import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useTheme } from "@mui/material/styles";
import "./addrecordmodal.css";

const telecomPartners = ["Airtel", "Vi", "Jio"];

const AddRecordModal = ({
  show,
  handleClose,
  newRecord = {},
  setNewRecord,
  handleSaveNewRecord,
}) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  const [isFormValid, setIsFormValid] = useState(false);
  const [iccidError, setIccidError] = useState("");

  useEffect(() => {
    const {
      telecomPartner = "",
      iccidNumber = "",
      imsiNumber = "",
      telecomCircle = "",
    } = newRecord;
    if (
      telecomPartner &&
      iccidNumber.length === 20 &&
      imsiNumber &&
      telecomCircle
    ) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [newRecord]);

  // const handleNumericInput = (e, field) => {
  //   const value = e.target.value;
  //   if (/^\d*$/.test(value)) {
  //     setNewRecord({ ...newRecord, [field]: value });
  //     if (field === "iccidNumber" && value.length !== 20) {
  //       setIccidError("ICCID number must be exactly 20 digits.");
  //     } else {
  //       setIccidError("");
  //     }
  //   }
  // };

  const handleNumericInput = (e, field) => {
    const value = e.target.value;
    if (/^[0-9a-zA-Z]*$/.test(value)) { // Allow digits and alphabetic characters
      setNewRecord({ ...newRecord, [field]: value });
      if (field === "iccidNumber" && value.length !== 20) {
        setIccidError("ICCID number must be exactly 20 characters.");
      } else {
        setIccidError("");
      }
    }
  };

  
  return (
    <Modal
      show={show}
      onHide={handleClose}
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
        <Modal.Title>Add New Record</Modal.Title>
      </Modal.Header>
      <Modal.Body
        style={{
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
        }}
      >
        <Form>
          <Form.Group className="mb-3" controlId="formTelecomPartner">
            <Form.Label>
              Telecom Partner <span style={{ color: "red" }}>*</span>
            </Form.Label>
            {/* This is the comment   */}
            <Form.Control
              as="select"
              value={newRecord.telecomPartner || ""}
              onChange={(e) =>
                setNewRecord({ ...newRecord, telecomPartner: e.target.value })
              }
              style={{
                backgroundColor: theme.palette.background.default,
                color: theme.palette.text.primary,
              }}
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
            <Form.Label>
              ICCID Number  <span style={{ color: "red" }}>*</span>
            </Form.Label>
            <Form.Control
              type="text"
              value={newRecord.iccidNumber || ""}
              onChange={(e) => handleNumericInput(e, "iccidNumber")}
              maxLength={20}
              style={{
                backgroundColor: theme.palette.background.default,
                color: theme.palette.text.primary,
              }}
            />
            {iccidError && (
              <Form.Text className="text-danger">{iccidError}</Form.Text>
            )}
          </Form.Group>

          <Form.Group className="mb-3" controlId="formImsi">
            <Form.Label>
              IMSI Number <span style={{ color: "red" }}>*</span>
            </Form.Label>
            <Form.Control
              type="text"
              value={newRecord.imsiNumber || ""}
              onChange={(e) => handleNumericInput(e, "imsiNumber")}
              style={{
                backgroundColor: theme.palette.background.default,
                color: theme.palette.text.primary,
              }}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formteleCircle">
            <Form.Label>
              Telecom Circle <span style={{ color: "red" }}>*</span>
            </Form.Label>
            <Form.Control
              type="text"
              value={newRecord.telecomCircle || ""}
              onChange={(e) =>
                setNewRecord({ ...newRecord, telecomCircle: e.target.value })
              }
              style={{
                backgroundColor: theme.palette.background.default,
                color: theme.palette.text.primary,
              }}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer
        style={{
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button
          variant="primary"
          onClick={handleSaveNewRecord}
          disabled={!isFormValid}
        >
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddRecordModal;
