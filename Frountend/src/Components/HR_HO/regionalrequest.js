import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getRegionalRequests, approveRequest } from "../../Services/Api";
import SidebarIt from "../Sidebar/SidebarHr";
import MoreDetailsModal from "../IT_HO/common/MoreDetailsModal";
import { Typography, AppBar, Toolbar, Box } from "@mui/material";
import {
  TextField,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { FaCheck, FaTimes } from "react-icons/fa";
import { MdInfo } from "react-icons/md";
import { Button } from "react-bootstrap";
import DateFilter from "../IT_HO/common/DateFilter";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import ThemeToggle from "../other/themetoggle";
import { FaCalendarAlt } from "react-icons/fa";
import { BiReset } from "react-icons/bi";
import SuccessModal from "./successmodal";

function RegionalRequests() {
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [requestsError, setRequestsError] = useState(null);
  const [currentRequest, setCurrentRequest] = useState(null);
  const [showMoreDetailsModal, setShowMoreDetailsModal] = useState(false);
  const [currentRequestDetails, setCurrentRequestDetails] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [requests, setRequests] = useState([]);
  const [approvalRemarks, setApprovalRemarks] = useState("");
  const [remarksError, setRemarksError] = useState(false);

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

  const navigate = useNavigate();

  const fetchAllRequests = async () => {
    try {
      setLoadingRequests(true);
      const requestsResponse = await getRegionalRequests();
      const requestsWithIds = requestsResponse.data.map((request, index) => ({
        ...request,
        id: `${request.employeeCode}-${request.requestType}-${index}`,
      }));
      setRequests(requestsWithIds);
      setFilteredRequests(requestsWithIds);
    } catch (error) {
      console.error("Error fetching all requests:", error);
      setRequestsError("Failed to load requests");
      setShowErrorModal(true);
    } finally {
      setLoadingRequests(false);
    }
  };

  useEffect(() => {
    fetchAllRequests();
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleCloseFilterModal = () => {
    setShowFilterModal(false);
  };

  const filteredRows = filteredRequests
    .filter(
      (request) =>
        request.employeeCode
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        request.employeeName
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        request.requestedBy
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        request.requestType
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        request.region?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.branchLocation
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        request.department?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.designation?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .map((request, index) => ({
      ...request,
      srNo: index + 1,
    }));

  const handleMoreDetails = (request) => {
    setCurrentRequestDetails(request);
    setShowMoreDetailsModal(true);
  };

  const handleFilterApply = () => {
    const filtered = filteredRequests.filter((request) => {
      const requestDate = new Date(request.requestedDate);
      const start = startDate
        ? new Date(new Date(startDate).setHours(0, 0, 0, 0))
        : null;
      const end = endDate
        ? new Date(new Date(endDate).setHours(23, 59, 59, 999))
        : null;
      return (!start || requestDate >= start) && (!end || requestDate <= end);
    });
    setFilteredRequests(filtered);
    setShowFilterModal(false);
  };

  const handleFilterIconClick = () => {
    setShowFilterModal(true);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setStartDate("");
    setEndDate("");
    fetchAllRequests();
  };

  const handleConfirmAction = async () => {
    if (!approvalRemarks.trim()) {
      setRemarksError(true);
      return;
    }
    if (currentAction) {
      const { action, request } = currentAction;
      try {
        const response = await approveRequest(
          request.employeeCode,
          request.requestType,
          action === "allow" ? "Approve" : "Deny",
          approvalRemarks
        );
        console.log(
          `Request ${action === "allow" ? "approved" : "denied"}:`,
          response
        );

        const updatedRequests = requests.filter((r) => r.id !== request.id);
        setRequests(updatedRequests);
        setFilteredRequests(updatedRequests);

        setSuccessMessage(
          `Request successfully ${action === "allow" ? "approved" : "denied"}.`
        );
        setShowSuccessModal(true);
        setRemarksError(false);
      } catch (error) {
        console.error(
          `Error ${action === "allow" ? "approving" : "denying"} request:`,
          error
        );
      }
    }
    setConfirmDialogOpen(false);
    setCurrentAction(null);
    setApprovalRemarks("");
  };
  const handleAllow = (request) => {
    setCurrentAction({ action: "allow", request });
    setConfirmDialogOpen(true);
  };

  const handleDeny = (request) => {
    setCurrentAction({ action: "deny", request });
    setConfirmDialogOpen(true);
  };

  const columns = [
    {
      field: "srNo",
      headerName: "Sr.No.",
      width: 70,
    },
    {
      field: "employeeInfo",
      headerName: "Employee",
      width: 180,
      renderCell: (params) => (
        <div>
          {params.row.employeeCode}-{params.row.employeeName}
        </div>
      ),
    },
    { field: "region", headerName: "Region", width: 100 },
    { field: "branchLocation", headerName: "Branch Location", width: 140 },
    { field: "requestedBy", headerName: "Requested By", width: 120 },
    { field: "requestedDate", headerName: "Date", width: 120 },
    { field: "requestType", headerName: "Request Type", width: 120 },
    {
      field: "moreDetails",
      headerName: "Details",
      width: 70,
      renderCell: (params) => (
        <Button
          variant="outline-primary"
          size="sm"
          onClick={() => handleMoreDetails(params.row)}
        >
          <MdInfo size={19} className="me-1" />
        </Button>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      renderCell: (params) => (
        <div>
          <Button
            variant="outline-success"
            size="sm"
            onClick={() => handleAllow(params.row)}
            style={{ marginRight: "5px" }}
          >
            <FaCheck size={15} />
          </Button>
          <Button
            variant="outline-danger"
            size="sm"
            onClick={() => handleDeny(params.row)}
          >
            <FaTimes size={15} />
          </Button>
        </div>
      ),
    },
  ];

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
        <Toolbar sx={{ justifyContent: "center" }}>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, marginLeft: "390px" }}
          >
            Requests
          </Typography>
          <Paper
            style={{
              display: "flex",
              alignItems: "center",
              padding: "0.2rem 0.6rem",
              width: "298px",
              height: "39px",
            }}
          >
            <TextField
              placeholder="Search"
              value={searchQuery}
              onChange={handleSearchChange}
              style={{ width: "85px" }}
            />
            <Button
              variant="outline-warning"
              size="sm"
              onClick={handleFilterIconClick}
              style={{ height: "23px" }}
              className="m-2"
            >
              <FaCalendarAlt size={15} className="mb-3" />
            </Button>
            <Button
              variant="outline-danger"
              size="sm"
              onClick={handleResetFilters}
              style={{
                height: "23px",
                alignItems: "center",
                display: "flex",
              }}
            >
              <BiReset size={15} className=" me-1 " />
              Reset
            </Button>
            <Button
              variant="outline-primary"
              size="sm"
              style={{
                height: "23px",
                alignItems: "center",
                display: "flex",
                marginLeft: "10px",
                width: "20%",
              }}
            >
              <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
            </Button>
          </Paper>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          display: "flex",
          minHeight: "100vh",
          backgroundColor: theme.palette.background.default,
          paddingTop: "64px",
          overflow: "hidden",
        }}
      >
        {sidebarOpen && <SidebarIt />}
        <Box
          sx={{
            flexGrow: 1,
            padding: 1,
            marginLeft: isSidebarOpen ? "250px" : "0px",
            transition: "margin-left 0.3s ease",
            overflow: "hidden",
          }}
        >
          <Paper
            elevation={3}
            sx={{
              padding: 3,
              backgroundColor: theme.palette.background.paper,
              border: `2px solid ${theme.palette.primary.main}`,
              borderRadius: "8px",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              height: "calc(97vh - 64px)",
            }}
          >
            <Box
              sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                overflow: "auto",
              }}
            >
              <DataGrid
                sx={{
                  borderRadius: 2,
                  width: "100%",
                  height: "100%",
                  overflowY: "auto",
                  overflowX: "auto",
                  "& .MuiDataGrid-columnHeaderTitle": {
                    fontWeight: "bold",
                  },
                  "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: theme.palette.background.paper,
                  },
                  "& .MuiDataGrid-columnHeader": {
                    borderBottom: `1px solid ${theme.palette.divider}`,
                  },
                  "& .MuiDataGrid-row": {
                    backgroundColor: theme.palette.background.default,
                  },
                  "& .MuiDataGrid-cell": {
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    backgroundColor: theme.palette.background.paper,
                  },
                }}
                rows={filteredRows}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5, 10, 15]}
                pagination
                paginationMode="client"
                loading={loadingRequests}
              />
            </Box>
            <DateFilter
              showFilterModal={showFilterModal}
              handleClose={handleCloseFilterModal}
              startDate={startDate}
              endDate={endDate}
              setStartDate={setStartDate}
              setEndDate={setEndDate}
              handleFilterApply={handleFilterApply}
            />
            <MoreDetailsModal
              open={showMoreDetailsModal}
              onClose={() => setShowMoreDetailsModal(false)}
              requestDetails={currentRequestDetails}
            />
            <Dialog
              open={confirmDialogOpen}
              onClose={() => setConfirmDialogOpen(false)}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                {`Are you sure you want to ${
                  currentAction?.action === "allow" ? "accept" : "deny"
                } this request?`}
              </DialogTitle>
              <DialogContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center", 
                    alignItems: "center",
                    height: "40", 
                  }}
                >
                  <TextField
                    autoFocus
                    margin="dense"
                    id="remarks"
                    label="Enter Remarks"
                    type="textarea"
                    variant="outlined"
                    value={approvalRemarks}
                    onChange={(e) => {
                      setApprovalRemarks(e.target.value);
                      if (e.target.value.trim()) {
                        setRemarksError(false);
                      }
                    }}
                    error={remarksError}
                    helperText={remarksError && (
                      <span style={{ color: 'red' }}>Please enter remarks</span>
                    )}
                    sx={{
                      width: "50%",
                      fontSize: "1rem",
                      "& .MuiInputLabel-root": {
                        fontSize: "1rem",
                      },
                    }}
                  />
                </Box>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => {
                    setConfirmDialogOpen(false);
                    setApprovalRemarks("");
                  }}
                  color="primary"
                >
                  No
                </Button>
                <Button onClick={handleConfirmAction} color="primary" autoFocus>
                  Yes
                </Button>
              </DialogActions>
            </Dialog>
            <SuccessModal
              show={showSuccessModal}
              onHide={() => setShowSuccessModal(false)}
              message={successMessage}
            />
          </Paper>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default RegionalRequests;
