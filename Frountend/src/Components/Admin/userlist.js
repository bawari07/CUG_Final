import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { CheckCircle } from "@mui/icons-material";
import {
  Typography,
  AppBar,
  Toolbar,
  Box,
  TextField,
  InputAdornment,
  Paper,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Button } from "react-bootstrap";
import SidebarAdmin from "../Sidebar/SidebarAdmin";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import ThemeToggle from "../other/themetoggle";
import { getUsers, deactivateUser } from "../../Services/Api";
import { keyframes } from "@emotion/react";
import SuccessModal from "./successmodal";

const shineAnimation = keyframes`
  0% {
    background-position: 200% center;
  }
  100% {
    background-position: -200% center;
  }
`;

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loadingRequests, setLoadingRequests] = useState(true);

  const [userStatuses, setUserStatuses] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

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

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userData = await getUsers();
        console.log("Fetched user data:", userData);
        setUsers(userData);

        const initialStatuses = {};
        userData.forEach((user) => {
          initialStatuses[user.employeeCode] = user.isActive
            ? "Active"
            : "Deactivated";
        });
        setUserStatuses(initialStatuses);
        setLoadingRequests(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to fetch user data");
        setLoadingRequests(false);
      }
    };

    fetchUsers();
  }, []);

  const handleOpenDialog = (user) => {
    setSelectedUser(user);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
  };

  const handleConfirmToggle = async () => {
    if (selectedUser) {
      try {
        await deactivateUser(selectedUser.employeeCode);
        
        // Update the user status
        const newStatus = userStatuses[selectedUser.employeeCode] === "Active" ? "Deactivated" : "Active";
        setUserStatuses((prevStatuses) => ({
          ...prevStatuses,
          [selectedUser.employeeCode]: newStatus,
        }));

        // Set success message based on status change
        if (newStatus === "Deactivated") {
          setSuccessMessage("User deactivated successfully.");
        } else {
          setSuccessMessage("User activated successfully.");
        }

        setShowSuccessModal(true); // Show success modal
        handleCloseDialog();
      } catch (error) {
        console.error("Error deactivating user:", error);
        setError("Failed to update user status");
        handleCloseDialog();
      }
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const columns = [
    { field: "sno", headerName: "Sr.No.", width: 80 },
    { field: "employeeCode", headerName: "Employee Code", width: 150 },
    { field: "employeeName", headerName: "Employee Name", width: 150 },
    { field: "roleName", headerName: "Role Name", width: 100 },
    { field: "regionName", headerName: "Region Name", width: 200 },
    { field: "email", headerName: "Email", width: 300 },
    {
      field: "status",
      headerName: "Status",
      width: 180,
      renderCell: (params) => (
        <Button
          variant="outlined"
          style={{
            borderColor:
              userStatuses[params.row.employeeCode] === "Active"
                ? "green"
                : "red",
            color:
              userStatuses[params.row.employeeCode] === "Active"
                ? "green"
                : "red",
            backgroundColor:
              userStatuses[params.row.employeeCode] === "Active"
                ? "transparent"
                : "rgba(255, 0, 0, 0.1)",
          }}
          startIcon={
            <CheckCircle
              style={{
                color:
                  userStatuses[params.row.employeeCode] === "Active"
                    ? "green"
                    : "red",
              }}
            />
          }
          onClick={() =>
            handleOpenDialog({
              ...params.row,
              isActive: userStatuses[params.row.employeeCode] === "Active",
            })
          }
        >
          {userStatuses[params.row.employeeCode]}
        </Button>
      ),
    },
  ];

  const filteredRows = users
    .filter(
      (user) =>
        user.employeeCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.roleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.regionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .map((user, index) => ({
      id: user.employeeCode || index,
      sno: index + 1,
      employeeCode: user.employeeCode,
      employeeName: user.employeeName,
      roleName: user.roleName,
      regionName: user.regionName,
      email: user.email,
    }));

  console.log("Rows:", filteredRows);

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
            Users List
          </Typography>
          <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          display: "flex",
          minHeight: "100vh",
          backgroundColor: theme.palette.background.default,
          paddingTop: "64px",
          overflow: "hidden",
          marginLeft: "-15.5rem",
        }}
      >
        {sidebarOpen && <SidebarAdmin />}
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
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 2,
                height: "3rem",
                width: "100%",
              }}
            >
              <TextField
                variant="outlined"
                size="small"
                placeholder="Search ..."
                value={searchQuery}
                onChange={handleSearchChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <div
              style={{
                height: "100%",
                width: "100%",
                background: `linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 100%)`,
                animation: `${shineAnimation} 1.5s infinite`,
              }}
            >
              <DataGrid
                rows={filteredRows}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10, 25, 50]}
                loading={loadingRequests}
              />
            </div>
          </Paper>
        </Box>
      </Box>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Status Change</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to toggle the status of employee{" "}
            {selectedUser?.employeeName} ({selectedUser?.employeeCode})?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleConfirmToggle} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <SuccessModal
        open={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message={successMessage} 
      />
    </ThemeProvider>
  );
};

export default UserList;
