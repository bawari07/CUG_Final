import React from "react";
import { Modal, Button } from "react-bootstrap";
import { useTheme } from "@mui/material/styles";

function FullRemarkModal({ open, onClose, remarkText }) {
  const theme = useTheme();

  return (
    <Modal show={open} onHide={onClose} centered>
      <div
        style={{
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Full Remark</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div
            style={{
              maxHeight: "300px",
              overflowY: "auto",
              padding: "10px",
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: "5px",
              backgroundColor: theme.palette.background.default,
              color: theme.palette.text.primary,
            }}
          >
            {remarkText || "No remark provided."}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </Modal.Footer>
      </div>
    </Modal>
  );
}

export default FullRemarkModal;
