import React from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useTheme } from '@mui/material/styles';

const DateFilter = ({
  showFilterModal,
  handleClose,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  handleFilterApply,
}) => {

  const theme = useTheme();

  return (
    <Modal show={showFilterModal} onHide={handleClose} centered>
      <div style={{
      backgroundColor: theme.palette.background.paper,

      }}>
      <Modal.Header closeButton>
        <Modal.Title>Filter by Date</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="startDate">
            <Form.Label style={{ color: theme.palette.text.primary }}>Start Date</Form.Label>
            <Form.Control
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mb-3"
            />
          </Form.Group>
          <Form.Group controlId="endDate">
            <Form.Label style={{ color: theme.palette.text.primary }}>End Date</Form.Label>
            <Form.Control
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleFilterApply}>
          Apply
        </Button>
      </Modal.Footer>
      </div>
    </Modal>
  );
};

export default DateFilter;