import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import {
  getLoginTypes,
  createUser,
  getEmployeeDetails,
} from "../../Services/Api";
import PasswordStrengthMeter from "./PasswordStrengthMeter";
import {
  PersonPlus,
  Globe,
  Building,
  PersonBadge,
  Person,
  Telephone,
  Envelope,
  Key,
} from "react-bootstrap-icons";
import { Paper, Box, Typography, AppBar, Toolbar } from "@mui/material";
import ErrorDialog from "./error";

import "./NewUserForm.css";
import SidebarAdmin from "../Sidebar/SidebarAdmin";
import { FaEdit, FaLock, FaUserTag } from "react-icons/fa";
import { Eye, EyeSlash } from "react-bootstrap-icons";
import NoEmployeeModal from "../HR_common/noemployeecodemodal";
import SuccessModal from "./newusersuccessmodal";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import ThemeToggle from "../other/themetoggle";
import { CssBaseline } from "@mui/material";

function NewUserForm() {
  const [loginTypes, setLoginTypes] = useState([]);
  const [region, setRegion] = useState("");
  const [branch, setBranch] = useState("");
  const [employeeCode, setEmployeeCode] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loginType, setLoginType] = useState("");
  const [errorMessages, setErrorMessages] = useState([]);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loadingLoginTypes, setLoadingLoginTypes] = useState(false);
  const [loginTypesError, setLoginTypesError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [SuccessModalOpen, setSuccessModalOpen] = useState(false);
  const [noEmployeeModalOpen, setNoEmployeeModalOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

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
    const fetchLoginTypes = async () => {
      try {
        setLoadingLoginTypes(true);
        const response = await getLoginTypes();
        setLoginTypes(response);
      } catch (error) {
        setLoginTypesError("Failed to load login types");
        console.error("Error fetching login types:", error);
      } finally {
        setLoadingLoginTypes(false);
      }
    };

    fetchLoginTypes();
  }, []);

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return passwordRegex.test(password);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();

    const errors = [];

    if (password !== confirmPassword) {
      errors.push("Passwords do not match");
    }

    if (!validatePassword(password)) {
      errors.push(
        "Password must be at least 8 characters long, contain at least one special character, one uppercase letter, and one numeric digit."
      );
    }

    if (errors.length > 0) {
      setErrorMessages(errors);
      setShowErrorModal(true);
      return;
    }

    setErrorMessages([]);
    setShowErrorModal(false);

    const newUser = {
      region,
      branch: branch,
      employeeCode,
      employeeName,
      mobileNo,
      email,
      password,
      loginType,
    };
    try {
      const response = await createUser(newUser);
      console.log("User created successfully:", response);
      setShowSuccessModal(true);
      handleReset();
    } catch (error) {
      console.error("Error creating user:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setErrorMessages([error.response.data.message]);
      } else {
        setErrorMessages(["Failed to create user. Please try again later."]);
      }
      setShowErrorModal(true);
    }
  };

  const handleReset = () => {
    setRegion("");
    setBranch("");
    setEmployeeCode("");
    setEmployeeName("");
    setMobileNo("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setLoginType("");
    setErrorMessages([]);
  };

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    handleReset();
  };

  const passwordRequirementsTooltip = (
    <Tooltip id="password-requirements-tooltip">
      Password must be at least 8 characters long,
      <br />
      contain at least one special character,
      <br />
      one uppercase letter, and one numeric digit.
    </Tooltip>
  );

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      if (employeeCode) {
        try {
          const { employeeInfo } = await getEmployeeDetails(employeeCode);

          if (employeeInfo && employeeInfo.length > 0) {
            const employee = employeeInfo[0];
            const fullName = `${employee["first name"] || ""} ${
              employee["middle name"] || ""
            } ${employee["last name"] || ""}`.trim();

            setEmployeeName(fullName || null);
            setRegion(employee["region"] || null);
            setBranch(employee["branches"] || null);
            setEmail(employee["work email"] || null);
            setMobileNo(employee["mobile number"] || null);

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
  }, [employeeCode]);

  useEffect(() => {
    if (dataLoaded && employeeCode) {
      handleReset();
      setDataLoaded(false);
    }
  }, [employeeCode]);
  const handleEditClick = () => {
    setEditMode(!editMode);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <AppBar position="fixed" sx={{ backgroundColor: "#003366" }}>
        <Toolbar sx={{ justifyContent: "center" }}>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, textAlign: "center" }}
          >
            Create Account
          </Typography>
          <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          display: "flex",
          // maxHeight:"105vh",
          minHeight: "100vh",
          backgroundColor: theme.palette.background.default,
          paddingTop: "64px",
          overflow: "hidden",
        }}
      >
        <SidebarAdmin
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
            marginLeft: -0.5,
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
            <div className="my-container ">
              <form
                onSubmit={handleSubmit}
                onReset={handleReset}
                className="my-form"
              >
                <div className="roww">
                  <div className="form-group col-4 mt-3 pe-4">
                    <label
                      htmlFor="employeeCode"
                      className="my-label"
                      style={{ color: theme.palette.text.primary }}
                    >
                      <FaUserTag className="m-1" />
                      Employee Code
                    </label>
                    <span className="mandatory">*</span>
                    <input
                      type="text"
                      id="employeeCode"
                      value={employeeCode}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*$/.test(value) && value.length <= 6) {
                          setEmployeeCode(value);
                        }
                      }}
                      required
                      maxLength="6"
                      placeholder="Enter Employee Code"
                    />
                  </div>

                  <div className="form-group col-4 mt-3 pe-4">
                    <label
                      htmlFor="employeeName"
                      className="my-label"
                      style={{ color: theme.palette.text.primary }}
                    >
                      <Person className="m-1" />
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
                      readOnly
                    />
                  </div>

                  <div className="form-group  col-4 mt-3">
                    <label
                      htmlFor="region"
                      className="my-label"
                      style={{ color: theme.palette.text.primary }}
                    >
                      <Globe className="m-1 " />
                      Region
                    </label>
                    <span className="mandatory">*</span>
                    <input
                      type="text"
                      id="region"
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      required
                      placeholder="Region"
                      readOnly
                    />
                  </div>

                  <div className="form-group col-4 mt-3 pe-4">
                    <label
                      htmlFor="branch"
                      className="my-label"
                      style={{ color: theme.palette.text.primary }}
                    >
                      <Building className="m-1" />
                      Branch
                    </label>
                    <span className="mandatory">*</span>
                    <input
                      type="text"
                      id="branch"
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      required
                      placeholder="Branch"
                      readOnly
                    />
                  </div>

                  <div className="form-group col-4 mt-3 pe-4">
                    <label
                      htmlFor="email"
                      className="my-label"
                      style={{ color: theme.palette.text.primary }}
                    >
                      <Envelope className="m-1" /> Email
                    </label>
                    <span className="mandatory">*</span>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="Enter Email"
                      readOnly={!editMode}
                    />
                    <FaEdit
                      className=""
                      style={{
                        cursor: "pointer",
                        position: "absolute",
                        // marginTop: "-80px",
                        marginTop: "12px",
                        marginLeft: "-30px",
                        color: "black",
                      }}
                      onClick={handleEditClick}
                      title={editMode ? "Disable editing" : "Enable editing"}
                    />
                  </div>

                  <div className="form-group col-4 mt-3">
                    <label
                      htmlFor="mobileNo"
                      className="my-label"
                      style={{ color: theme.palette.text.primary }}
                    >
                      <Telephone className="m-1" /> Mobile No.
                    </label>
                    <span className="mandatory">*</span>
                    <input
                      type="tel"
                      id="mobileNo"
                      value={mobileNo}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d{0,10}$/.test(value)) {
                          setMobileNo(value);
                        }
                      }}
                      required
                      placeholder="Enter Mobile No."
                      maxLength="10"
                      pattern="\d{10}"
                      readOnly={!editMode}
                    />
                    <FaEdit
                      className=""
                      style={{
                        cursor: "pointer",
                        position: "absolute",
                        // marginTop: "-80px",
                        marginTop: "12px",
                        marginLeft: "-30px",
                        color: "black",
                      }}
                      onClick={handleEditClick}
                      title={editMode ? "Enable editing" : "Disable editing"}
                    />
                  </div>

                  <div className="form-group col-4 mt-3 pe-4">
                    <label
                      htmlFor="loginType"
                      className="my-label"
                      style={{ color: theme.palette.text.primary }}
                    >
                      <PersonBadge className="m-1" />
                      Login Type
                    </label>
                    <span className="mandatory">*</span>
                    <select
                      id="loginType"
                      value={loginType}
                      onChange={(e) => setLoginType(e.target.value)}
                      required
                    >
                      <option value="">Select Login Type</option>
                      {loadingLoginTypes ? (
                        <option disabled>Loading login types...</option>
                      ) : loginTypesError ? (
                        <option disabled>{loginTypesError}</option>
                      ) : (
                        loginTypes.map((loginType) => (
                          <option
                            key={loginType.roleId}
                            value={loginType.roleName}
                          >
                            {loginType.roleName}
                          </option>
                        ))
                      )}
                    </select>
                  </div>

                  <div className="form-group  col-4 mt-3 pe-4">
                    <label
                      htmlFor="password"
                      className="my-label"
                      style={{ color: theme.palette.text.primary }}
                    >
                      <Key className="m-1" /> Password
                    </label>
                    <span className="mandatory">*</span>
                    <OverlayTrigger
                      placement="top"
                      overlay={passwordRequirementsTooltip}
                    >
                      <span className="password-info-icon">
                        <i
                          className="bi bi-info-circle"
                          style={{ color: "black" }}
                        ></i>
                      </span>
                    </OverlayTrigger>
                    <div className="password-field ">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Enter Password"
                      />
                      <span
                        className="password-toggle-icon "
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ?<Eye />  : <EyeSlash />}
                      </span>
                    </div>
                    <PasswordStrengthMeter password={password} />
                  </div>

                  <div className="form-group col-4 mt-3 ">
                    <label
                      htmlFor="confirmPassword"
                      className="my-label"
                      style={{ color: theme.palette.text.primary }}
                    >
                      <FaLock className="m-1" />
                      Confirm Password
                    </label>
                    <span className="mandatory">*</span>
                    <input
                      type="password"
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      placeholder="Enter Password"
                    />
                  </div>
                </div>
                {/* <div className="form-group"> */}
                {/* <div className="new-user-form__button">
                  <button type="submit" className="mybutton" >
                    Submit
                  </button>
                  <button
                    type="reset"
                    className="mybutton"
                    onClick={handleReset}
                  >
                    Reset
                  </button>
                </div> */}
                <div
  className="new-user-form__button"
  style={{
    display: "flex",
    justifyContent: "center", // Centers horizontally
    alignItems: "center", // Centers vertically
    gap: "16px", // Adds spacing between buttons
    marginTop: "40px",
  }}
>
  <button
    type="submit"
    style={{
      backgroundColor: "#4CAF50",
      color: "white",
      padding: "10px 20px",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      fontWeight: "600",
    }}
  >
    Submit
  </button>
  <button
    type="reset"
    style={{
      backgroundColor: "#f44336",
      color: "white",
      padding: "10px 20px",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      fontWeight: "600",
    }}
    onClick={handleReset}
  >
    Reset
  </button>
</div>
              </form>
              <SuccessModal
                open={showSuccessModal}
                handleClose={() => setShowSuccessModal(false)}
              />
              <NoEmployeeModal
                open={noEmployeeModalOpen}
                handleClose={() => setNoEmployeeModalOpen(false)}
              />
              <ErrorDialog
                open={showErrorModal}
                handleClose={handleCloseErrorModal}
                errorMessages={errorMessages}
              />
            </div>
          </Paper>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
export default NewUserForm;
