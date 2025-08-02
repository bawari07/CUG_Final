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
//   TablePagination,
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

// const RequestTable = ({ requests, selectedStatus }) => {
//   const [expandedRows, setExpandedRows] = useState({});
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);

//   const toggleRow = (index) => {
//     setExpandedRows((prevState) => ({
//       ...prevState,
//       [index]: !prevState[index],
//     }));
//   };

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   const paginatedRequests = requests.slice(
//     page * rowsPerPage,
//     page * rowsPerPage + rowsPerPage
//   );

//   return (
//     <>
//       <StyledTableContainer component={Paper}>
//         <Table>
//           <StyledTableHead>
//             <TableRow>
//               <TableCell sx={{ fontWeight: "bold" }}>Employee</TableCell>
//               <TableCell sx={{ fontWeight: "bold" }}>Designation</TableCell>
//               <TableCell sx={{ fontWeight: "bold" }}>Department</TableCell>
//               <TableCell sx={{ fontWeight: "bold" }}>Request Type</TableCell>
//               <TableCell sx={{ fontWeight: "bold" }}>Branch</TableCell>
//               <TableCell sx={{ fontWeight: "bold" }}>Region</TableCell>
//               {/* <TableCell sx={{ fontWeight: "bold" }}>TAT</TableCell> */}

//               {selectedStatus !== "ongoing" && (
//                 <TableCell sx={{ fontWeight: "bold" }}>Remark</TableCell>
//               )}
//               <TableCell sx={{ fontWeight: "bold" }}>More details</TableCell>
//             </TableRow>
//           </StyledTableHead>
//           <TableBody>
//             {paginatedRequests.map((request, index) => (
//               <React.Fragment key={index}>
//                 <TableRow>
//                   <TableCell>{`${request.employeeCode} - ${request.employeeName}`}</TableCell>
//                   <TableCell>{request.designation}</TableCell>
//                   <TableCell>{request.department}</TableCell>
//                   <TableCell>{request.requestType}</TableCell>
//                   <TableCell>{request.branchLocation}</TableCell>
//                   <TableCell>{request.region}</TableCell>
//                   {selectedStatus !== "ongoing" && (
//                     <TableCell>
//                       {selectedStatus === "pending" && request.remarksByHR}
//                       {selectedStatus === "completed" && request.remarksByIT}
//                     </TableCell>
//                   )}
//                   <TableCell>
//                     <IconButton onClick={() => toggleRow(index)}>
//                       {expandedRows[index] ? (
//                         <ExpandLessIcon />
//                       ) : (
//                         <ExpandMoreIcon />
//                       )}
//                     </IconButton>
//                   </TableCell>
//                 </TableRow>
//                 <TableRow>
//                   <TableCell
//                     style={{ paddingBottom: 0, paddingTop: 0 }}
//                     colSpan={7}
//                   >
//                     <Collapse
//                       in={expandedRows[index]}
//                       timeout="auto"
//                       unmountOnExit
//                     >
//                       <Box margin={1}>
//                         <Typography
//                           variant="subtitle1"
//                           gutterBottom
//                           component="div"
//                         >
//                           More Details
//                         </Typography>
//                         <StyledMoreDetailsTable size="small">
//                           <TableBody>
//                             <TableRow>
//                               {/* new code */}
//                               {/* <TableCell sx={{ fontWeight: "bold" }}>
//                                 ICCID NO
//                               </TableCell>
//                               <TableCell sx={{ fontWeight: "bold" }}>
//                                 IMSI NO
//                               </TableCell> */}
//                               {selectedStatus === "ongoing" && (
//                                 <TableCell sx={{ fontWeight: "bold" }}>
//                                   ICCID NO
//                                 </TableCell>
//                               )}
//                               {selectedStatus === "ongoing" && (
//                                 <TableCell sx={{ fontWeight: "bold" }}>
//                                   IMSI NO
//                                 </TableCell>
//                               )}
//                               {selectedStatus === "ongoing" && (
//                                 <TableCell sx={{ fontWeight: "bold" }}>
//                                   Aadhar NO
//                                 </TableCell>
//                               )}

//                               <TableCell sx={{ fontWeight: "bold" }}>
//                                 Requested Date
//                               </TableCell>
//                               <TableCell sx={{ fontWeight: "bold" }}>
//                                 DOB
//                               </TableCell>
//                               <TableCell sx={{ fontWeight: "bold" }}>
//                                 Personal Email
//                               </TableCell>
//                               <TableCell sx={{ fontWeight: "bold" }}>
//                                 Personal Number
//                               </TableCell>
//                               <TableCell sx={{ fontWeight: "bold" }}>
//                                 SIM Allocation Type
//                               </TableCell>
//                               <TableCell sx={{ fontWeight: "bold" }}>
//                                 Request Status
//                               </TableCell>
//                               <TableCell sx={{ fontWeight: "bold" }}>
//                                 Requested By
//                               </TableCell>

//                               {selectedStatus === "completed" && (
//                                 <TableCell sx={{ fontWeight: "bold" }}>
//                                   CUG Number
//                                 </TableCell>
//                               )}
//                               {selectedStatus === "completed" && (
//                                 <TableCell sx={{ fontWeight: "bold" }}>
//                                   Completed By
//                                 </TableCell>
//                               )}
//                             </TableRow>
//                             <TableRow>
//                               {/* NEW CODE */}
//                               {/* <TableCell>{request.iccidNumber || "N/A"}</TableCell>
//                               <TableCell>{request.imsiNumber || "N/A" }</TableCell> */}

//                               {selectedStatus === "ongoing" && (
//                                 <TableCell>
//                                   {request.iccidNumber || "N/A"}
//                                 </TableCell>
//                               )}
//                               {selectedStatus === "ongoing" && (
//                                 <TableCell>
//                                   {request.imsiNumber || "N/A"}
//                                 </TableCell>
//                               )}
//                               {selectedStatus === "ongoing" && (
//                                 <TableCell>
//                                   {request.aadharCardNumber || "N/A"}
//                                 </TableCell>
//                               )}

//                               <TableCell>
//                                 {new Date(
//                                   request.requestedDate
//                                 ).toLocaleDateString()}
//                               </TableCell>
//                               <TableCell>
//                                 {new Date(request.DOB).toLocaleDateString()}
//                               </TableCell>
//                               <TableCell>{request.personalEmail}</TableCell>
//                               <TableCell>{request.personalNumber}</TableCell>
//                               <TableCell>
//                                 {request.SIMALLOCATIONTYPE || "N/A"}
//                               </TableCell>
//                               <TableCell>{request.requestStatus}</TableCell>
//                               <TableCell>{`${request.requestedByEmployeeCode}/${request.requestedByName}`}</TableCell>

//                               {selectedStatus === "completed" && (
//                                 <TableCell>
//                                   {request.cugNumber || "N/A"}
//                                 </TableCell>
//                               )}
//                               {selectedStatus === "completed" && (
//                                 <TableCell>
//                                   {request.requestCompletedByEmployeeCode
//                                     ? `${
//                                         request.requestCompletedByEmployeeCode
//                                       }/${
//                                         request.requestCompletedByName || "N/A"
//                                       }`
//                                     : "N/A"}
//                                 </TableCell>
//                               )}
//                             </TableRow>
//                           </TableBody>
//                         </StyledMoreDetailsTable>
//                       </Box>
//                     </Collapse>
//                   </TableCell>
//                 </TableRow>
//               </React.Fragment>
//             ))}
//           </TableBody>
//         </Table>
//       </StyledTableContainer>
//       <TablePagination
//         rowsPerPageOptions={[5, 10, 15]}
//         component="div"
//         count={requests.length}
//         rowsPerPage={rowsPerPage}
//         page={page}
//         onPageChange={handleChangePage}
//         onRowsPerPageChange={handleChangeRowsPerPage}
//       />
//     </>
//   );
// };

// export default RequestTable;

// new code for current changes for TAT

import React, { useState, useEffect } from "react";
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

const RequestTable = ({ requests, selectedStatus }) => {
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

  const paginatedRequests = requests.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
// new change ---
  const calculateDaysSinceRequest = (requestDate) => {
    const today = new Date();
    const requestDateObj = new Date(requestDate);
    const diffTime = Math.abs(today - requestDateObj);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <>
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
              <TableCell sx={{ fontWeight: "bold" }}>TAT</TableCell>
              {selectedStatus !== "ongoing" && (
                <TableCell sx={{ fontWeight: "bold" }}>Remark</TableCell>
              )}
              <TableCell sx={{ fontWeight: "bold" }}>More details</TableCell>
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {paginatedRequests.map((request, index) => {
              const daysSinceRequest = calculateDaysSinceRequest(request.requestedDate);
              const textColor =
                (selectedStatus === "pending" && daysSinceRequest > 3) ||
                (selectedStatus === "ongoing" && daysSinceRequest > 6)
                  ? selectedStatus === "pending"
                    ? "red"
                    : "blue"
                  : "";

              return (
                <React.Fragment key={index}>
                  <TableRow>
                    <TableCell style={{ color: textColor }}>
                      {`${request.employeeCode} - ${request.employeeName}`}
                    </TableCell>
                    <TableCell>{request.designation}</TableCell>
                    <TableCell>{request.department}</TableCell>
                    <TableCell>{request.requestType}</TableCell>
                    <TableCell>{request.branchLocation}</TableCell>
                    <TableCell>{request.region}</TableCell>
                    <TableCell style={{ color: textColor }}>
                      {daysSinceRequest} days
                    </TableCell>
                    {selectedStatus !== "ongoing" && (
                      <TableCell>
                        {selectedStatus === "pending" && request.remarksByHR}
                        {selectedStatus === "completed" && request.remarksByIT}
                      </TableCell>
                    )}
                    <TableCell>
                      <IconButton onClick={() => toggleRow(index)}>
                        {expandedRows[index] ? (
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
                      colSpan={7}
                    >
                      <Collapse
                        in={expandedRows[index]}
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
                                {selectedStatus === "ongoing" && (
                                  <TableCell sx={{ fontWeight: "bold" }}>
                                    ICCID NO
                                  </TableCell>
                                )}
                                {selectedStatus === "ongoing" && (
                                  <TableCell sx={{ fontWeight: "bold" }}>
                                    IMSI NO
                                  </TableCell>
                                )}
                                {selectedStatus === "ongoing" && (
                                  <TableCell sx={{ fontWeight: "bold" }}>
                                    Aadhar NO
                                  </TableCell>
                                )}
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
                                <TableCell sx={{ fontWeight: "bold" }}>
                                  SIM Allocation Type
                                </TableCell>
                                <TableCell sx={{ fontWeight: "bold" }}>
                                  Request Status
                                </TableCell>
                                <TableCell sx={{ fontWeight: "bold" }}>
                                  Requested By
                                </TableCell>
                                {selectedStatus === "completed" && (
                                  <TableCell sx={{ fontWeight: "bold" }}>
                                    CUG Number
                                  </TableCell>
                                )}
                                {selectedStatus === "completed" && (
                                  <TableCell sx={{ fontWeight: "bold" }}>
                                    Completed By
                                  </TableCell>
                                )}
                              </TableRow>
                              <TableRow>
                                {selectedStatus === "ongoing" && (
                                  <TableCell>
                                    {request.iccidNumber || "N/A"}
                                  </TableCell>
                                )}
                                {selectedStatus === "ongoing" && (
                                  <TableCell>
                                    {request.imsiNumber || "N/A"}
                                  </TableCell>
                                )}
                                {selectedStatus === "ongoing" && (
                                  <TableCell>
                                    {request.aadharCardNumber || "N/A"}
                                  </TableCell>
                                )}
                                <TableCell>
                                  {new Date(
                                    request.requestedDate
                                  ).toLocaleDateString('en-GB')}
                                </TableCell>
                                <TableCell>
                                  {new Date(request.DOB).toLocaleDateString('en-GB')}
                                </TableCell>
                                <TableCell>{request.personalEmail}</TableCell>
                                <TableCell>{request.personalNumber}</TableCell>
                                <TableCell>
                                  {request.SIMALLOCATIONTYPE || "N/A"}
                                </TableCell>
                                <TableCell>{request.requestStatus}</TableCell>
                                <TableCell>{`${request.requestedByEmployeeCode}/${request.requestedByName}`}</TableCell>
                                {selectedStatus === "completed" && (
                                  <TableCell>
                                    {request.cugNumber || "N/A"}
                                  </TableCell>
                                )}
                                {selectedStatus === "completed" && (
                                  <TableCell>
                                    {request.requestCompletedByEmployeeCode
                                      ? `${
                                          request.requestCompletedByEmployeeCode
                                        }/${
                                          request.requestCompletedByName || "N/A"
                                        }`
                                      : "N/A"}
                                  </TableCell>
                                )}
                              </TableRow>
                            </TableBody>
                          </StyledMoreDetailsTable>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              );
            })}
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
    </>
  );
};

export default RequestTable;

