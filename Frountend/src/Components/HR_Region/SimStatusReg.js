import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HRstatus } from "../../Services/Api";
import SidebarHr from "../Sidebar/SidebarHr";
import "../HR_HO/SimStatus.css";
import { DataGrid } from "@mui/x-data-grid";
import { FaInfoCircle } from "react-icons/fa";
import HrMoreDetails from "../HR_common/HrMoreDetails";
import { TextField, InputAdornment, Grid, Paper } from "@mui/material";
import { Search } from "@mui/icons-material";

function SimStatus() {
  const [region, setRegion] = useState("");
  const [requests, setRequests] = useState([]);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [requestsError, setRequestsError] = useState(null);
  const [showMoreDetails, setShowMoreDetails] = useState(false);
  const [currentRequest, setCurrentRequest] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedRegion = localStorage.getItem("region");
    setRegion(storedRegion);
    console.log("Stored Region:", storedRegion);

    async function fetchAllRequests() {
      try {
        setLoadingRequests(true);
        const requestsResponse = await HRstatus({ region: storedRegion });
        console.log("All Requests Response:", requestsResponse.data);

        const regionFilteredRequests = requestsResponse.data.filter(
          (request) => request.region === storedRegion
        );
        setRequests(regionFilteredRequests);
        setFilteredRequests(regionFilteredRequests);
      } catch (error) {
        console.error("Error fetching all requests:", error);
        setRequestsError("Failed to load requests");
        setShowErrorModal(true);
      } finally {
        setLoadingRequests(false);
      }
    }

    fetchAllRequests();
  }, []);

  const handleMoreDetails = (request) => {
    setCurrentRequest(request);
    setShowMoreDetails(true);
  };

  const handleMoreDetailsClose = () => {
    setShowMoreDetails(false);
    setCurrentRequest({});
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const columns = [
    { field: "id", headerName: "S.No", width: 70 },
    { field: "employeeCode", headerName: "Employee Code", width: 150 },
    { field: "employeeName", headerName: "Employee Name", width: 200 },
    { field: "simNumber", headerName: "CUG Number", width: 150 },
    {
      field: "simAllocationType",
      headerName: "SIM Allocation Type",
      width: 200,
    },
    { field: "CompletedBy", headerName: "Requested Completed By", width: 200 },
    { field: "requestStatus", headerName: "Request Status", width: 150 },
    { field: "vendorName", headerName: "Vendor Name", width: 200 },
    {
      field: "moreDetails",
      headerName: "More Details",
      width: 150,
      renderCell: (params) => (
        <FaInfoCircle
          style={{ cursor: "pointer" }}
          title="More Details"
          onClick={() => handleMoreDetails(params.row)}
        />
      ),
    },
  ];

  const filteredRows = filteredRequests
    .filter(
      (request) =>
        request.employeeCode
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        request.employeeName
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        request.simNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.vendorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.simAllocationType
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase())
    )
    .map((request, index) => ({
      id: index + 1,
      employeeCode: request.employeeCode || "null",
      employeeName: request.employeeName || "null",
      simNumber: request.simNumber || "null",
      simAllocationType: request.simAllocationType || "null",
      CompletedBy: request.CompletedBy || "null",
      requestStatus: request.requestStatus || "null",
      vendorName: request.vendorName || "null",
      ...request,
    }));

  return (
    <div className="sim-status-container">
      <div className="sim-status-row">
        <SidebarHr
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <div
          className={`sim-status-content ${
            isSidebarOpen
              ? "sim-status-content-expanded"
              : "sim-status-content-collapsed"
          }`}
        >
          <div className="sim-status-form-section">
            <h1 className="sim-status-title">Sim Status</h1>
            <div className="error-container"></div>
          </div>

          {/* Search Bar */}
          <Grid
            container
            alignItems="center"
            justifyContent="flex-end"
            style={{ marginBottom: "1rem" }}
          >
            <Grid item>
              <Paper
                style={{
                  padding: "6px",
                  width: "100%",
                  maxWidth: "15rem",
                  display: "inline-block",
                }}
              >
                <TextField
                  variant="outlined"
                  fullWidth
                  value={searchQuery}
                  onChange={handleSearchChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                  placeholder="Search"
                />
              </Paper>
            </Grid>
          </Grid>
          <div className="sim-status-table-section">
            <DataGrid
              rows={filteredRows}
              columns={columns}
              pageSize={10}
              loading={loadingRequests}
              autoHeight
              disableSelectionOnClick
            />
          </div>
        </div>
      </div>
      <HrMoreDetails
        show={showMoreDetails}
        handleClose={handleMoreDetailsClose}
        currentRequest={currentRequest}
      />
    </div>
  );
}

export default SimStatus;
