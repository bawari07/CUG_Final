import React from "react";
import { Modal, Button } from "react-bootstrap";

function HrMoreDetails({ show, handleClose, currentRequest }) {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>User Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <table className="table table-bordered">
          <tbody>
            <tr>
              <th>Region</th>
              <td>{currentRequest?.region || "null"}</td>
            </tr>
            <tr>
              <th>Branch</th>
              <td>{currentRequest?.branchLocation || "null"}</td>
            </tr>
            <tr>
              <th>Personal Number</th>
              <td>{currentRequest?.personalNumber || "null"}</td>
            </tr>
            <tr>
              <th>Designation</th>
              <td>{currentRequest?.designation || "null"}</td>
            </tr>
            <tr>
              <th>Department</th>
              <td>{currentRequest?.department || "null"}</td>
            </tr>
            <tr>
              <th>Request Type</th>
              <td>{currentRequest?.requestType || "null"}</td>
            </tr>
          </tbody>
        </table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default HrMoreDetails;
