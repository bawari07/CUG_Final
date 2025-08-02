import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getHRRequests, requestInitiation } from "../../../Services/Api";
import SidebarIt from "../../Sidebar/SidebarIt";
import RequestInitiationModal from "../ActivationRequest/RequestInitiationModal";
import MoreDetailsModal from "../common/MoreDetailsModal";
import { Typography, AppBar, Toolbar, Box } from "@mui/material";
import { TextField, Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { FaCheck } from "react-icons/fa";
import { MdInfo } from "react-icons/md";
import { Button } from "react-bootstrap";
import SuccessModal from "../ActivationRequest/RequestinitiationSuccessModal";
import DateFilter from "../common/DateFilter";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import ThemeToggle from "../../other/themetoggle";
import { keyframes } from "@emotion/react";
import { FaCalendarAlt } from "react-icons/fa";
import { BiReset } from "react-icons/bi";
import FullRemarkModal from "./remarkmodal";

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
  const [iccidNumber, setICCIDNumber] = useState("");
  const [imsiNumber, setIMSI_Number] = useState("");
  const [currentRequest, setCurrentRequest] = useState(null);
  const [showRequestInitiationModal, setShowRequestInitiationModal] =
    useState(false);
  const [telecomPartner, setVendorName] = useState("");
  const [showMoreDetailsModal, setShowMoreDetailsModal] = useState(false);
  const [currentRequestDetails, setCurrentRequestDetails] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [open, setOpen] = useState(false);
  const [showFullRemarkModal, setShowFullRemarkModal] = useState(false);
  const [currentRemark, setCurrentRemark] = useState("");

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
  //     const status = "Pending";
  //     const type = "Activation";
  //     const simAllocationType = "NewSim";
  //     setLoadingRequests(true);
  //     const requestsResponse = await getHRRequests({
  //       simAllocationType,
  //       status,
  //       type,
  //     });
  //     const region = localStorage.getItem("region");
  //     console.log(region);
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
      const status = "Pending";
      const type = "Activation";
      const simAllocationType = "NewSim";
      setLoadingRequests(true);
      const requestsResponse = await getHRRequests({
        simAllocationType,
        status,
        type,
      });
  
      console.log("API Response:", requestsResponse.data);
  
      const regions = localStorage.getItem("region")?.split(",") || [];
      console.log("User Regions:", regions);
  
      if (regions.includes("Head Office")) {
        setFilteredRequests(requestsResponse.data);
      } else {
        const filteredByRegion = requestsResponse.data.filter((request) =>
          regions.includes(request.region)
        );
        console.log("Filtered Data by Region:", filteredByRegion);
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
    console.log("Fetching all requests...");
    fetchAllRequests();
  }, []);
  // useEffect(() => {
  //   console.log("Filtered requests state updated:", filteredRequests);
  // }, [filteredRequests]);

  const handleRequestInitiation = (request) => {
    setCurrentRequest(request);
    setShowRequestInitiationModal(true);
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
    console.log("Filtered rows for DataGrid:", filteredRows);
  const handleRequestInitiationSubmit = async () => {
    const requestID = currentRequest?.requestID;
    if (!requestID || !iccidNumber || !imsiNumber || !telecomPartner) {
      alert("Please fill in all required fields.");
      return;
    }
    try {
      const requestDetails = {
        requestID,
        iccidNumber,
        imsiNumber,
        telecomPartner,
      };
      await requestInitiation(requestDetails);

      setFilteredRequests((prevRequests) =>
        prevRequests.filter((request) => request.requestID !== requestID)
      );
      setShowSuccessModal(true);
    } catch (error) {
      console.error(
        "Error initiating request:",
        error.response?.data || error.message
      );
      alert("Failed to initiate request. Please try again.");
    }
  };

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

  const handleOpenRemarkModal = (remark) => {
    setCurrentRemark(remark);
    setShowFullRemarkModal(true);
  };

  const columns = [
    { field: "id", headerName: "Sr.No.", width: 58 },
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
      field: "remarksByHR",
      headerName: "Remarks",
      width: 140,
      renderCell: (params) => (
        <div
          style={{ cursor: "pointer", textDecoration: "underline" }}
          onClick={() => handleOpenRemarkModal(params.row.remarksByHR)}
        >
          {params.row.remarksByHR}
        </div>
      ),
    },
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
      field: "requestInitiation",
      headerName: "Initiate",
      width: 80,
      renderCell: (params) => (
        <Button
          variant="outline-success"
          size="sm"
          onClick={() => handleRequestInitiation(params.row)}
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
            IT Request Initiation
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
                  // overflow: "auto",
                  overflowY: "auto", // Ensure vertical scrolling
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
                // disableSelectionOnClick
                // autoHeight
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
            <RequestInitiationModal
              open={showRequestInitiationModal}
              onClose={() => setShowRequestInitiationModal(false)}
              onSubmit={handleRequestInitiationSubmit}
              requestId={currentRequest?.requestID}
              ICCID_Number={iccidNumber}
              IMSI_Number={imsiNumber}
              vendorName={telecomPartner}
              setICCIDNumber={setICCIDNumber}
              setIMSI_Number={setIMSI_Number}
              setVendorName={setVendorName}
              errorMessage={errorMessage}
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
            <FullRemarkModal
              open={showFullRemarkModal}
              onClose={() => setShowFullRemarkModal(false)}
              remarkText={currentRemark}
            />
          </Paper>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
export default ReqITs;
