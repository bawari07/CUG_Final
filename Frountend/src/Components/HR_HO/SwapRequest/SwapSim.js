// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   getSwapRequests,
//   requestSwapInitiation,
//   getBranches,
//   getRegions,
// } from "../../../Services/Api";
// import SidebarHr from "../../Sidebar/SidebarHr";
// import { DataGrid } from "@mui/x-data-grid";
// import RequestInitiationModal from "./SuspensionRequestInitiation";
// import SuccessModal from "./successmodal";
// import { ThemeProvider, createTheme } from "@mui/material/styles";
// import CssBaseline from "@mui/material/CssBaseline";
// import ThemeToggle from "../../other/themetoggle";
// import { keyframes } from "@emotion/react";
// import { Button } from "react-bootstrap";
// import { Typography, AppBar, Toolbar, Box } from "@mui/material";
// import { TextField, Paper } from "@mui/material";
// import { FaCheck } from "react-icons/fa";
// import { BiReset } from "react-icons/bi";

// const shineAnimation = keyframes`
//   0% {
//     background-position: 200% center;
//   }
//   100% {
//     background-position: -200% center;
//   }
// `;

// function SwapSim() {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [loadingRequests, setLoadingRequests] = useState(true);
//   const [requestsError, setRequestsError] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedRequest, setSelectedRequest] = useState(null);
//   const [showSuccessModal, setShowSuccessModal] = useState(false);
//   const [currentRequest, setCurrentRequest] = useState(null);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [employeeCode, setEmployeeCode] = useState("");
//   const [oldUserCugNumber, setOldUserCugNumber] = useState("");
//   const [oldUserEmployeeCode, setOldUserEmployeeCode] = useState("");
//   const [filteredRequests, setFilteredRequests] = useState([]);
//   const [darkMode, setDarkMode] = useState(false);
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [selectedRegion, setSelectedRegion] = useState("");
//   const [selectedBranch, setSelectedBranch] = useState("");
//   const [remarksByHR, setRemark] = useState("");

//   const theme = React.useMemo(
//     () =>
//       createTheme({
//         palette: {
//           mode: darkMode ? "dark" : "light",
//           primary: {
//             main: darkMode ? "#f78c6c" : "#1976d2",
//           },
//           secondary: {
//             main: darkMode ? "#82b1ff" : "#e3f2fd",
//           },
//           background: {
//             default: darkMode ? "#1e1e1e" : "#e3f2fd",
//             paper: darkMode ? "#282c34" : "#ffffff",
//           },
//           text: {
//             primary: darkMode ? "#dcdcdc" : "#000",
//             secondary: darkMode ? "#9cdcfe" : "#555",
//           },
//           action: {
//             hover: darkMode
//               ? "rgba(255, 255, 255, 0.08)"
//               : "rgba(0, 0, 0, 0.08)",
//           },
//           divider: darkMode ? "#444" : "#ccc",
//         },
//         typography: {
//           fontFamily: "'Fira Code', monospace",
//         },
//       }),
//     [darkMode]
//   );

//   const navigate = useNavigate();
//   useEffect(() => {
//     async function fetchAllRequests() {
//       try {
//         setLoadingRequests(true);

//         const region = localStorage.getItem("region");

//         const response = await getSwapRequests({ region });

//         const requestsResponse = response.data;

//         console.log("API Response:", requestsResponse);

//         if (region === "Head Office") {
//           setFilteredRequests(requestsResponse);
//         } else {
//           const filteredByRegion = requestsResponse.filter(
//             (request) => request.region === region
//           );
//           setFilteredRequests(filteredByRegion);
//         }
//       } catch (error) {
//         console.error("Error fetching all requests:", error);
//         setRequestsError("Failed to load requests");
//         setFilteredRequests([]);
//       } finally {
//         setLoadingRequests(false);
//       }
//     }

//     fetchAllRequests();
//   }, []);

//   const handleSearchChange = (event) => {
//     setSearchQuery(event.target.value);
//   };

//   const filteredRows = filteredRequests
//     .filter(
//       (request) =>
//         request.employeeCode
//           ?.toLowerCase()
//           .includes(searchQuery.toLowerCase()) ||
//         request.employeeName
//           ?.toLowerCase()
//           .includes(searchQuery.toLowerCase()) ||
//         request.cugNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         request.telecomPartner
//           ?.toLowerCase()
//           .includes(searchQuery.toLowerCase())
//     )
//     .map((request, index) => ({
//       id: index + 1,
//       ...request,
//     }));

