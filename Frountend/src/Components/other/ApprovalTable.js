// import React, { useState } from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   IconButton,
//   Collapse,
//   Typography,
//   Box,
// } from "@mui/material";
// import { styled } from "@mui/system";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import ExpandLessIcon from "@mui/icons-material/ExpandLess";

// const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
//   maxHeight: 380,
// }));

// const StyledTableHead = styled(TableHead)(({ theme }) => ({
//   position: "sticky",
//   top: 0,
//   backgroundColor:
//     theme.palette.mode === "light" ? "#cfe8fc" : theme.palette.background.paper,
//   zIndex: theme.zIndex.appBar,
// }));

// const StyledMoreDetailsTable = styled(Table)(({ theme }) => ({
//   borderCollapse: "separate",
//   borderSpacing: "0",
//   border: `1px solid ${theme.palette.divider}`,
//   "& th, & td": {
//     border: `1px solid ${theme.palette.divider}`,
//   },
// }));

// const ApprovalRequestTable = ({ requests }) => {
//     console.log(requests);
//   const [expandedRows, setExpandedRows] = useState({});

//   const toggleRow = (index) => {
//     setExpandedRows((prevState) => ({
//       ...prevState,
//       [index]: !prevState[index],
//     }));
//   };

//   return (
//     <StyledTableContainer component={Paper}>
//       <Table>
//         <StyledTableHead>
//           <TableRow>
//             <TableCell sx={{ fontWeight: "bold" }}>Employee</TableCell>
//             <TableCell sx={{ fontWeight: "bold" }}>Designation</TableCell>
//             <TableCell sx={{ fontWeight: "bold" }}>Department</TableCell>
//             <TableCell sx={{ fontWeight: "bold" }}>Request Type</TableCell>
//             <TableCell sx={{ fontWeight: "bold" }}>Branch</TableCell>
//             <TableCell sx={{ fontWeight: "bold" }}>Region</TableCell>
//             <TableCell sx={{ fontWeight: "bold" }}>Approval Remarks</TableCell>
//             <TableCell sx={{ fontWeight: "bold" }}>More Details</TableCell>
//           </TableRow>
//         </StyledTableHead>
//         <TableBody>
//           {requests.map((request, index) => (
//             <React.Fragment key={index}>
//               <TableRow>
//                 <TableCell>{`${request.employeeCode} - ${request.employeeName}`}</TableCell>
//                 <TableCell>{request.designation}</TableCell>
//                 <TableCell>{request.department}</TableCell>
//                 <TableCell>{request.requestType}</TableCell>
//                 <TableCell>{request.branchLocation}</TableCell>
//                 <TableCell>{request.region}</TableCell>
//                 <TableCell>{request.approvalRemarks || "N/A"}</TableCell>
//                 <TableCell>
//                   <IconButton onClick={() => toggleRow(index)}>
//                     {expandedRows[index] ? (
//                       <ExpandLessIcon />
//                     ) : (
//                       <ExpandMoreIcon />
//                     )}
//                   </IconButton>
//                 </TableCell>
//               </TableRow>
//               <TableRow>
//                 <TableCell
//                   style={{ paddingBottom: 0, paddingTop: 0 }}
//                   colSpan={8}
//                 >
//                   <Collapse
//                     in={expandedRows[index]}
//                     timeout="auto"
//                     unmountOnExit
//                   >
//                     <Box margin={1}>
//                       <Typography
//                         variant="subtitle1"
//                         gutterBottom
//                         component="div"
//                       >
//                         More Details
//                       </Typography>
//                       <StyledMoreDetailsTable size="small">
//                         <TableBody>
//                           <TableRow>
//                             <TableCell sx={{ fontWeight: "bold" }}>
//                               Requested Date
//                             </TableCell>
//                             <TableCell sx={{ fontWeight: "bold" }}>DOB</TableCell>
//                             <TableCell sx={{ fontWeight: "bold" }}>
//                               Personal Email
//                             </TableCell>
//                             <TableCell sx={{ fontWeight: "bold" }}>
//                               Personal Number
//                             </TableCell>
//                             <TableCell sx={{ fontWeight: "bold" }}>
//                               SIM Allocation Type
//                             </TableCell>
//                             <TableCell sx={{ fontWeight: "bold" }}>
//                               Request Status
//                             </TableCell>
//                             <TableCell sx={{ fontWeight: "bold" }}>
//                               Requested By
//                             </TableCell>
//                           </TableRow>
//                           <TableRow>
//                             <TableCell>
//                               {new Date(
//                                 request.requestedDate
//                               ).toLocaleDateString()}
//                             </TableCell>
//                             <TableCell>
//                               {new Date(request.DOB).toLocaleDateString()}
//                             </TableCell>
//                             <TableCell>{request.personalEmail}</TableCell>
//                             <TableCell>{request.personalNumber}</TableCell>
//                             <TableCell>
//                               {request.SIMALLOCATIONTYPE || "N/A"}
//                             </TableCell>
//                             <TableCell>{request.requestStatus}</TableCell>
//                             <TableCell>{`${request.requestedByEmployeeCode}/${request.requestedByName}`}</TableCell>
//                           </TableRow>
//                         </TableBody>
//                       </StyledMoreDetailsTable>
//                     </Box>
//                   </Collapse>
//                 </TableCell>
//               </TableRow>
//             </React.Fragment>
//           ))}
//         </TableBody>
//       </Table>
//     </StyledTableContainer>
//   );
// };

