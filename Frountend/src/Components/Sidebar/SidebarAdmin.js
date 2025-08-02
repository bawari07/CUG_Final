import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  IconButton,
  Modal,
  Button,
  useTheme,
  Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  PowerSettingsNew as PowerSettingsNewIcon,
  ExpandLess,
  ExpandMore,
  Add as AddIcon,
  ListAlt as ListAltIcon,
  TrackChanges as TrackChangesIcon,
} from "@mui/icons-material";
import "./Sidebar.css";

const SidebarAdmin = () => {
  const navigate = useNavigate();
  const [showAdminOptions, setShowAdminOptions] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleAdminOptions = () => {
    setShowAdminOptions(!showAdminOptions);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };
  const theme = useTheme();
  const handleCreateAccountClick = () => {
    navigate("/NewUserForm");
  };

  const handleUserListClick = () => {
    navigate("/userlist");
  };
  
  const goToReviewRequestForm = () => {
    navigate("/Simtracker");
  };
  

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <>
      <Drawer
        variant="permanent"
        open={isSidebarOpen}
        sx={{
          width: isSidebarOpen ? 240 : 72,
          flexShrink: 0,
         
          "& .MuiDrawer-paper": {
            width: isSidebarOpen ? 240 : 72,
            boxSizing: "border-box",
            transition: "width 0.3s",

            backgroundColor:
              theme.palette.mode === "dark" ? "#2a2a2a" : "#003366",
            color: "white",
            overflow: "hidden",
          },
        }}
      >
        
        <List>
        <ListItemIcon>
        <IconButton
          onClick={toggleSidebar}
          className="in_out"
          sx={{
            margin: "8px",
            ml: "auto",
            color: "white",
          }}
        >
          <MenuIcon />
        </IconButton>
        </ListItemIcon>
          <ListItem button onClick={() => navigate("/dashboard")}>
            <ListItemIcon sx={{ color: "white" }}>
            <i className="fs-4 bi-speedometer2"></i>
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem button onClick={toggleAdminOptions}>
            <ListItemIcon sx={{ color: "white" }}>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="User Management" />
            {showAdminOptions ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={showAdminOptions} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem
                button
                sx={{ pl: 4 }}
                onClick={handleCreateAccountClick}
              >
                <ListItemIcon sx={{ color: "white" }}>
                 
                  <i className="fs-4 bi-journal-plus"></i>
                </ListItemIcon>
                <ListItemText primary="Create Account" />
              </ListItem>
              <ListItem button sx={{ pl: 4 }} onClick={handleUserListClick}>
                <ListItemIcon sx={{ color: "white" }}>
                  <ListAltIcon />
                </ListItemIcon>
                <ListItemText primary="User List" />
              </ListItem>
            </List>
          </Collapse>
          <ListItem
            button
            onClick={goToReviewRequestForm}
            sx={{
              justifyContent: isSidebarOpen ? "flex-start" : "center",
              minHeight: "50px",
              paddingLeft: isSidebarOpen ? "10px" : "30px",
            }}
          >
            <ListItemIcon sx={{ color: "white" }}>
            <TrackChangesIcon />
            </ListItemIcon>
            {isSidebarOpen && <ListItemText primary="Sim Record" />}
          </ListItem>
          <ListItem button onClick={() => setShowLogoutModal(true)}>
            <ListItemIcon sx={{ color: "white" }}>
            <i className="fs-4 bi-box-arrow-right"></i>
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Drawer>

      <Modal
        open={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            bgcolor: "background.paper",
            border: "3px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <h2 id="modal-title">Confirm Logout</h2>
          <p id="modal-description">Are you sure you want to log out?</p>
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
            <Button onClick={() => setShowLogoutModal(false)} color="inherit">
              Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default SidebarAdmin;