//   const handleRequestInitiationSubmit = async () => {
//     const simId = selectedRequest?.simId;
//     console.log(selectedRequest?.simId);
//     if (!employeeCode || !oldUserCugNumber || !oldUserEmployeeCode || !remarksByHR) {
//       alert("Please fill in all required fields.");
//       return;
//     }
//     try {
//       const requestDetails = {
//         employeeCode,
//         oldUserCugNumber,
//         oldUserEmployeeCode,
//         region: selectedRegion,
//         branchLocation: selectedBranch,
//         simId,
//         remarksByHR,
//       };

//       await requestSwapInitiation(requestDetails);

//       setFilteredRequests((prevRequests) =>
//         prevRequests.filter((request) => request.simId !== simId)
//       );
//       setCurrentRequest(null);
//       setShowSuccessModal(true);
//     } catch (error) {
//       console.error(
//         "Error submitting request initiation:",
//         error.response || error
//       );
//       alert("Failed to submit the request initiation. Please try again.");
//     }
//   };

//   const handleIconClick = (params) => {
//     setSelectedRequest(params.row);
//     setOldUserCugNumber(params.row.cugNumber);
//     setOldUserEmployeeCode(params.row.employeeCode);
//     setIsModalOpen(true);
//     setSelectedRegion(params.row.region);
//     setSelectedBranch(params.row.branchLocation);
//   };

//   const handleModalClose = () => {
//     setIsModalOpen(false);
//     setSelectedRequest(null);
//   };

//   const handleModalSubmit = () => {
//     console.log("Submitted:", selectedRequest);
//     setIsModalOpen(false);
//     setCurrentRequest(selectedRequest);
//     handleRequestInitiationSubmit();
//   };

//   const handleSuccessModalClose = () => {
//     console.log("Closing success modal");
//     setShowSuccessModal(false);
//   };

//   const handleResetFilters = () => {
//     setSearchQuery("");
//   };

//   const columns = [
//     { field: "id", headerName: "Sr.No.", width: 70 },
//     { field: "employeeCode", headerName: "Old Employee Code", width: 150 },
//     { field: "employeeName", headerName: "Old Employee Name", width: 150 },
//     { field: "region", headerName: "Region", width: 100 },
//     { field: "branchLocation", headerName: "Branch", width: 150 },
//     { field: "cugNumber", headerName: "Old CUG Number", width: 150 },
//     { field: "telecomPartner", headerName: "Telecom Partner", width: 130 },
//     {
//       field: "requestInitiation",
//       headerName: "Request Initiation",
//       width: 150,
//       renderCell: (params) => (
//         <Button
//           variant="outline-success"
//           size="sm"
//           onClick={() => handleIconClick(params)}
//         >
//           <FaCheck size={15} className="me-1" />
//         </Button>
//       ),
//     },
//   ];

//   const rows = filteredRequests.map((request, index) => ({
//     id: index + 1,
//     employeeCode: request.employeeCode || "N/A",
//     employeeName: request.employeeName || "N/A",
//     cugNumber: request.cugNumber || "N/A",
//     telecomPartner: request.telecomPartner || "N/A",
//     region: request.region || "N/A",
//     branch: request.branchLocation || "N/A",
//   }));

//   return (
//     <ThemeProvider theme={theme}>
//       <CssBaseline />
//       <AppBar
//         position="fixed"
//         sx={{
//           backgroundColor:
//             theme.palette.mode === "dark" ? "#1a1a1a" : "#003366",
//         }}
//       >
//         <Toolbar sx={{ justifyContent: "center" }}>
//           <Typography
//             variant="h6"
//             component="div"
//             sx={{ flexGrow: 1, textAlign: "center" }}
//           >
//             Swap Sim
//           </Typography>

//           <Paper
//             style={{
//               display: "flex",
//               alignItems: "center",
//               padding: "0.2rem 0.6rem",

//               width: "298px",

//               height: "39px",
//             }}
//           >
//             <TextField
//               placeholder="Search"
//               value={searchQuery}
//               onChange={handleSearchChange}
//               style={{ width: "85px" }}
//             />
//             <Button
//               variant="outline-danger"
//               size="sm"
//               className="ms-2"
//               onClick={handleResetFilters}
//               style={{
//                 height: "23px",
//                 alignItems: "center",
//                 display: "flex",
//               }}
//             >
//               <BiReset size={15} className=" me-1 " />
//               Reset
//             </Button>
//             <Button
//               variant="outline-primary"
//               size="sm"
//               style={{
//                 height: "23px",
//                 alignItems: "center",
//                 display: "flex",
//                 marginLeft: "10px",
//                 width: "20%",
//               }}
//             >
//               {" "}
//               <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
//             </Button>
//           </Paper>
//         </Toolbar>
//       </AppBar>

