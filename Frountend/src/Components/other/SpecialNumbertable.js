// import React from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
// } from "@mui/material";
// import { styled } from "@mui/system";

// const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
//   maxHeight: 380,
// }));

// const StyledTableHead = styled(TableHead)(({ theme }) => ({
//   position: "sticky",
//   top: 0,
//   backgroundColor:
//     theme.palette.mode === "light" ? "#cfe8fc" : theme.palette.background.paper,
//   zIndex: theme.zIndex.appBar,
//   "& .MuiTableCell-root": {
//     fontWeight: "bold",
//   },
// }));

// const SpecialNumberTable = ({ specialNumberData, search }) => {
//   const filteredSpecialNumberData = specialNumberData.filter((data) => {
//     return (
//       data.specialNumber?.toLowerCase().includes(search.toLowerCase()) ||
//       data.employeeName?.toLowerCase().includes(search.toLowerCase()) ||
//       data.employeeCode?.toLowerCase().includes(search.toLowerCase()) ||
//       data.telecomPartner?.toLowerCase().includes(search.toLowerCase())
//     );
//   });

//   return (
//     <StyledTableContainer component={Paper}>
//       <Table>
//         <StyledTableHead>
//           <TableRow>
//             <TableCell>Special Number</TableCell>
//             <TableCell>Status</TableCell>
//             <TableCell>Employee Code</TableCell>
//             <TableCell>Employee Name</TableCell>
//             <TableCell>Telecom Partner</TableCell>
//             <TableCell>Recharge Plan</TableCell>
//             <TableCell>Assigned Date</TableCell>
//           </TableRow>
//         </StyledTableHead>
//         <TableBody>
//           {filteredSpecialNumberData.length > 0 ? (
//             filteredSpecialNumberData.map((data, index) => (
//               <TableRow key={index}>
//                 <TableCell>{data.cugNumber || "N/A"}</TableCell>
//                 <TableCell>{data.status || "N/A"}</TableCell>
//                 <TableCell>{data.employeeCode || "N/A"}</TableCell>
//                 <TableCell>{data.employeeName || "N/A"}</TableCell>
//                 <TableCell>{data.telecomPartner || "N/A"}</TableCell>
//                 <TableCell>{data.rechargePlan || "N/A"}</TableCell>
//                 <TableCell>
//                   {data.assignedDate
//                     ? new Date(data.assignedDate).toLocaleDateString()
//                     : "N/A"}
//                 </TableCell>
//               </TableRow>
//             ))
//           ) : (
//             <TableRow>
//               <TableCell colSpan={7} align="center">
//                 No matching records found.
//               </TableCell>
//             </TableRow>
//           )}
//         </TableBody>
//       </Table>
//     </StyledTableContainer>
//   );
// };

// export default SpecialNumberTable;







import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
} from "@mui/material";
import { styled } from "@mui/system";

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  maxHeight: 380,
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  position: "sticky",
  top: 0,
  backgroundColor:
    theme.palette.mode === "light" ? "#cfe8fc" : theme.palette.background.paper,
  zIndex: theme.zIndex.appBar,
  "& .MuiTableCell-root": {
    fontWeight: "bold",
  },
}));

const SpecialNumberTable = ({ specialNumberData, search }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const filteredSpecialNumberData = specialNumberData.filter((data) => {
    return (
      data.specialNumber?.toLowerCase().includes(search.toLowerCase()) ||
      data.employeeName?.toLowerCase().includes(search.toLowerCase()) ||
      data.employeeCode?.toLowerCase().includes(search.toLowerCase()) ||
      data.telecomPartner?.toLowerCase().includes(search.toLowerCase())
    );
  });

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page when rows per page changes
  };

  return (
    <StyledTableContainer component={Paper}>
      <Table>
        <StyledTableHead>
          <TableRow>
            <TableCell>Special Number</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Employee Code</TableCell>
            <TableCell>Employee Name</TableCell>
            <TableCell>Telecom Partner</TableCell>
            <TableCell>Recharge Plan</TableCell>
            <TableCell>Assigned Date</TableCell>
          </TableRow>
        </StyledTableHead>
        <TableBody>
          {filteredSpecialNumberData.length > 0 ? (
            filteredSpecialNumberData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((data, index) => (
                <TableRow key={index}>
                  <TableCell>{data.specialNumber || "N/A"}</TableCell>
                  <TableCell>{data.status || "N/A"}</TableCell>
                  <TableCell>{data.employeeCode || "N/A"}</TableCell>
                  <TableCell>{data.employeeName || "N/A"}</TableCell>
                  <TableCell>{data.telecomPartner || "N/A"}</TableCell>
                  <TableCell>{data.rechargePlan || "N/A"}</TableCell>
                  <TableCell>
                    {data.assignedDate
                      ? new Date(data.assignedDate).toLocaleDateString()
                      : "N/A"}
                  </TableCell>
                </TableRow>
              ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} align="center">
                No matching records found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination Component */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredSpecialNumberData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </StyledTableContainer>
  );
};

export default SpecialNumberTable;
