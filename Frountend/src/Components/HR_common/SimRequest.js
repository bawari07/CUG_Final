import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Hrsimrequest, getEmployeeDetails } from "../../Services/Api";
import {
  Globe,
  Building,
  PersonBadge,
  Telephone,
  Envelope,
  Calendar,
  Briefcase,
  Person,
  Dropbox,
  ChatText,
} from "react-bootstrap-icons";
import {
  Paper,
  Box,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import ThemeToggle from "../other/themetoggle";
import { FaEdit, FaCrown } from "react-icons/fa";
import "./ReqHR.css";
import SidebarHr from "../Sidebar/SidebarHr";
import { CssBaseline } from "@mui/material";
import NoEmployeeModal from "./noemployeecodemodal";
import SuccessModal from "../HR_common/hrsuccessmodal";
import ErrorModal from "./hrerrormodal";
import WarningModal from "./warningmodal";
import VipModal from "./vipmodal";

function ReqHR() {
  const [region, setRegion] = useState("");
  const [department, setDepartment] = useState("");
  const [employeeCode, setEmployeeCode] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [personalNumber, setPersonalNumber] = useState("");
  const [personalEmail, setPersonalEmail] = useState("");
  const [workEmail, setworkEmail] = useState("");
  const [dob, setDob] = useState("");
  const [designation, setDesignation] = useState("");
  const [branchLocation, setBranchLocation] = useState("");
  const [homeAddress, setHomeAddress] = useState("");
  // new code
  const [pinCode, setPincode] = useState(""); 

  const [errorMessages, setErrorMessages] = useState([]);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showOldSimFields, setShowOldSimFields] = useState(false);
  const [requestType, setRequestType] = useState("");
  const [showAllFields, setShowAllFields] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [aadharCardNumber, setAadharCardNumber] = useState("");
  const [panCardNumber, setPanCardNumber] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [SuccessModalOpen, setSuccessModalOpen] = useState(false);
  const [ErrorModalOpen, setErrorModalOpen] = useState(false);
  const [noEmployeeModalOpen, setNoEmployeeModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [employeedetails, setEmployeedetails] = useState({});
  const [remark, setRemark] = useState("");
  const [kingMode, setKingMode] = useState(false);
  const [vipModalOpen, setVipModalOpen] = useState(false);
  const [specialNumber, setSpecialNumber] = useState(false);
  const [isHeadOffice, setIsHeadOffice] = useState(false);

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
      }),
    [darkMode]
  );

  const navigate = useNavigate();

  useEffect(() => {
    const storedRegion = localStorage.getItem("region");
    setRegion(storedRegion || "");

    setIsHeadOffice(storedRegion === "Head Office");
  }, []);

  const generateRandomEmployeeCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  useEffect(() => {
    if (kingMode) {
      setEmployeeCode(generateRandomEmployeeCode());
      handleReset();
    }
  }, [kingMode]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!remark) {
      setErrorMessage("Remark is mandatory");
      setErrorModalOpen(true);
      return;
    }

    // new 
    if (!pinCode) {
      setErrorMessage("Pincode is mandatory");
      setErrorModalOpen(true);
      return;
    }


    const ReqData = {
      requestType,
      region,
      department,
      employeeCode: kingMode ? generateRandomEmployeeCode() : employeeCode,
      employeeName,
      personalNumber,
      personalEmail,
      dob,
      designation,
      branchLocation,
      homeAddress,
      pinCode, // Include pincode in the request data
      workEmail,
      aadharCardNumber,
      panCardNumber,
      remarksByHR: remark,
      specialNumber: kingMode ? 1 : 0,
    };

    try {
      const response = await Hrsimrequest(ReqData);
      console.log("CUG Sim Request sent successfully:", response);
      setSuccessModalOpen(true);
      handleReset();
    } catch (error) {
      console.error("Error adding request:", error);

      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setErrorMessage("Employee request already exists");
        setErrorModalOpen(true);
      } else {
        setErrorMessages(["Failed to send Request. Please try again later."]);
        setShowErrorModal(true);
      }
      handleReset();
    }
  };

  useEffect(() => {
    setShowAllFields(requestType === "Activation");
  }, [requestType]);

  const handleReset = () => {
    setRegion("");
    setDepartment("");
    setEmployeeCode("");
    setEmployeeName("");
    setPersonalNumber("");
    setPersonalEmail("");
    setDob("");
    setDesignation("");
    setBranchLocation("");
    setShowOldSimFields("");
    setHomeAddress("");
    // new code
    setPincode(""); 
    setErrorMessages([]);
    setShowErrorModal(false);
    setRequestType("");
    setShowAllFields(false);
    setworkEmail("");
    setAadharCardNumber("");
    setPanCardNumber("");
    setRemark("");
    setSpecialNumber(kingMode);
  };

  const handleEditClick = () => {
    setEditMode(!editMode);
  };

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      if (employeeCode && !kingMode) {
        try {
          const { employeeInfo } = await getEmployeeDetails(employeeCode);
          if (employeeInfo && employeeInfo.length > 0) {
            const employee = employeeInfo[0];
            setEmployeedetails(employee);
            if (employee["employee Status"] != "Active") {
              setShowWarningModal(true);
            }
            const fullName = `${employee["first name"] || ""} ${
              employee["middle name"] || ""
            } ${employee["last name"] || ""}`.trim();

            setEmployeeName(fullName || null);
            setDepartment(employee.department || null);
            setDesignation(employee.designation || null);
            setPersonalNumber(employee["personal Contact Number"] || null);
            setPersonalEmail(employee["personal email"] || null);
            setworkEmail(employee["work email"] || null);
            const address = employee["permanent Address"] || null;
            const formattedAddress = address ? formatAddress(address) : null;
            setHomeAddress(formattedAddress);
            
            // new code
            setPincode(employee["permanent pin"] || null);
            setRegion(employee["region"] || null);
            setBranchLocation(employee["branches"] || null);
            setDob(formatDate(employee["date of birth"]) || null);
            setAadharCardNumber(employee["aadhar no."] || null);
            setPanCardNumber(employee["pan no."] || null);
            setDataLoaded(true);
          } else {
            console.log("no employee exist");
            setNoEmployeeModalOpen(true);
          }
        } catch (error) {
          console.error("Error fetching employee details:", error);
          setDataLoaded(false);
        }
      } else {
        handleReset();
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        fetchEmployeeDetails();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [employeeCode, kingMode]);

  useEffect(() => {
    if (dataLoaded && employeeCode) {
      handleReset();
      setDataLoaded(false);
    }
  }, [employeeCode]);

  const formatAddress = (address) => {
    const parts = address
      .split(/VTC:|Dist:|Stat:|pin code:|,/i)
      .map((part) => part.trim())
      .filter((part) => part.length > 0);

    const addressParts = {
      village: parts[0] || "",
      vtc: parts[1] || "",
      district: parts[2] || "",
      state: parts[3] || "",
      pinCode: parts[4] || "",
    };

    return `Village: ${addressParts.village}, VTC: ${addressParts.vtc},  ${addressParts.district}, State: ${addressParts.state}, ${addressParts.pinCode}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const maskAadharNumber = (number=[]) => {
    if (number?.length > 4) {
      return "*".repeat(number?.length - 4) + number?.slice(-4);
    }
    return number;
  };

  const handlewarningconfirm = () => {
    setShowWarningModal(false);
  };

  const handlewarningcancel = () => {
    setShowWarningModal(false);
    handleReset();
  };

  const handleKingModeToggle = () => {
    if (!kingMode) {
      setVipModalOpen(true);
    } else {
      setKingMode(false);
      setSpecialNumber(false);
    }
  };

  const handleVipModalYes = () => {
    setVipModalOpen(false);
    setKingMode(true);
    setSpecialNumber(true);
    setEmployeeCode(generateRandomEmployeeCode());
    handleReset();
  };

  const handleVipModalClose = () => {
    setVipModalOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <AppBar
        position="fixed"
        sx={{
          backgroundColor:
            theme.palette.mode === "dark" ? "#1a1a1a" : "#003366",
          zIndex: 1000,
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0.5rem 1rem",
          }}
        >
          <Box sx={{ flexGrow: 1 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, ml: -1 }}>
            Sim Request
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {isHeadOffice && (
              <IconButton
                size="large"
                color="inherit"
                aria-label="king mode"
                onClick={handleKingModeToggle}
                sx={{
                  width: 40,
                  height: 40,
                  backgroundColor: kingMode
                    ? "rgba(255, 215, 0, 0.2)"  
                    : "transparent",
                  "&:hover": {
                    backgroundColor: kingMode
                      ? "rgba(255, 215, 0, 0.3)"
                      : "rgba(255, 255, 255, 0.08)",
                  },
                }}
              >
                <FaCrown size={24} color={kingMode ? "#FFD700" : "#ffffff"} />
              </IconButton>
            )}
            <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          display: "flex",
          // minHeight: "calc(100vh - 64px)",
          minHeight: "calc(120vh - 64px)",
          backgroundColor: theme.palette.background.default,
          paddingTop: "64px",
          overflow: "hidden",
        }}
      >
        <SidebarHr
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
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
              // height: "calc(97vh - 64px)",
              // new code
              height: "calc(107vh - 64px)",
            }}
          >
            <div className="my-container-hr">
              <form
                onSubmit={handleSubmit}
                onReset={handleReset}
                className="my-form"
              >
                <div className="row">
                  {!kingMode && (
                    <div className="form-group col-4 ">
                      <label
                        htmlFor="employeeCode"
                        className="my-label"
                        style={{ color: theme.palette.text.primary }}
                      >
                        <Person className="m-1" />
                        Employee Code
                      </label>
                      <span className="mandatory">*</span>
                      <input
                        type="text"
                        id="employeeCode"
                        value={employeeCode}
                        onChange={(e) => {
                          const value = e.target.value;
                          // new code added
                          if (/^\d*$/.test(value) && value.length <= 10) {
                            setEmployeeCode(value);
                          }
                        }}
                        required
                        maxLength="10"
                        placeholder="Enter Employee Code"
                      />
                    </div>
                  )}
                  <div className="form-group col-4 ">
                    <label
                      htmlFor="employeeName"
                      className="my-label"
                      style={{ color: theme.palette.text.primary }}
                    >
                      <PersonBadge className="m-1" />
                      Employee Name
                    </label>
                    <span className="mandatory">*</span>
                    <input
                      type="text"
                      id="employeeName"
                      value={employeeName}
                      onChange={(e) => setEmployeeName(e.target.value)}
                      required
                      placeholder="Enter Employee Name"
                      readOnly={!kingMode}
                    />
                  </div>

                  <div className="form-group col-4 ">
                    <label
                      htmlFor="dob"
                      className="my-label"
                      style={{ color: theme.palette.text.primary }}
                    >
                      <Calendar className="m-1" /> Date of Birth
                      <span className="mandatory">*</span>
                    </label>
                    <input
                      type="date"
                      id="dob"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      max={getTodayDate()}
                      required
                      readOnly={!kingMode}
                    />
                  </div>
                  <div className="form-group activation-fields col-4">
                    <label
                      htmlFor="region"
                      className="my-label"
                      style={{ color: theme.palette.text.primary }}
                    >
                      <Globe className="m-1" />
                      Region
                      <span className="mandatory">*</span>
                    </label>
                    <input
                      type="text"
                      id="region"
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      required
                      placeholder="Region"
                      readOnly={!kingMode}
                    />
                  </div>
                  <div className="form-group activation-fields col-4">
                    <label
                      htmlFor="branchLocation"
                      className="my-label"
                      style={{ color: theme.palette.text.primary }}
                    >
                      <Building className="m-1" />
                      Branch/Location
                      <span className="mandatory">*</span>
                    </label>
                    <input
                      type="text"
                      id="branchLocation"
                      value={branchLocation}
                      onChange={(e) => setBranchLocation(e.target.value)}
                      required
                      placeholder="Branch"
                      readOnly={!kingMode}
                    />
                  </div>
                  <div className="form-group col-4">
                    <label
                      htmlFor="department"
                      className="my-label"
                      style={{ color: theme.palette.text.primary }}
                    >
                      <Briefcase className="m-1" /> Department
                    </label>
                    <span className="mandatory">*</span>
                    <input
                      type="text"
                      id="department"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      required
                      placeholder="Enter Department"
                      readOnly={!kingMode}
                    />
                  </div>
                  <div className="form-group col-4">
                    <label
                      htmlFor="designation"
                      className="my-label"
                      style={{ color: theme.palette.text.primary }}
                    >
                      <Briefcase className="m-1" />
                      Designation
                    </label>
                    <span className="mandatory">*</span>
                    <input
                      type="text"
                      id="designation"
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      required
                      placeholder="Enter Designation"
                      readOnly={!kingMode}
                    />
                  </div>
                  <div className="form-group activation-fields col-4">
                    <label
                      htmlFor="personalNumber"
                      className="my-label"
                      style={{ color: theme.palette.text.primary }}
                    >
                      <Telephone className="m-1" /> Personal Number
                    </label>
                    <span className="mandatory">*</span>
                    <div className="input-container">
                      <input
                        type="tel"
                        id="personalNumber"
                        value={personalNumber}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^\d{0,10}$/.test(value)) {
                            setPersonalNumber(value);
                          }
                        }}
                        required
                        maxLength="10"
                        placeholder="Enter Personal Number"
                        readOnly={!kingMode && !editMode}
                      />
                      {!kingMode && (
                        <FaEdit
                          className="ml-2"
                          style={{ cursor: "pointer" }}
                          onClick={handleEditClick}
                          title={
                            editMode ? "Disable editing" : "Enable editing"
                          }
                        />
                      )}
                    </div>
                  </div>

                  <div className="form-group col-4">
                    <label
                      htmlFor="personalEmail"
                      className="my-label"
                      style={{ color: theme.palette.text.primary }}
                    >
                      <Envelope className="m-1" />
                      Email Id
                    </label>
                    <span className="mandatory">*</span>
                    <div className="input-container">
                      <input
                        type="email"
                        id="email"
                        value={workEmail || personalEmail}
                        onChange={(e) => setPersonalEmail(e.target.value)}
                        required
                        placeholder="Enter Email"
                        readOnly={!kingMode && !editMode}
                      />
                      {!kingMode && (
                        <FaEdit
                          className="ml-2"
                          style={{ cursor: "pointer" }}
                          onClick={handleEditClick}
                          title={
                            editMode ? "Disable editing" : "Enable editing"
                          }
                        />
                      )}
                    </div>
                  </div>
                  <div className="form-group col-4 ">
                    <label
                      htmlFor="aadharCardNumber"
                      className="my-label"
                      style={{ color: theme.palette.text.primary }}
                    >
                      <Person className="m-1" />
                      Aadhar Number
                    </label>
                    <span className="mandatory">*</span>
                    <input
                      type="text"
                      id="aadharCardNumber"
                      value={
                        kingMode
                          ? aadharCardNumber
                          : maskAadharNumber(aadharCardNumber)
                      }
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*$/.test(value) && value.length <= 12) {
                          setAadharCardNumber(value);
                        }
                      }}
                      required
                      maxLength="12"
                      placeholder="Enter Aadhar Number "
                      readOnly={!kingMode}
                    />
                  </div>
                  <div className="form-group col-4">
                    <label
                      htmlFor="panCardNumber"
                      className="my-label"
                      style={{ color: theme.palette.text.primary }}
                    >
                      <Briefcase className="m-1" /> Pan Number
                    </label>
                    <span className="mandatory">*</span>
                    <input
                      type="text"
                      id="panCardNumber"
                      value={panCardNumber}
                      onChange={(e) => setPanCardNumber(e.target.value)}
                      required
                      placeholder="Enter Pan Number"
                      readOnly={!kingMode}
                    />
                  </div>
                  <div className="form-group col-4 ">
                    <label
                      htmlFor="homeAddress"
                      className="my-label"
                      style={{ color: theme.palette.text.primary }}
                    >
                      <Building className="m-1" />
                      Home Address
                    </label>
                    <span className="mandatory">*</span>
                    <input
                      type="text"
                      id="homeAddress"
                      value={homeAddress}
                      onChange={(e) => setHomeAddress(e.target.value)}
                      required
                      placeholder="Enter Home Address"
                      readOnly={!kingMode}
                    />
                  </div>
                  <div className="form-group col-4">
                    <label
                      htmlFor="pincode"
                      className="my-label"
                      style={{ color: theme.palette.text.primary }}
                    >
                      <Building className="m-1" />
                      Pincode
                    </label>
                    <span className="mandatory">*</span>
                    <input
                      type="text"
                      id="pincode"
                      value={pinCode}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*$/.test(value) && value.length <= 6) {
                          setPincode(value);
                        }
                      }}
                      required
                      maxLength="6"
                      placeholder="Enter Pincode"
                      readOnly={!kingMode}
                    />
                  </div>
                  <div className="form-group col-4 ">
                    <label
                      htmlFor="requestType"
                      className="my-label"
                      style={{ color: theme.palette.text.primary }}
                    >
                      <Dropbox className="m-1" />
                      Request Type
                    </label>
                    <span className="mandatory">*</span>
                    <select
                      id="requestType"
                      value={requestType}
                      onChange={(e) => setRequestType(e.target.value)}
                      required
                    >
                      <option value="" disabled>
                        Select Request Type
                      </option>
                      <option value="Activation">Activation</option>
                      {!kingMode && (
                        <>
                          <option value="Deactivation">Deactivation</option>
                          <option value="Suspension">Suspension</option>
                        </>
                      )}
                    </select>
                  </div>
                  <div className="form-group col-4">
                    <label
                      htmlFor="remark"
                      className="my-label"
                      style={{ color: theme.palette.text.primary }}
                    >
                      <ChatText className="m-1" />
                      Remark
                    </label>
                    <input
                      type="text"
                      id="remark"
                      value={remark}
                      onChange={(e) => setRemark(e.target.value)}
                      placeholder="Add any remarks here"
                    />
                  </div>
                  <div
                    className="form-group col-4"
                    style={{
                      marginTop: "15px",
                      display: "flex",
                      justifyContent: kingMode ? "center" : "flex-start",
                      gap: "10px",
                      marginLeft: kingMode ? "280px" : "0px",
                    }}
                  >
                    <button type="submit" className="mybutton">
                      Submit
                    </button>
                    <button type="reset" className="mybutton">
                      Reset
                    </button>
                  </div>
                </div>
              </form>
              <NoEmployeeModal
                open={noEmployeeModalOpen}
                handleClose={() => setNoEmployeeModalOpen(false)}
              />
              <SuccessModal
                open={SuccessModalOpen}
                handleClose={() => setSuccessModalOpen(false)}
              />
              <ErrorModal
                open={ErrorModalOpen}
                handleClose={() => setErrorModalOpen(false)}
                errorMessage={errorMessage}
              />
              <WarningModal
                open={showWarningModal}
                onClose={handlewarningcancel}
                onConfirm={handlewarningconfirm}
                status={employeedetails["employee Status"]}
              />
              <VipModal
                open={vipModalOpen}
                onClose={handleVipModalClose}
                onYes={handleVipModalYes}
              />
            </div>
          </Paper>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default ReqHR;