//       <Box
//         sx={{
//           display: "flex",
//           minHeight: "100vh",
//           backgroundColor: theme.palette.background.default,
//           paddingTop: "64px",
//           overflow: "hidden",
//         }}
//       >
//         {sidebarOpen && <SidebarHr />}
//         <Box
//           sx={{
//             flexGrow: 1,
//             padding: 1,
//             marginLeft: isSidebarOpen ? "250px" : "0px",
//             transition: "margin-left 0.3s ease",
//             overflow: "hidden",
//           }}
//         >
//           <Paper
//             elevation={3}
//             sx={{
//               padding: 3,
//               backgroundColor: theme.palette.background.paper,
//               border: `2px solid ${theme.palette.primary.main}`,
//               borderRadius: "8px",
//               overflow: "hidden",
//               display: "flex",
//               flexDirection: "column",
//               alignItems: "center",
//               height: "calc(97vh - 64px)",
//             }}
//           >
//             <Box
//               sx={{
//                 width: "100%",
//                 height: "100%",
//                 display: "flex",
//                 flexDirection: "column",
//                 alignItems: "center",
//                 overflow: "hidden",
//               }}
//             >
//               <DataGrid
//                 sx={{
//                   borderRadius: 2,
//                   width: "100%",
//                   height: "100%",
//                   overflow: "auto",
//                   "& .MuiDataGrid-columnHeaderTitle": {
//                     fontWeight: "bold",
//                   },
//                   "& .MuiDataGrid-columnHeaders": {
//                     backgroundColor: theme.palette.background.paper,
//                   },
//                   "& .MuiDataGrid-columnHeader": {
//                     borderBottom: `1px solid ${theme.palette.divider}`,
//                   },
//                   "& .MuiDataGrid-row": {
//                     backgroundColor: theme.palette.background.default,
//                   },
//                   "& .MuiDataGrid-cell": {
//                     borderBottom: `1px solid ${theme.palette.divider}`,
//                     backgroundColor: theme.palette.background.paper,
//                   },
//                 }}
//                 rows={filteredRows}
//                 columns={columns}
//                 pageSize={5}
//                 rowsPerPageOptions={[5, 10, 15]}
//                 paginationMode="client"
//                 pagination
//                 loading={loadingRequests}
//               />
//             </Box>
//             <RequestInitiationModal
//               open={isModalOpen}
//               onClose={handleModalClose}
//               onSubmit={handleModalSubmit}
//               employeeCode={employeeCode}
//               setEmployeeCode={setEmployeeCode}
//               oldEmployeeCode={selectedRequest?.employeeCode || ""}
//               oldEmployeeName={selectedRequest?.employeeName || ""}
//               simId={selectedRequest?.simId || ""}
//               remarksByHR={remarksByHR}
//               setRemark={setRemark}
//             />
//             <SuccessModal
//               open={showSuccessModal}
//               onClose={handleSuccessModalClose}
//               employeeName={currentRequest?.employeeName}
//             />
//           </Paper>
//         </Box>
//       </Box>
//     </ThemeProvider>
//   );
// }

// export default SwapSim;



import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getSwapRequests,
  requestSwapInitiation,
  getBranches,
  getRegions,
} from "../../../Services/Api";
import SidebarHr from "../../Sidebar/SidebarHr";
import { DataGrid } from "@mui/x-data-grid";
import RequestInitiationModal from "./SuspensionRequestInitiation";
import SuccessModal from "./successmodal";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import ThemeToggle from "../../other/themetoggle";
import { keyframes } from "@emotion/react";
import { Button } from "react-bootstrap";
import { Typography, AppBar, Toolbar, Box } from "@mui/material";
import { TextField, Paper } from "@mui/material";
import { FaCheck } from "react-icons/fa";
import { BiReset } from "react-icons/bi";

const shineAnimation = keyframes`
  0% {
    background-position: 200% center;
  }
  100% {
    background-position: -200% center;
  }
`;

