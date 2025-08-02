import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getHRRequests, submitDetails, sendMail } from "../../../Services/Api";
import SidebarIt from "../../Sidebar/SidebarIt";
import SubmitDetailsModal from "./SubmitDetailsModal";
import IntimationModal from "./Intimationmail";
import MoreDetailsModal from "../common/MoreDetailsModal";
import { MdInfo } from "react-icons/md";
import { DataGrid } from "@mui/x-data-grid";
import { FaCheck, FaClipboardCheck, FaEnvelope } from "react-icons/fa";
import {
  TextField,
  InputAdornment,
  Grid,
  Paper,
  Box,
  Typography,
  IconButton,
  AppBar,
  Toolbar,
} from "@mui/material";
import { Search, FilterList, Clear } from "@mui/icons-material";
import "./HOSubmitRequest.css";
import { Button } from "react-bootstrap";
import SuccessModal from "../ActivationRequest/SubmitRequestSuccessModal";
import DateFilter from "../common/DateFilter";
import ThemeToggle from "../../other/themetoggle";
import { keyframes } from "@emotion/react";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import { BiReset } from "react-icons/bi";
import { FaCalendarAlt } from "react-icons/fa";
const shineAnimation = keyframes`
  0% {
    background-position: 200% center;
  }
  100% {
    background-position: -200% center;
  }
`;

function ReqITs() {
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [requestsError, setRequestsError] = useState(null);
  const [remarksByIT, setRemark] = useState("");
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [currentRequest, setCurrentRequest] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [cugNumber, setCugNumber] = useState("");
  const [showMoreDetailsModal, setShowMoreDetailsModal] = useState(false);
  const [currentRequestDetails, setCurrentRequestDetails] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [rechargePlan, setRechargePlan] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [search, setSearch] = useState("");
  const [showIntimationModal, setShowIntimationModal] = useState(false);

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

  // const fetchAllRequests = async () => {
  //   try {
  //     const status = "Ongoing";
  //     const type = "Activation";
  //     const simAllocationType = "NewSim";
  //     setLoadingRequests(true);
  //     const requestsResponse = await getHRRequests({
  //       simAllocationType,
  //       status,
  //       type,
  //     });
  //     console.log(requestsResponse.data);
  //     const region = localStorage.getItem("region");

  //     if (region === "Head Office") {
  //       setFilteredRequests(requestsResponse.data);
  //     } else {
  //       const filteredByRegion = requestsResponse.data.filter(
  //         (request) => request.region === region
  //       );
  //       setFilteredRequests(filteredByRegion);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching all requests:", error);
  //     setRequestsError("Failed to load requests");
  //     setShowErrorModal(true);
  //   } finally {
  //     setLoadingRequests(false);
  //   }
  // };

  const fetchAllRequests = async () => {
    try {
      const status = "Ongoing"; // Corrected the typo from "Ongoing" to "Ongoing"
      const type = "Activation"; // Corrected the typo from "Activation" to "Activation"
      const simAllocationType = "NewSim";
      setLoadingRequests(true);
  
      const requestsResponse = await getHRRequests({
        simAllocationType,
        status,
        type,
      });
  
      console.log(requestsResponse.data);
  
      const region = localStorage.getItem("region");
      const regions = region.split(',').map(r => r.trim()); // Split the region string into an array
  
      if (regions.includes("Head Office")) {
        setFilteredRequests(requestsResponse.data);
      } else {
        const filteredByRegion = requestsResponse.data.filter(
          (request) => regions.includes(request.region)
        );
        setFilteredRequests(filteredByRegion);
      }
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

  const handleSendMail = async (request) => {
    try {
      await sendMail(request.requestID);
      setShowIntimationModal(true);
    } catch (error) {
      console.error("Error sending mail:", error);
      alert("Failed to send mail. Please try again.");
    }
  };

  const handleSubmit = (request) => {
    setCurrentRequest(request);
    setShowSubmitModal(true);
  };

  const handleSubmitDetails = async () => {
    const requestID = currentRequest?.requestID;
    if (!requestID || !cugNumber || !rechargePlan || !remarksByIT) {
      alert("Please fill in all required fields");
      return;
    }
    try {
      const details = {
        requestID,
        cugNumber,
        rechargePlan,
        remarksByIT,
      };
      await submitDetails(details);
      setFilteredRequests((prevRequests) =>
        prevRequests.filter((request) => request.requestID !== requestID)
      );
      setShowSubmitModal(false);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error submitting details:", error);
      alert("Failed to submit details. Please try again.");
    }
  };

  const handleMoreDetails = (request) => {
    setCurrentRequestDetails(request);
    setShowMoreDetailsModal(true);
  };

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
      id: index + 1,
      ...request,
    }));

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

  const columns = [
    { field: "id", headerName: "Sr.No.", width: 60 },
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
    { field: "region", headerName: "Region", width: 70 },
    { field: "branchLocation", headerName: "Branch Location", width: 130 },
    { field: "requestedBy", headerName: "Requested By", width: 120 },
    { field: "requestedDate", headerName: "Date", width: 190 },
    { field: "requestType", headerName: "Request Type", width: 130 },
    {
      field: "mailIntimation",
      headerName: "Intimation",
      width: 90,
      renderCell: (params) => (
        <Button
          variant="outline-info"
          size="sm"
          onClick={() => handleSendMail(params.row)}
        >
          <FaEnvelope size={15} className="me-1" />
        </Button>
      ),
    },
    {
      field: "moreDetails",
      headerName: "Details",
      width: 80,
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
      field: "submit",
      headerName: "Submit",
      width: 120,
      renderCell: (params) => (
        <Button
          variant="outline-success"
          size="sm"
          onClick={() => handleSubmit(params.row)}
        >
          <FaCheck size={15} className="me-1" />
        </Button>
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
            IT Req Submission
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
              {" "}
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
              minHeight: "20px",
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
                  overflow: "auto",
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
            <SubmitDetailsModal
              open={showSubmitModal}
              onClose={() => setShowSubmitModal(false)}
              onSubmit={handleSubmitDetails}
              requestId={currentRequest?.requestID}
              CUG_number={cugNumber}
              setCUGNumber={setCugNumber}
              rechargePlan={rechargePlan}
              setRechargePlan={setRechargePlan}
              remarksByIT={remarksByIT}
              setRemark={setRemark}
            />
            <MoreDetailsModal
              open={showMoreDetailsModal}
              onClose={() => setShowMoreDetailsModal(false)}
              requestDetails={currentRequestDetails}
            />
            <SuccessModal
              open={showSuccessModal}
              onClose={() => setShowSuccessModal(false)}
              employeeName={currentRequest?.employeeName}
            />
            <IntimationModal
              open={showIntimationModal}
              onClose={() => setShowIntimationModal(false)}
            />
          </Paper>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default ReqITs;
