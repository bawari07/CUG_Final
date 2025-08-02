import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  AppBar,
  Toolbar,
  Typography,
  CssBaseline,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import {
  excelupload,
  bulkRequest,
  bulkUpload,
  bulkupdate,
} from "../../../Services/Api";
import AddRecordModal from "../Bulk upload/addrecordmodal";
import SidebarIt from "../../Sidebar/SidebarIt";
import UpdateModal from "../Bulk upload/updaterecordmodal";
import ErrorModal from "../Bulk upload/errormodal";
import BulkUploadGrid from "../Bulk upload/Bulkuploadgrid";
import ThemeToggle from "../../other/themetoggle";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import * as XLSX from "xlsx";

const BulkUpload = () => {
  const [rows, setRows] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [newRecord, setNewRecord] = useState({});
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [requestsError, setRequestsError] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [currentRecord, setCurrentRecord] = useState({});
  const [modalMessage, setModalMessage] = useState("");
  const [isModalError, setIsModalError] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [excelFile, setExcelFile] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState("");

  const getNextId = () => {
    return rows.length > 0 ? Math.max(...rows.map((row) => row.id)) + 1 : 1;
  };

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? "dark" : "light",
          primary: {
            main: darkMode ? "#f78c6c" : "#1976d2",
          },
          secondary: {
            main: darkMode ? "#82b1ff" : "#e3f2fd",
          },
          background: {
            default: darkMode ? "#1e1e1e" : "#e3f2fd",
            paper: darkMode ? "#282c34" : "#ffffff",
          },
          text: {
            primary: darkMode ? "#dcdcdc" : "#000",
            secondary: darkMode ? "#9cdcfe" : "#555",
          },
          action: {
            hover: darkMode
              ? "rgba(255, 255, 255, 0.08)"
              : "rgba(0, 0, 0, 0.08)",
          },
          divider: darkMode ? "#444" : "#ccc",
        },
        typography: {
          fontFamily: "'Fira Code', monospace",
        },
      }),
    [darkMode]
  );

  const fetchAllRequests = async () => {
    try {
      setLoadingRequests(true);
      const requestsResponse = await bulkRequest({});
      console.log("Requests Response:", requestsResponse);
  
      if (Array.isArray(requestsResponse)) {
        const data = requestsResponse.map((item, index) => ({
          id: index + 1,
          telecomPartner: item.telecomPartner,
          iccidNumber: item.iccidNumber,
          imsiNumber: item.imsiNumber,
          telecomCircle: item.telecomCircle,
          authosign: item.insertedBy,
          cugNumber: item.simNumber,
          rechargePlan: item.rechargePlan,
          employeeCode: item.employeeCode || "",
          Status: item.status || "",
        }));
  
        data.sort((a, b) => {
          if (a.Status === "Available" && b.Status !== "Available") return -1;
          if (a.Status !== "Available" && b.Status === "Available") return 1;
          return 0; 
        });
  
        console.log("Mapped Data:", data);
        setRows(data);
      } else {
        setRequestsError("Failed to load requests");
        setModalMessage("Failed to load requests");
        setIsModalError(true);
        setShowErrorModal(true);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setRows([]);
      } else {
        setRequestsError("Failed to load requests");
        setModalMessage("Failed to load requests");
        setIsModalError(true);
        setShowErrorModal(true);
      }
    } finally {
      setLoadingRequests(false);
    }
  };
  

  useEffect(() => {
    fetchAllRequests();

    const fetchInterval = 1000;
    const intervalId = setInterval(() => {
      fetchAllRequests();
    }, fetchInterval);

    return () => clearInterval(intervalId);
  }, []);

  const handleSaveNewRecord = async () => {
    const newId = getNextId();
    const fullRecord = { ...newRecord, id: newId };

    try {
      const data = {
        simID: fullRecord.id,
        simNumber: fullRecord.iccidNumber || "",
        iccidNumber: fullRecord.iccidNumber || "",
        imsiNumber: fullRecord.imsiNumber || "",
        telecomCircle: fullRecord.telecomCircle || "",
        telecomPartner: fullRecord.telecomPartner || "",
        rechargePlan: fullRecord.rechargePlan || "",
        employeeCode: fullRecord.employeeCode || "",
      };

      const response = await bulkUpload(data);
      setModalMessage("Record saved successfully!");
      setIsModalError(false);
      setShowErrorModal(true);
      handleCloseDialog();
    } catch (error) {
      setModalMessage("Error during record saving.");
      setIsModalError(true);
      setShowErrorModal(true);
    }
  };

  const handleOpenUpdateModal = (record) => {
    setCurrentRecord(record);
    setShowUpdateDialog(true);
  };

  const handleUpdateRecord = async () => {
    try {
      const data = {
        simID: currentRecord.id,
        cugNumber: currentRecord.cugNumber || "",
        iccidNumber: currentRecord.iccidNumber || "",
        imsiNumber: currentRecord.imsiNumber || "",
        telecomCircle: currentRecord.telecomCircle || "",
        rechargePlan: currentRecord.rechargePlan || "",
        employeeCode: currentRecord.employeeCode || "",
      };

      const response = await bulkupdate(data);
      setModalMessage("Record updated successfully!");
      setIsModalError(false);
      setShowErrorModal(true);

      handleCloseDialog();
      fetchAllRequests();
    } catch (error) {
      console.error("Error during bulk update:", error);
    }
  };

  const handleUpdateChange = (field, value) => {
    setCurrentRecord((prevRecord) => ({
      ...prevRecord,
      [field]: value,
    }));
  };

  const handleAddRecord = () => {
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setShowUpdateDialog(false);
    setNewRecord({});
    clearPreview();
  };

  const handleCellEditCommit = (params) => {
    const updatedRows = rows.map((row) =>
      row.id === params.id ? { ...row, [params.field]: params.value } : row
    );
    setRows(updatedRows);
  };

  const handleSaveAsCsv = () => {
    let filteredRows = rows;
    if (selectedPartner) {
      filteredRows = rows.filter(
        (row) => row.telecomPartner === selectedPartner
      );
    }
    const headers = [
      "S.No",
      "Telecom Partner",
      "ICCID Number",
      "IMSI Number",
      "Status",
      "Telecom Circle",
      "Authorized Signatory",
    ];
    const csvData = [
      headers.join(","),
      ...filteredRows.map((row, index) =>
        [
          index + 1,
          row.telecomPartner,
          `${row.iccidNumber}`,
          `${row.imsiNumber}`,
          row.Status,
          row.telecomCircle,
          row.authosign,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "bulk_upload_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExcelFileChange = (event) => {
    const file = event.target.files[0];
    setExcelFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const binaryStr = e.target.result;
        const workbook = XLSX.read(binaryStr, { type: "binary" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        setPreviewData(jsonData);
        openPreviewModal();
      };
      reader.readAsBinaryString(file);
    }
  };

  const openPreviewModal = () => {
    setPreviewOpen(true);
  };

  const closePreviewModal = () => {
    setPreviewOpen(false);
    setPreviewData([]);
    setExcelFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUploadExcel = async () => {
    if (!excelFile) {
      setModalMessage("Please select a file first.");
      setIsModalError(true);
      setShowErrorModal(true);
      closePreviewModal();
      return;
    }

    const formData = new FormData();
    formData.append("excelFile", excelFile);
    
    try {
      const response = await excelupload(formData);
      setRows((prevRows) => [...prevRows, ...response]);
      setModalMessage("File uploaded successfully!");
      setIsModalError(false);
      setShowErrorModal(true);
      fetchAllRequests();
      clearPreview();
    } catch (error) {
      setModalMessage("Error uploading the file.");
      setIsModalError(true);
      setShowErrorModal(true);
    } finally {
      closePreviewModal();
    }
  };

  const fileInputRef = React.useRef(null);
  const clearPreview = () => {
    setPreviewData([]);
    setExcelFile(null);
    setPreviewOpen(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDownloadExcelTemplate = () => {
    const headers = [
      { header: "iccidNumber", key: "iccidNumber", width: 80, type: "text" },
      { header: "imsiNumber", key: "imsiNumber", width: 80, type: "text" },
      {
        header: "telecomPartner",
        key: "telecomPartner",
        width: 80,
        type: "text",
      },
      { header: "telecomCircle", key: "telecomCircle", width: 80 },
    ];

    const data = [];

    const ws = XLSX.utils.aoa_to_sheet([
      headers.map((h) => ({ v: h.header, t: "s" })),
    ]);

    XLSX.utils.sheet_add_aoa(
      ws,
      data.map((row) => row.map((cell) => ({ v: cell, t: "s" }))),
      { origin: -1 },
      { bookType: "xlsx", type: "text" }
    );

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template", {
      bookType: "xlsx",
      type: "text",
    });

    XLSX.writeFile(wb, "bulk_upload_template.xlsx", {
      bookType: "xlsx",
      type: "text",
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          backgroundColor:
            theme.palette.mode === "dark" ? "#1a1a1a" : "#003366",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, textAlign: "center" }}
          >
            Bulk Upload
          </Typography>
          <IconButton color="inherit">
            <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          display: "flex",
          minHeight: "100vh",
          backgroundColor: theme.palette.background.default,
          paddingTop: "64px",
        }}
      >
        {sidebarOpen && <SidebarIt />}

        <Box sx={{ flexGrow: 1, padding: 1, overflowX: "auto" }}>
          <Paper
            elevation={3}
            sx={{
              padding: 3,
              backgroundColor: theme.palette.background.paper,
              border: `2px solid ${theme.palette.primary.main}`,
              borderRadius: "8px",
              boxShadow:
                "0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)",
              height: "calc(97vh - 64px)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 2,
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <IconButton
                onClick={handleAddRecord}
                color="primary"
                aria-label="add"
              >
                <AddIcon />
              </IconButton>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 2,
                  flexGrow: 1,
                }}
              >
                <Button
                  onClick={handleDownloadExcelTemplate}
                  color="primary"
                  variant="contained"
                  startIcon={<FileDownloadIcon />}
                >
                  Template
                </Button>

                <Button
                  variant="contained"
                  component="label"
                  color="primary"
                  startIcon={<UploadFileIcon />}
                >
                  Upload Excel
                  <input
                    type="file"
                    accept=".xlsx"
                    hidden
                    ref={fileInputRef}
                    onChange={handleExcelFileChange}
                  />
                </Button>
                <IconButton
                  onClick={handleSaveAsCsv}
                  color="primary"
                  aria-label="download"
                >
                  <FileDownloadIcon />
                </IconButton>
              </Box>
            </Box>
            <BulkUploadGrid
              rows={rows}
              handleOpenUpdateModal={handleOpenUpdateModal}
              handleCellEditCommit={handleCellEditCommit}
              selectedPartner={selectedPartner}
              setSelectedPartner={setSelectedPartner}
            />
          </Paper>
        </Box>
      </Box>
      <Dialog
        open={previewOpen}
        onClose={closePreviewModal}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>Excel Preview</DialogTitle>
        <CloseIcon
          onClick={closePreviewModal}
          style={{ position: "absolute", right: 8, top: 8 }}
        ></CloseIcon>
        <DialogContent>
          {previewData.length > 0 ? (
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                position: "relative",
              }}
            >
              <thead>
                <tr
                  style={{
                    position: "sticky",
                    top: 0,
                    backgroundColor: theme.palette.background.paper,
                    zIndex: 1,
                  }}
                >
                  {Object.keys(previewData[0]).map((key) => (
                    <th
                      key={key}
                      style={{ border: "1px solid #ccc", padding: "8px" }}
                    >
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewData.map((row, index) => (
                  <tr key={index}>
                    {Object.values(row).map((value, idx) => (
                      <td
                        key={idx}
                        style={{ border: "1px solid #ccc", padding: "8px" }}
                      >
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <Typography>No data to preview.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            onClick={handleUploadExcel}
            variant="contained"
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      <AddRecordModal
        show={showDialog}
        handleClose={handleCloseDialog}
        newRecord={newRecord}
        setNewRecord={setNewRecord}
        handleSaveNewRecord={handleSaveNewRecord}
      />
      <UpdateModal
        show={showUpdateDialog}
        handleClose={handleCloseDialog}
        record={currentRecord}
        handleChange={handleUpdateChange}
        handleSave={handleUpdateRecord}
      />
      <ErrorModal
        show={showErrorModal}
        handleClose={() => setShowErrorModal(false)}
        message={modalMessage}
        isError={isModalError}
      />
    </ThemeProvider>
  );
};

export default BulkUpload;
