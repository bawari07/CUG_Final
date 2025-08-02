import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import DownloadIcon from "@mui/icons-material/Download";
import CssBaseline from "@mui/material/CssBaseline";
import { keyframes } from "@emotion/react";
import SidebarAdmin from "../Sidebar/SidebarAdmin";
import SidebarHr from "../Sidebar/SidebarHr";
import SidebarIT from "../Sidebar/SidebarIt";
import ThemeToggle from "../other/themetoggle";
import {
  getSimRecord,
  getBranches,
  getRegions,
  getRequestTypes,
} from "../../Services/Api";
import RequestTable from "./RequestTable";
import CugNumberTable from "../other/cugnumbertable";
import SpecialNumberTable from "./SpecialNumbertable";
import AllTable from "./allTable";
import ApprovalTable from "./ApprovalTable";
import Pagination from "@mui/material/Pagination";

const shineAnimation = keyframes`
  0% {
    background-position: 200% center;
  }
  100% {
    background-position: -200% center;
  }
`;

const Component = () => {
  const [selectedStatus, setSelectedStatus] = useState("pending");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [requests, setRequests] = useState([]);
  const [cugData, setCugData] = useState([]);
  const [specialNumber, setSpecialNumber] = useState([]);
  const [alldata, setalldata] = useState([]);
  const [approvalData, setApprovalData] = useState([]);
  const [role, setRole] = useState("");
  const [regions, setRegions] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [requestTypes, setRequestTypes] = useState([
    "Activation",
    "Deactivation",
    "Suspension",
  ]);
  const [selectedRequestType, setSelectedRequestType] = useState("");
  const [filterDays, setFilterDays] = useState("all");
  const userRole = localStorage.getItem("region");
  console.log(userRole);

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
        },
        typography: {
          fontFamily: "'Fira Code', monospace",
        },
      }),
    [darkMode]
  );
  useEffect(() => {
    const userRole = localStorage.getItem("roleName");
    setRole(userRole);
  }, []);

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const regionsData = await getRegions();
        setRegions(regionsData || []);
      } catch (error) {
        console.error("Error fetching regions:", error);
        setError("Failed to load regions.");
      }
    };
    fetchRegions();
  }, []);

  useEffect(() => {
    const fetchBranches = async () => {
      if (selectedRegion) {
        try {
          const response = await getBranches(selectedRegion);
          setBranches(response.data);
        } catch (error) {
          console.error("Error fetching branches:", error);
          setError("Failed to load branches.");
        }
      } else {
        setBranches([]);
      }
    };
    fetchBranches();
  }, [selectedRegion]);

  const handleSearchChange = (event) => setSearch(event.target.value);
  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
  };
  const handleRegionChange = (event) => {
    setSelectedRegion(event.target.value);
    setSelectedBranch("");
  };
  const handleBranchChange = (event) => setSelectedBranch(event.target.value);
  const handleRequestTypeChange = (event) =>
    setSelectedRequestType(event.target.value);
  const handleFilterChange = (event) => setFilterDays(event.target.value);

  // useEffect(() => {
  //   const fetchSimRecords = async () => {
  //     setLoading(true);
  //     setError(null);

  //     try {
  //       const response = await getSimRecord({
  //         option: selectedStatus,
  //         region: selectedRegion,
  //         branch: selectedBranch,
  //         requestType: selectedRequestType,
  //       });

  //       const region = localStorage.getItem("region");
  //       console.log("abc: ",region);
  //       if (region === "Head Office") {
  //         setRequests(response.data || []);
  //         setApprovalData(response.data || []);
  //         setCugData(response.data || []);
  //         setSpecialNumber(response.data || []);
  //         setalldata(response.data || []);
  //       } else {
  //         const filteredByRegion = (response.data || []).filter(
  //           (record) => record.region === region
  //         );
  //         console.log("SIM records:", filteredByRegion);

  //         setRequests(filteredByRegion);
  //         setApprovalData(filteredByRegion);
  //         setCugData(filteredByRegion);
  //         setSpecialNumber(filteredByRegion);
  //         setalldata(filteredByRegion);
  //       }

  //     } catch (error) {
  //       console.error("Error fetching SIM records:", error);
  //       setError("Failed to fetch SIM records.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchSimRecords();
  // }, [selectedStatus, selectedRegion, selectedBranch, selectedRequestType]);

  useEffect(() => {
    const fetchSimRecords = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await getSimRecord({
          option: selectedStatus,
          region: selectedRegion,
          branch: selectedBranch,
          requestType: selectedRequestType,
        });

        const region = localStorage.getItem("region");
        console.log("abc: ", region);

        const regions = region.split(",").map((r) => r.trim()); // Split the region string into an array

        if (regions.includes("Head Office")) {
          setRequests(response.data || []);
          setApprovalData(response.data || []);
          setCugData(response.data || []);
          setSpecialNumber(response.data || []);
          setalldata(response.data || []);
        } else {
          const filteredByRegion = (response.data || []).filter((record) =>
            regions.includes(record.region)
          );
          console.log("SIM records:", filteredByRegion);

          setRequests(filteredByRegion);
          setApprovalData(filteredByRegion);
          setCugData(filteredByRegion);
          setSpecialNumber(filteredByRegion);
          setalldata(filteredByRegion);
        }
      } catch (error) {
        console.error("Error fetching SIM records:", error);
        setError("Failed to fetch SIM records.");
      } finally {
        setLoading(false);
      }
    };

    fetchSimRecords();
  }, [selectedStatus, selectedRegion, selectedBranch, selectedRequestType]);

  const filteredRequests = () => {
    const data = selectedStatus === "approval" ? approvalData : requests;

    return data.filter((request) => {
      const matchesStatus =
        request.requestStatus?.toLowerCase() === selectedStatus.toLowerCase();
      const matchesRegion =
        !selectedRegion || request.region === selectedRegion;
      const matchesBranch =
        !selectedBranch || request.branchLocation === selectedBranch;
      const matchesRequestType =
        !selectedRequestType || request.requestType === selectedRequestType;

      const matchesSearch =
        (request.employeeCode?.toLowerCase().includes(search.toLowerCase()) ||
          request.employeeName?.toLowerCase().includes(search.toLowerCase()) ||
          request.requestType?.toLowerCase().includes(search.toLowerCase()) ||
          request.designation?.toLowerCase().includes(search.toLowerCase()) ||
          request.region?.toLowerCase().includes(search.toLowerCase()) ||
          request.department?.toLowerCase().includes(search.toLowerCase())) ??
        false;

      const currentDate = new Date();
      const requestDate = new Date(request.requestedDate);
      const dateDifference = Math.floor(
        (currentDate - requestDate) / (1000 * 60 * 60 * 24)
      );

      const matchesDateRange =
        filterDays === "all" ||
        (filterDays === "30" && dateDifference <= 30) ||
        (filterDays === "60" && dateDifference <= 60) ||
        (filterDays === "90" && dateDifference <= 90);

      return (
        matchesStatus &&
        matchesRegion &&
        matchesBranch &&
        matchesRequestType &&
        matchesSearch &&
        matchesDateRange
      );
    });
  };

  const filteredalldata = () => {
    console.log("Applying filters:", {
      selectedRegion,
      selectedBranch,
      selectedRequestType,
      filterDays,
    });

    const filtered = alldata.filter((request) => {
      const matchesRegion =
        selectedRegion === "" || request.region === selectedRegion;
      const matchesBranch =
        !selectedBranch || request.branchLocation === selectedBranch;
      const matchesRequestType =
        selectedRequestType === "" ||
        request.requestType === selectedRequestType;

      const matchesSearch =
        (request.employeeCode?.toLowerCase().includes(search.toLowerCase()) ||
          request.employeeName?.toLowerCase().includes(search.toLowerCase()) ||
          request.requestType?.toLowerCase().includes(search.toLowerCase()) ||
          request.designation?.toLowerCase().includes(search.toLowerCase()) ||
          request.region?.toLowerCase().includes(search.toLowerCase()) ||
          request.department?.toLowerCase().includes(search.toLowerCase())) ??
        false;

      const currentDate = new Date();
      const requestDate = new Date(request.date);
      const daysDifference = Math.floor(
        (currentDate - requestDate) / (1000 * 60 * 60 * 24)
      );

      const matchesDays =
        filterDays === "all" || daysDifference <= parseInt(filterDays);

      return (
        matchesRegion &&
        matchesBranch &&
        matchesRequestType &&
        matchesDays &&
        matchesSearch
      );
    });

    console.log("Filtered requests:", filtered);
    return filtered;
  };

  const downloadCSV = (data) => {
    let csvRows;
    console.log(data);
    if (selectedStatus === "cugNumber") {
      const csvData = data.map((row) => ({
        cugNumber: row.cugNumber || "",
        status: row.status || "",
        employeeCode: row.employeeCode || "",
        employeeName: row.employeeName || "",
        telecomPartner: row.telecomPartner || "",
        rechargePlan: row.rechargePlan || "",
        assignedDate: row.assignedDate
          ? new Date(row.assignedDate).toLocaleDateString('en-GB')
          : "",
      }));

      csvRows = [
        [
          "CUG Number",
          "Status",
          "Employee Code",
          "Employee Name",
          "Telecom Partner",
          "Recharge Plan",
          "Assigned Date",
        ],
        ...csvData.map((row) => [
          row.cugNumber,
          row.status,
          row.employeeCode,
          row.employeeName,
          row.telecomPartner,
          row.rechargePlan,
          row.assignedDate,
        ]),
      ];
    } else if (selectedStatus === "specialNumber") {
      const csvData = data.map((row) => ({
        cugNumber: row.cugNumber || "",
        status: row.status || "",
        employeeCode: row.employeeCode || "",
        employeeName: row.employeeName || "",
        telecomPartner: row.telecomPartner || "",
        rechargePlan: row.rechargePlan || "",
        assignedDate: row.assignedDate
          ? new Date(row.assignedDate).toLocaleDateString('en-GB')
          : "",
      }));

      csvRows = [
        [
          "Special Number",
          "Status",
          "Employee Code",
          "Employee Name",
          "Telecom Partner",
          "Recharge Plan",
          "Assigned Date",
        ],
        ...csvData.map((row) => [
          row.cugNumber,
          row.status,
          row.employeeCode,
          row.employeeName,
          row.telecomPartner,
          row.rechargePlan,
          row.assignedDate,
        ]),
      ];
    } else if (selectedStatus === "all") {
      const csvData = data.map((row) => ({
        employeeName: row.employeeName || "",
        employeeCode: row.employeeCode || "",
        region: row.region || "",
        branchLocation: row.branchLocation || "",
        requestType: row.requestType || "",
        requestStatus: row.requestStatus || "",
        department: row.department || "",
        requestedBy: row.requestedByEmployeeCode
          ? `${row.requestedByEmployeeCode} / ${row.requestedByName || ""}`
          : "",
        requestedDate: row.requestedDate
          ? new Date(row.requestedDate).toLocaleDateString('en-GB')
          : "",
        designation: row.designation || "",
        DOB: row.DOB ? new Date(row.DOB).toLocaleDateString('en-GB') : "",
        personalEmail: row.personalEmail || "",
        personalNumber: row.personalNumber || "",
        simAllocationType: row.SIMALLOCATIONTYPE || "N/A",
        assignedDate: row.assignedDate || "N/A",
        oldUserCugNumber: row.oldUserCugNumber || "",
        oldUserEmployeeCode: row.oldUserEmployeeCode || "",
        rechargePlan: row.rechargePlan || "N/A",
        telecomPartner: row.telecomPartner || "",
      }));

      csvRows = [
        [
          "Employee Name",
          "Employee Code",
          "Region",
          "Branch",
          "Request Type",
          "Status",
          "Department",
          "Requested By",
          "Requested Date",
          "Designation",
          "DOB",
          "Personal Email",
          "Personal Number",
          "SIM Allocation Type",
          "Assigned Date",
          "Old User CUG Number",
          "Old User Employee Code",
          "Recharge Plan",
          "Telecom Partner",
        ],
        ...csvData.map((row) => [
          row.employeeName,
          row.employeeCode,
          row.region,
          row.branchLocation,
          row.requestType,
          row.requestStatus,
          row.department,
          row.requestedBy,
          row.requestedDate,
          row.designation,
          row.DOB,
          row.personalEmail,
          row.personalNumber,
          row.simAllocationType,
          row.assignedDate,
          row.oldUserCugNumber,
          row.oldUserEmployeeCode,
          row.rechargePlan,
          row.telecomPartner,
        ]),
      ];
    } else if (
      selectedStatus === "pending" ||
      selectedStatus === "ongoing" ||
      selectedStatus === "approved"
    ) {
      const csvData = data.map((row) => ({
        employeeName: row.employeeName || "",
        employeeCode: row.employeeCode || "",
        region: row.region || "",
        branchLocation: row.branchLocation || "",
        requestType: row.requestType || "",
        requestStatus: row.requestStatus || "",
        department: row.department || "",
        requestedBy: row.requestedByEmployeeCode
          ? `${row.requestedByEmployeeCode}/${row.requestedByName || ""}`
          : "",
        requestedDate: row.requestedDate
          ? new Date(row.requestedDate).toLocaleDateString('en-GB')
          : "",
        designation: row.designation || "N/A",
        // new code-10-01-2025
        iccidNumber: row.iccidNumber || "N/A",
        imsiNumber: row.imsiNumber || "N/A",
        aadharCardNumber: row.aadharCardNumber || "N/A",
        pinCode: row.pinCode || "N/A",
        updatedAt: row.updatedAt || "N/A",

        DOB: row.DOB ? new Date(row.DOB).toLocaleDateString('en-GB') : "N/A",
        personalEmail: row.personalEmail || "N/A",
        personalNumber: row.personalNumber || "N/A",
        SIMALLOCATIONTYPE: row.SIMALLOCATIONTYPE || "N/A",
        // homeAddress: row.homeAddress || "N/A",
        homeAddress: row.homeAddress
          ? `"${row.homeAddress
              .replace(/"/g, '""')
              .replace(/[\r\n]+/g, " ")
              .replace(/,/g, " ")}"`
          : "N/A",
      }));
      csvRows = [
        [
          "Employee Name",
          "Employee Code",
          "Region",
          "Branch",
          "Request Type",
          "Status",
          "Department",
          "Requested By",
          "Requested Date",
          "Designation",
          // new code-10-01-2025
          "ICCID Number",
          "IMSI Number",
          "AadharCard Number",
          "Pin Code",
          "Updated At",

          "DOB",
          "Personal Email",
          "Personal Number",
          "SIM Allocation Type",
          "Address",
        ],
        ...csvData.map((row) => [
          row.employeeName,
          row.employeeCode,
          row.region,
          row.branchLocation,
          row.requestType,
          row.requestStatus,
          row.department,
          row.requestedBy,
          row.requestedDate,
          row.designation,
          // new code-10-01-2025
          row.iccidNumber,
          row.imsiNumber,
          row.aadharCardNumber,
          row.pinCode,
          row.updatedAt,

          row.DOB,
          row.personalEmail,
          row.personalNumber,
          row.SIMALLOCATIONTYPE,
          row.homeAddress,
        ]),
      ];
    } else {
      const csvData = data.map((row) => ({
        employeeName: row.employeeName || "",
        employeeCode: row.employeeCode || "",
        region: row.region || "",
        branchLocation: row.branchLocation || "",
        requestType: row.requestType || "",
        requestStatus: row.requestStatus || "",
        department: row.department || "",
        requestedBy: row.requestedByEmployeeCode
          ? `${row.requestedByEmployeeCode}/${row.requestedByName || ""}`
          : "",
        requestedDate: row.requestedDate
          ? new Date(row.requestedDate).toLocaleDateString('en-GB')
          : "",
        designation: row.designation || "N/A",
        // new code-10-01-2025
        iccidNumber: row.iccidNumber || "N/A",
        imsiNumber: row.imsiNumber || "N/A",
        aadharCardNumber: row.aadharCardNumber || "N/A",
        pinCode: row.pinCode || "N/A",
        updatedAt: row.updatedAt || "N/A",

        DOB: row.DOB ? new Date(row.DOB).toLocaleDateString('en-GB') : "N/A",
        personalEmail: row.personalEmail || "N/A",
        personalNumber: row.personalNumber || "N/A",
        cugNumber: row.cugNumber || "N/A",
        SIMALLOCATIONTYPE: row.SIMALLOCATIONTYPE || "N/A",
        // homeAddress: row.homeAddress || "N/A",
        homeAddress: row.homeAddress
          ? `"${row.homeAddress
              .replace(/"/g, '""')
              .replace(/[\r\n]+/g, " ")
              .replace(/,/g, " ")}"`
          : "N/A",

        completedby: row.requestCompletedByEmployeeCode
          ? `${row.requestCompletedByEmployeeCode}/${
              row.requestCompletedByName || ""
            }`
          : "",
        assignedDate: row.assignedDate
          ? new Date(row.assignedDate).toLocaleDateString('en-GB')
          : "",
      }));
      csvRows = [
        [
          "Employee Name",
          "Employee Code",
          "Region",
          "Branch",
          "Request Type",
          "Status",
          "Department",
          "Requested By",
          "Requested Date",
          "Designation",
          // new code
          "ICCID Number",
          "IMSI Number",
          "AadharCard Number",
          "Pin Code",
          "Updated At",

          "DOB",
          "Personal Email",
          "Personal Number",
          "CUG Number",
          "SIM Allocation Type",
          "Address",
          "Completed By",
          "Assigned Date",
        ],
        ...csvData.map((row) => [
          row.employeeName,
          row.employeeCode,
          row.region,
          row.branchLocation,
          row.requestType,
          row.requestStatus,
          row.department,
          row.requestedBy,
          row.requestedDate,
          row.designation,
          // new code
          row.iccidNumber,
          row.imsiNumber,
          row.aadharCardNumber,
          row.pinCode,
          row.updatedAt,

          row.DOB,
          row.personalEmail,
          row.personalNumber,
          row.cugNumber,
          row.SIMALLOCATIONTYPE,
          row.homeAddress,
          row.completedby,
          row.assignedDate,
        ]),
      ];
    }
    const csvContent = `data:text/csv;charset=utf-8,${csvRows
      .map((e) => e.join(","))
      .join("\n")}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "sim_records.csv");
    document.body.appendChild(link);
    link.click();
  };

  const renderSidebar = () => {
    switch (role) {
      case "HR":
        return <SidebarHr />;
      case "IT":
        return <SidebarIT />;
      case "Admin":
        return <SidebarAdmin />;
      default:
        return null;
    }
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
            SIM Records
          </Typography>
          <Paper
            style={{
              display: "flex",
              alignItems: "center",
              padding: "0.2rem 0.6rem",

              width: "220px",

              height: "39px",
            }}
          >
            <TextField
              placeholder="Search"
              value={search}
              onChange={handleSearchChange}
              style={{ width: "150px" }}
            />

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
        }}
      >
        {sidebarOpen && renderSidebar()}
        <Box sx={{ flexGrow: 1, padding: 1 }}>
          <Paper
            elevation={3}
            sx={{
              padding: 4,
              backgroundColor: theme.palette.background.paper,
              border: `2px solid ${theme.palette.primary.main}`,
              height: "calc(97vh - 64px)",
              borderRadius: "8px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: 2,
                marginBottom: 2,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Reports</InputLabel>
                <Select
                  value={selectedStatus}
                  onChange={handleStatusChange}
                  label="Reports"
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="ongoing">Ongoing</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>

                  {userRole === "Head Office" && (
                    <MenuItem value="cugNumber">CUG Number</MenuItem>
                  )}
                  {userRole === "Head Office" && (
                    <MenuItem value="specialNumber">Special Number</MenuItem>
                  )}
                  <MenuItem value="approval">Approval Request</MenuItem>
                </Select>
              </FormControl>
              {selectedStatus !== "cugNumber" &&
                selectedStatus !== "specialNumber" && (
                  <>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <InputLabel>Region</InputLabel>
                      <Select
                        value={selectedRegion}
                        onChange={handleRegionChange}
                        label="Region"
                      >
                        <MenuItem value="">
                          <em>All</em>
                        </MenuItem>
                        {regions.map((region, index) => (
                          <MenuItem key={index} value={region.REGION}>
                            {region.REGION}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <InputLabel>Branch</InputLabel>
                      <Select
                        value={selectedBranch}
                        onChange={handleBranchChange}
                        label="Branch"
                        disabled={!selectedRegion}
                      >
                        <MenuItem value="">
                          <em>All</em>
                        </MenuItem>
                        {branches.map((branch, index) => (
                          <MenuItem key={index} value={branch.Branch}>
                            {branch.Branch}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                      <InputLabel>Request Type</InputLabel>
                      <Select
                        value={selectedRequestType}
                        onChange={handleRequestTypeChange}
                        label="Request Type"
                      >
                        <MenuItem value="">
                          <em>All</em>
                        </MenuItem>
                        {requestTypes.map((type, index) => (
                          <MenuItem key={index} value={type}>
                            {type}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <InputLabel>Days</InputLabel>
                      <Select
                        value={filterDays}
                        onChange={handleFilterChange}
                        label="Days"
                      >
                        <MenuItem value="all">All</MenuItem>
                        <MenuItem value="30">Last 30 Days</MenuItem>
                        <MenuItem value="60">Last 60 Days</MenuItem>
                        <MenuItem value="90">Last 90 Days</MenuItem>
                      </Select>
                    </FormControl>
                  </>
                )}

              <IconButton
                color="inherit"
                onClick={() => {
                  let dataToDownload;

                  if (selectedStatus === "cugNumber") {
                    dataToDownload = cugData;
                  } else if (selectedStatus === "specialNumber") {
                    dataToDownload = specialNumber;
                  } else if (selectedStatus === "all") {
                    dataToDownload = filteredalldata();
                  } else {
                    dataToDownload = filteredRequests();
                  }
                  downloadCSV(dataToDownload);
                }}
              >
                <DownloadIcon />
              </IconButton>
            </Box>
            {selectedStatus === "cugNumber" ? (
              <CugNumberTable cugData={cugData} search={search} />
            ) : selectedStatus === "specialNumber" ? (
              <SpecialNumberTable
                specialNumberData={specialNumber}
                search={search}
              />
            ) : selectedStatus === "all" ? (
              <AllTable requests={filteredalldata()} />
            ) : selectedStatus === "approval" ? (
              <ApprovalTable requests={approvalData} />
            ) : (
              <RequestTable
                requests={filteredRequests()}
                selectedStatus={selectedStatus}
              />
            )}
          </Paper>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Component;
