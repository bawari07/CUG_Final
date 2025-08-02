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

// const AllTable = ({ requests }) => {
//   const [expandedRows, setExpandedRows] = useState({});

//   const toggleRow = (index) => {
//     setExpandedRows((prevState) => ({
//       ...prevState,
//       [index]: !prevState[index],
//     }));
//   };

//   return (
//     <StyledTableContainer component={Paper}>
//       <Table stickyHeader>
//         <StyledTableHead>
//           <TableRow>
//             <TableCell sx={{ fontWeight: "bold" }}>Employee</TableCell>
//             <TableCell sx={{ fontWeight: "bold" }}>Designation</TableCell>
//             <TableCell sx={{ fontWeight: "bold" }}>Department</TableCell>
//             <TableCell sx={{ fontWeight: "bold" }}>Request Type</TableCell>
//             <TableCell sx={{ fontWeight: "bold" }}>Branch</TableCell>
//             <TableCell sx={{ fontWeight: "bold" }}>Region</TableCell>
//             <TableCell sx={{ fontWeight: "bold" }}>Request Status</TableCell>
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
//                 <TableCell>{request.requestStatus}</TableCell>

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
//                             <TableCell sx={{ fontWeight: "bold" }}>
//                               DOB
//                             </TableCell>
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
//                               Completed By
//                             </TableCell>
//                             <TableCell sx={{ fontWeight: "bold" }}>
//                               Assigned Date
//                             </TableCell>
//                             <TableCell sx={{ fontWeight: "bold" }}>
//                               Request Date
//                             </TableCell>
//                             <TableCell sx={{ fontWeight: "bold" }}>
//                               request completed Date
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
//                             <TableCell>
//                               {request.personalEmail || "N/A"}
//                             </TableCell>
//                             <TableCell>
//                               {request.personalNumber || "N/A"}
//                             </TableCell>
//                             <TableCell>
//                               {request.SIMALLOCATIONTYPE || "N/A"}
//                             </TableCell>
//                             <TableCell>
//                               {request.requestCompletedByEmployeeCode
//                                 ? `${request.requestCompletedByEmployeeCode}/${
//                                     request.requestCompletedByName || "N/A"
//                                   }`
//                                 : "N/A"}
//                             </TableCell>
//                             <TableCell>
//                               {request.assignedDate || "N/A"}
//                             </TableCell>
//                             <TableCell>
//                               {request.requestedDate || "N/A"}
//                             </TableCell>
//                             <TableCell>
//                               {request.requestCompletedDate || "N/A"}
//                             </TableCell>
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

// export default AllTable;

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
  TablePagination,
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

const AllTable = ({ requests }) => {
  const [expandedRows, setExpandedRows] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

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
    setPage(0);
  };

  // Slice the requests array based on the current page and rows per page
  const paginatedRequests = requests.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Paper>
      <StyledTableContainer>
        <Table stickyHeader>
          <StyledTableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Employee</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Designation</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Department</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Request Type</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Branch</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Region</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Request Status</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>More Details</TableCell>
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {paginatedRequests.map((request, index) => (
              <React.Fragment key={index}>
                <TableRow>
                  <TableCell>{`${request.employeeCode} - ${request.employeeName}`}</TableCell>
                  <TableCell>{request.designation}</TableCell>
                  <TableCell>{request.department}</TableCell>
                  <TableCell>{request.requestType}</TableCell>
                  <TableCell>{request.branchLocation}</TableCell>
                  <TableCell>{request.region}</TableCell>
                  <TableCell>{request.requestStatus}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => toggleRow(index + page * rowsPerPage)}
                    >
                      {expandedRows[index + page * rowsPerPage] ? (
                        <ExpandLessIcon />
                      ) : (
                        <ExpandMoreIcon />
                      )}
                    </IconButton>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                    colSpan={8}
                  >
                    <Collapse
                      in={expandedRows[index + page * rowsPerPage]}
                      timeout="auto"
                      unmountOnExit
                    >
                      <Box margin={1}>
                        <Typography
                          variant="subtitle1"
                          gutterBottom
                          component="div"
                        >
                          More Details
                        </Typography>
                        <StyledMoreDetailsTable size="small">
                          <TableBody>
                            <TableRow>
                              <TableCell sx={{ fontWeight: "bold" }}>
                                Requested Date
                              </TableCell>
                              <TableCell sx={{ fontWeight: "bold" }}>
                                DOB
                              </TableCell>
                              <TableCell sx={{ fontWeight: "bold" }}>
                                Personal Email
                              </TableCell>
                              <TableCell sx={{ fontWeight: "bold" }}>
                                Personal Number
                              </TableCell>

                              {/* new code */}
                              {/* <TableCell sx={{ fontWeight: "bold" }}>
                                ICCID NO
                              </TableCell>
                              <TableCell sx={{ fontWeight: "bold" }}>
                                IMSI NO
                              </TableCell> */}



                              <TableCell sx={{ fontWeight: "bold" }}>
                                SIM Allocation Type
                              </TableCell>
                              <TableCell sx={{ fontWeight: "bold" }}>
                                Completed By
                              </TableCell>
                              <TableCell sx={{ fontWeight: "bold" }}>
                                Assigned Date
                              </TableCell>
                              <TableCell sx={{ fontWeight: "bold" }}>
                                Request Date
                              </TableCell>
                              <TableCell sx={{ fontWeight: "bold" }}>
                                request completed Date
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>
                                {new Date(
                                  request.requestedDate
                                ).toLocaleDateString('en-GB')}
                              </TableCell>
                              <TableCell>
                                {new Date(request.DOB).toLocaleDateString('en-GB')}
                              </TableCell>
                              <TableCell>
                                {request.personalEmail || "N/A"}
                              </TableCell>
                              <TableCell>
                                {request.personalNumber || "N/A"}
                              </TableCell>

                              {/* new code */}
                              {/* <TableCell>
                                {request.iccidNumber || "N/A"}
                              </TableCell>
                              <TableCell>
                                {request.imsiNumber || "N/A"}
                              </TableCell> */}


                              <TableCell>
                                {request.SIMALLOCATIONTYPE || "N/A"}
                              </TableCell>
                              <TableCell>
                                {request.requestCompletedByEmployeeCode
                                  ? `${
                                      request.requestCompletedByEmployeeCode
                                    }/${
                                      request.requestCompletedByName || "N/A"
                                    }`
                                  : "N/A"}
                              </TableCell>
                              <TableCell>
                                {request.assignedDate || "N/A"}
                              </TableCell>
                              <TableCell>
                                {request.requestedDate || "N/A"}
                              </TableCell>
                              <TableCell>
                                {request.requestCompletedDate || "N/A"}
                              </TableCell>
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
      </StyledTableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 15]}
        component="div"
        count={requests.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default AllTable;