// export default ApprovalRequestTable;










import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Collapse,
  Typography,
  Box,
  TablePagination, // Import pagination component
} from "@mui/material";
import { styled } from "@mui/system";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  maxHeight: 380,
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  position: "sticky",
  top: 0,
  backgroundColor:
    theme.palette.mode === "light" ? "#cfe8fc" : theme.palette.background.paper,
  zIndex: theme.zIndex.appBar,
}));

const StyledMoreDetailsTable = styled(Table)(({ theme }) => ({
  borderCollapse: "separate",
  borderSpacing: "0",
  border: `1px solid ${theme.palette.divider}`,
  "& th, & td": {
    border: `1px solid ${theme.palette.divider}`,
  },
}));

const ApprovalRequestTable = ({ requests }) => {
  const [expandedRows, setExpandedRows] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Default to 5 rows per page

  const toggleRow = (index) => {
    setExpandedRows((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to the first page
  };

  return (
    <StyledTableContainer component={Paper}>
      <Table>
        <StyledTableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold" }}>Employee</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Designation</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Department</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Request Type</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Branch</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Region</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Approval Remarks</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>More Details</TableCell>
          </TableRow>
        </StyledTableHead>
        <TableBody>
          {requests
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((request, index) => (
              <React.Fragment key={index}>
                <TableRow>
                  <TableCell>{`${request.employeeCode} - ${request.employeeName}`}</TableCell>
                  <TableCell>{request.designation}</TableCell>
                  <TableCell>{request.department}</TableCell>
                  <TableCell>{request.requestType}</TableCell>
                  <TableCell>{request.branchLocation}</TableCell>
                  <TableCell>{request.region}</TableCell>
                  <TableCell>{request.approvalRemarks || "N/A"}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => toggleRow(index)}>
                      {expandedRows[index] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
                    <Collapse in={expandedRows[index]} timeout="auto" unmountOnExit>
                      <Box margin={1}>
                        <Typography variant="subtitle1" gutterBottom component="div">
                          More Details
                        </Typography>
                        <StyledMoreDetailsTable size="small">
                          <TableBody>
                            <TableRow>
                              <TableCell sx={{ fontWeight: "bold" }}>Requested Date</TableCell>
                              <TableCell sx={{ fontWeight: "bold" }}>DOB</TableCell>
                              <TableCell sx={{ fontWeight: "bold" }}>Personal Email</TableCell>
                              <TableCell sx={{ fontWeight: "bold" }}>Personal Number</TableCell>
                              <TableCell sx={{ fontWeight: "bold" }}>SIM Allocation Type</TableCell>
                              <TableCell sx={{ fontWeight: "bold" }}>Request Status</TableCell>
                              <TableCell sx={{ fontWeight: "bold" }}>Requested By</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>{new Date(request.requestedDate).toLocaleDateString('en-GB')}</TableCell>
                              <TableCell>{new Date(request.DOB).toLocaleDateString('en-GB')}</TableCell>
                              <TableCell>{request.personalEmail}</TableCell>
                              <TableCell>{request.personalNumber}</TableCell>
                              <TableCell>{request.SIMALLOCATIONTYPE || "N/A"}</TableCell>
                              <TableCell>{request.requestStatus}</TableCell>
                              <TableCell>{`${request.requestedByEmployeeCode}/${request.requestedByName}`}</TableCell>
                            </TableRow>
                          </TableBody>
                        </StyledMoreDetailsTable>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]} // Options for rows per page
        component="div"
        count={requests.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </StyledTableContainer>
  );
};

export default ApprovalRequestTable;
