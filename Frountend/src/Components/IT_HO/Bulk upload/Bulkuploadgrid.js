import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  Select,
  MenuItem,
  Button,
  InputLabel,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

const telecomPartners = ["Airtel", "Vi", "Jio"];

const BulkUploadGrid = ({
  rows,
  handleOpenUpdateModal,
  selectedPartner,
  setSelectedPartner,
}) => {
  const filteredRows = selectedPartner
    ? rows.filter((row) => row.telecomPartner === selectedPartner)
    : rows;

  return (
    <TableContainer component={Paper} sx={{ maxHeight: 390 }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold" }}>Sr.No</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>
              <FormControl size="small" sx={{ minWidth: 110 }}>
                <InputLabel>Telecom</InputLabel>
                <Select
                  value={selectedPartner}
                  onChange={(e) => setSelectedPartner(e.target.value)}
                  label="Telecom"
                >
                  <MenuItem value="">
                    <em>All</em>
                  </MenuItem>
                  {telecomPartners.map((partner) => (
                    <MenuItem key={partner} value={partner}>
                      {partner}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>ICCID Number</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>IMSI Number</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Telecom Circle</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>
              Authorized Signatory
            </TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Update</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredRows.map((row, index) => (
             console.log(row),
            <TableRow key={row.id}>
              <TableCell>{index + 1} </TableCell>
              <TableCell>{row.telecomPartner}</TableCell>
              <TableCell>
                <input
                  type="text"
                  value={row.iccidNumber || ""}
                  readOnly
                  style={{ width: "170px" }}
                />
              </TableCell>
              <TableCell>
                <input
                  type="text"
                  value={row.imsiNumber || ""}
                  readOnly
                  style={{ width: "140px" }}
                />
              </TableCell>
              <TableCell>
                <input
                  type="text"
                  value={row.Status || ""}
                  readOnly
                  style={{ width: "100px" }}
                />
              </TableCell>
              <TableCell>
                <input
                  type="text"
                  value={row.telecomCircle || ""}
                  readOnly
                  style={{ width: "110px" }}
                />
              </TableCell>
              <TableCell>
                <input
                  type="text"
                  value={row.authosign || ""}
                  readOnly
                  style={{ width: "160px" }}
                />
              </TableCell>
              <TableCell>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => handleOpenUpdateModal(row)}
                >
                  <EditIcon />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default BulkUploadGrid;
