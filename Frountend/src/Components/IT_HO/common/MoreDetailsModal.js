import React from 'react';
import { Modal, Button, Typography, Table, TableBody, TableCell, TableContainer, TableRow, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const MoreDetailsModal = ({ open, onClose, requestDetails }) => {
  const theme = useTheme();

  const details = [
    // { label: 'Region', value: requestDetails?.region },
    // { label: 'Branch', value: requestDetails?.branchLocation },
    { label: 'Department', value: requestDetails?.department },
    { label: 'Designation', value: requestDetails?.designation },
    { label: 'Personal Email', value: requestDetails?.personalEmail },
    { label: 'Personal Number', value: requestDetails?.personalNumber },
    { label: 'CUG NO', value: requestDetails?.cugNumber},
    { label: 'Home Address', value: requestDetails?.homeAddress },
    { label: 'DOB', value: requestDetails?.dob },
   
    { label: 'Aadhar Card', value: requestDetails?.aadharCardNumber },
    { label: 'Pan Card', value: requestDetails?.panCardNumber },
    { label: 'Pin Code', value: requestDetails?.pinCode },
    { label: 'OLD Cug Number', value: requestDetails?.oldUserCugNumber },
    { label: 'ICCID NO', value: requestDetails?.ICCIDNumber },
    { label: 'IMSI NO', value: requestDetails?.IMSINumber },
    { label: 'OLD User Employee Code', value: requestDetails?.oldUserEmployeeCode },
    { label: 'Remarks', value: requestDetails?.remarksByHR },
  ].filter(detail => detail.value);

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="more-details-modal-title"
      aria-describedby="more-details-modal-description"
    >
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '80%',
        maxWidth: 600,
        backgroundColor: theme.palette.background.paper,
        padding: '20px',
        boxShadow: theme.shadows[24],
        borderRadius: theme.shape.borderRadius,
      }}>
        <Typography
          variant="h6"
          id="more-details-modal-title"
          style={{ marginBottom: '20px', color: theme.palette.text.primary }}
        >
          User Details
        </Typography>
        <TableContainer
          component={Paper}
          style={{
            maxHeight: 400,
            marginBottom: '20px',
            backgroundColor: theme.palette.background.paper,
            borderColor: theme.palette.divider,
          }}
        >
          <Table>
            <TableBody>
              {details.map((detail, index) => (
                <TableRow key={index}>
                  <TableCell style={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
                    {detail.label}
                  </TableCell>
                  <TableCell style={{ color: theme.palette.text.primary}}>
                    {detail.value}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Button
          variant="contained"
          color="primary"
          onClick={onClose}
          style={{ marginTop: '10px' }}
        >
          Close
        </Button>
      </div>
    </Modal>
  );
};

export default MoreDetailsModal;