function SwapSim() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [requestsError, setRequestsError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [currentRequest, setCurrentRequest] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [employeeCode, setEmployeeCode] = useState("");
  const [oldUserCugNumber, setOldUserCugNumber] = useState("");
  const [oldUserEmployeeCode, setOldUserEmployeeCode] = useState("");
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [remarksByHR, setRemark] = useState("");

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
  useEffect(() => {
    async function fetchAllRequests() {
      try {
        setLoadingRequests(true);

        // Always fetch requests for "Head Office"
        const response = await getSwapRequests({ region: "Head Office" });

        const requestsResponse = response.data;

        console.log("API Response:", requestsResponse);

        // Set the filtered requests to show all "Head Office" requests
        setFilteredRequests(requestsResponse);
      } catch (error) {
        console.error("Error fetching all requests:", error);
        setRequestsError("Failed to load requests");
        setFilteredRequests([]);
      } finally {
        setLoadingRequests(false);
      }
    }

    fetchAllRequests();
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
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
        request.cugNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.telecomPartner
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase())
    )
    .map((request, index) => ({
      id: index + 1,
      ...request,
    }));

  const handleRequestInitiationSubmit = async () => {
    const simId = selectedRequest?.simId;
    console.log(selectedRequest?.simId);
    if (!employeeCode || !oldUserCugNumber || !oldUserEmployeeCode || !remarksByHR) {
      alert("Please fill in all required fields.");
      return;
    }
    try {
      const requestDetails = {
        employeeCode,
        oldUserCugNumber,
        oldUserEmployeeCode,
        region: selectedRegion,
        branchLocation: selectedBranch,
        simId,
        remarksByHR,
      };

      await requestSwapInitiation(requestDetails);

      setFilteredRequests((prevRequests) =>
        prevRequests.filter((request) => request.simId !== simId)
      );
      setCurrentRequest(null);
      setShowSuccessModal(true);
    } catch (error) {
      console.error(
        "Error submitting request initiation:",
        error.response || error
      );
      alert("Failed to submit the request initiation. Please try again.");
    }
  };

  const handleIconClick = (params) => {
    setSelectedRequest(params.row);
    setOldUserCugNumber(params.row.cugNumber);
    setOldUserEmployeeCode(params.row.employeeCode);
    setIsModalOpen(true);
    setSelectedRegion(params.row.region);
    setSelectedBranch(params.row.branchLocation);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedRequest(null);
  };

  const handleModalSubmit = () => {
    console.log("Submitted:", selectedRequest);
    setIsModalOpen(false);
    setCurrentRequest(selectedRequest);
    handleRequestInitiationSubmit();
  };

  const handleSuccessModalClose = () => {
    console.log("Closing success modal");
    setShowSuccessModal(false);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
  };

  const columns = [
    { field: "id", headerName: "Sr.No.", width: 70 },
    { field: "employeeCode", headerName: "Old Employee Code", width: 150 },
    { field: "employeeName", headerName: "Old Employee Name", width: 150 },
    { field: "region", headerName: "Region", width: 100 },
    { field: "branchLocation", headerName: "Branch", width: 150 },
    { field: "cugNumber", headerName: "Old CUG Number", width: 150 },
    { field: "telecomPartner", headerName: "Telecom Partner", width: 130 },
    {
      field: "requestInitiation",
      headerName: "Request Initiation",
      width: 150,
      renderCell: (params) => (
        <Button
          variant="outline-success"
          size="sm"
          onClick={() => handleIconClick(params)}
        >
          <FaCheck size={15} className="me-1" />
        </Button>
      ),
    },
  ];

  const rows = filteredRequests.map((request, index) => ({
    id: index + 1,
    employeeCode: request.employeeCode || "N/A",
    employeeName: request.employeeName || "N/A",
    cugNumber: request.cugNumber || "N/A",
    telecomPartner: request.telecomPartner || "N/A",
    region: request.region || "N/A",
    branch: request.branchLocation || "N/A",
  }));

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
            sx={{ flexGrow: 1, textAlign: "center" }}
          >
            Swap Sim
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
              variant="outline-danger"
              size="sm"
              className="ms-2"
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
        {sidebarOpen && <SidebarHr />}
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
                overflow: "hidden",
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
                paginationMode="client"
                pagination
                loading={loadingRequests}
              />
            </Box>
            <RequestInitiationModal
              open={isModalOpen}
              onClose={handleModalClose}
              onSubmit={handleModalSubmit}
              employeeCode={employeeCode}
              setEmployeeCode={setEmployeeCode}
              oldEmployeeCode={selectedRequest?.employeeCode || ""}
              oldEmployeeName={selectedRequest?.employeeName || ""}
              simId={selectedRequest?.simId || ""}
              remarksByHR={remarksByHR}
              setRemark={setRemark}
            />
            <SuccessModal
              open={showSuccessModal}
              onClose={handleSuccessModalClose}
              employeeName={currentRequest?.employeeName}
            />
          </Paper>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default SwapSim;
