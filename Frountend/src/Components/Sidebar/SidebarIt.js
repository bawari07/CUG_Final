// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import {
//   Drawer,
//   List,
//   ListItem,
//   ListItemIcon,
//   ListItemText,
//   Collapse,
//   IconButton,
//   Badge,
//   Modal,
//   Button,
//   useTheme,
//   Box,
// } from "@mui/material";
// import { ExpandLess, ExpandMore, Menu } from "@mui/icons-material";
// import "bootstrap-icons/font/bootstrap-icons.css";
// import { getCount } from "../../Services/Api";
// import MenuIcon from "@mui/icons-material/Menu";
// import NetworkCheckIcon from "@mui/icons-material/NetworkCheck";
// import { TrackChanges as TrackChangesIcon } from "@mui/icons-material";
// // import logoImage from "../Assests/logo.webp";

// const SidebarIt = ({ handleLogout }) => {
//   const navigate = useNavigate();
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [showModal, setShowModal] = useState(false);
//   const [region, setRegion] = useState("");
//   const [showActivationOptions, setShowActivationOptions] = useState(false);
//   const [activationCount, setActivationCount] = useState(0);
//   const [deactivationCount, setDeactivationCount] = useState(0);
//   const [suspensionCount, setSuspensionCount] = useState(0);
//   const [swapRequestCount, setSwapRequestCount] = useState(0);

//   useEffect(() => {
//     const userRegion = localStorage.getItem("region");
//     if (userRegion) {
//       setRegion(userRegion);
//     } else {
//       console.error("Region not found in local storage");
//     }
//   }, []);

//   useEffect(() => {
//     const fetchCounts = async () => {
//       try {
//         const activationResponse = await getCount("activation");
//         const deactivationResponse = await getCount("deactivation");
//         const suspensionResponse = await getCount("suspension");
//         const swapRequestResponse = await getCount("swap-request");

//         setActivationCount(activationResponse[0]?.requestCount || 0);
//         setDeactivationCount(deactivationResponse[0]?.requestCount || 0);
//         setSuspensionCount(suspensionResponse[0]?.requestCount || 0);
//         setSwapRequestCount(swapRequestResponse[0]?.requestCount || 0);
//       } catch (error) {
//         console.error("Error fetching counts:", error);
//       }
//     };

//     fetchCounts();
//   }, []);

//   const handleLogoutClick = () => {
//     setShowModal(true);
//   };

//   const theme = useTheme();

//   const confirmLogout = () => {
//     setShowModal(false);
//     localStorage.clear();
//     sessionStorage.clear();
//     navigate("/");
//     if (handleLogout) {
//       handleLogout();
//     }
//   };

//   const cancelLogout = () => {
//     setShowModal(false);
//   };

//   const handleActivationOptionsClick = () => {
//     setShowActivationOptions(!showActivationOptions);
//   };

//   const handleLinkClick = () => {
//     navigate("/HOReqInitiation");
//   };

//   const handleonLinkClick = () => {
//     navigate("/HOSubmitRequest");
//   };

//   const handlesimtracker = () => {
//     navigate("/simtracker");
//   };

//   const toggleSidebar = () => {
//     setIsSidebarOpen(!isSidebarOpen);
//     console.log("Sidebar is now", isSidebarOpen ? "closed" : "open");
//   };
//   const logoStyle = {
//     width: isSidebarOpen ? "150px" : "80px",
//     height: "auto", // Maintains aspect ratio
//     // transition: "width 0.3s",
//     marginLeft: isSidebarOpen ? "auto" : "initial",
//     marginRight: "auto",
//   };

//   return (
//     <>
//       <Drawer
//         variant="permanent"
//         open={isSidebarOpen}
//         sx={{
//           width: isSidebarOpen ? 240 : 72,
//           flexShrink: 0,
//           "& .MuiDrawer-paper": {
//             width: isSidebarOpen ? 240 : 72,
//             boxSizing: "border-box",
//             transition: "width 0.3s",
//             // backgroundColor: "#003366",
//             backgroundColor:
//               theme.palette.mode === "dark" ? "#2a2a2a" : "#003366",

//             color: "white",
//             overflow: "hidden",
//           },
//         }}
//       >
//         <List>
//           <ListItemIcon>
//             <IconButton
//               onClick={toggleSidebar}
//               className="in_out"
//               sx={{
//                 margin: "8px",
//                 ml: "auto",
//                 color: "white",
//               }}
//             >
//               <MenuIcon />
//             </IconButton>
//           </ListItemIcon>

//           <ListItem button component={Link} to="/ItDashboard">
//             <ListItemIcon sx={{ color: "white" }}>
//               <i className="fs-4 bi-speedometer2"></i>
//             </ListItemIcon>
//             {isSidebarOpen && <ListItemText primary="Dashboard" />}
//           </ListItem>
//           <ListItem button onClick={handleActivationOptionsClick}>
//             <ListItemIcon sx={{ color: "white" }}>
//               <Badge badgeContent={activationCount} color="error">
//                 <i className="fs-4 bi-journal-plus"></i>
//               </Badge>
//             </ListItemIcon>
//             {isSidebarOpen && <ListItemText primary="Activation" />}
//             {isSidebarOpen &&
//               (showActivationOptions ? <ExpandLess /> : <ExpandMore />)}
//           </ListItem>
//           <Collapse in={showActivationOptions} timeout="auto" unmountOnExit>
//             <List component="div" disablePadding>
//               <ListItem button onClick={handleLinkClick} sx={{ pl: 4 }}>
//                 <ListItemIcon sx={{ color: "white" }}>
//                   <i className="fs-4 bi-arrow-right"></i>
//                 </ListItemIcon>
//                 <ListItemText primary="Request Initiation" />
//               </ListItem>
//               <ListItem button onClick={handleonLinkClick} sx={{ pl: 4 }}>
//                 <ListItemIcon sx={{ color: "white" }}>
//                   <i className="fs-4 bi-arrow-right"></i>
//                 </ListItemIcon>
//                 <ListItemText primary="Request Submit" />
//               </ListItem>
//             </List>
//           </Collapse>

//           <ListItem button component={Link} to="/HODeactivationReq">
//             <ListItemIcon sx={{ color: "white" }}>
//               <Badge badgeContent={deactivationCount} color="error">
//                 <i className="fs-4 bi-journal-minus"></i>
//               </Badge>
//             </ListItemIcon>
//             {isSidebarOpen && <ListItemText primary="Deactivation" />}
//           </ListItem>

//           <ListItem button component={Link} to="/SwapRequestSubmit">
//             <ListItemIcon sx={{ color: "white" }}>
//               <Badge badgeContent={swapRequestCount} color="error">
//                 <i className="fs-4 bi-arrow-repeat"></i>
//               </Badge>
//             </ListItemIcon>
//             {isSidebarOpen && <ListItemText primary="Swap Request" />}
//           </ListItem>

//           {/* new code change */}
//           {/* {region === "Head Office" && (
//             <ListItem button component={Link} to="/bulkUpload">
//               <ListItemIcon sx={{ color: "white" }}>
//                 <i className="fs-4 bi-cloud-upload"></i>
//               </ListItemIcon>
//               {isSidebarOpen && <ListItemText primary="Sim Bulk upload" />}
//             </ListItem>
//           )} */}

//           <ListItem button component={Link} to="/bulkUpload">
//             <ListItemIcon sx={{ color: "white" }}>
//               <i className="fs-4 bi-cloud-upload"></i>
//             </ListItemIcon>
//             {isSidebarOpen && <ListItemText primary="Sim Bulk upload" />}
//           </ListItem>

//           <ListItem button onClick={handlesimtracker}>
//             <ListItemIcon sx={{ color: "white" }}>
//               <TrackChangesIcon />
//             </ListItemIcon>
//             <ListItemText primary="Sim Record" />
//           </ListItem>

//           {/* <ListItem button onClick={() => navigate("/changePassword")}>
//             <ListItemIcon sx={{ color: "white" }}>
//               <i className="fs-4 bi-lock"></i>
//             </ListItemIcon>
//             <ListItemText primary="Change Password" />
//           </ListItem> */}

//           <ListItem button onClick={handleLogoutClick}>
//             <ListItemIcon sx={{ color: "white" }}>
//               <i className="fs-4 bi-box-arrow-right"></i>
//             </ListItemIcon>
//             {isSidebarOpen && <ListItemText primary="Logout" />}
//           </ListItem>
//         </List>
//       </Drawer>

//       <Modal
//         open={showModal}
//         onClose={cancelLogout}
//         aria-labelledby="modal-title"
//         aria-describedby="modal-description"
//       >
//         <Box
//           sx={{
//             position: "absolute",
//             top: "50%",
//             left: "50%",
//             transform: "translate(-50%, -50%)",
//             width: 500,
//             bgcolor: "background.paper",
//             border: "3px solid #000",
//             boxShadow: 24,
//             p: 4,
//           }}
//         >
//           <h2 id="modal-title">Confirm Logout</h2>
//           <p id="modal-description">Are you sure you want to log out?</p>
//           <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
//             <Button onClick={cancelLogout}>Cancel</Button>
//             <Button variant="contained" color="primary" onClick={confirmLogout}>
//               Logout
//             </Button>
//           </Box>
//         </Box>
//       </Modal>
//     </>
//   );
// };

// export default SidebarIt;











// NEW CODE FOR FAQ SECTIONS AND VOICE FEATURE ADDED

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  IconButton,
  Badge,
  Modal,
  Button,
  useTheme,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Select,
  MenuItem,
} from "@mui/material";
import { ExpandLess, ExpandMore, Menu } from "@mui/icons-material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "bootstrap-icons/font/bootstrap-icons.css";
import { getCount } from "../../Services/Api";
import MenuIcon from "@mui/icons-material/Menu";
import NetworkCheckIcon from "@mui/icons-material/NetworkCheck";
import { TrackChanges as TrackChangesIcon } from "@mui/icons-material";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import StopIcon from "@mui/icons-material/Stop";

const supportedLanguages = ["en", "hi"]; // Add supported languages here

const SidebarIt = ({ handleLogout }) => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showFAQModal, setShowFAQModal] = useState(false);
  const [region, setRegion] = useState("");
  const [showActivationOptions, setShowActivationOptions] = useState(false);
  const [activationCount, setActivationCount] = useState(0);
  const [deactivationCount, setDeactivationCount] = useState(0);
  const [suspensionCount, setSuspensionCount] = useState(0);
  const [swapRequestCount, setSwapRequestCount] = useState(0);
  const [language, setLanguage] = useState("en");
  const [expanded, setExpanded] = useState(false);

  const faqs = {
    en: [
      {
        question: "Where can we view all the data for our region?",
        answer: "You can view all regional data on the dashboard. The dashboard provides total data categorized vendor-wise and also displays data in graphical format for up to three months.",
      },
      {
        question: "What do 'Pending' and 'Ongoing' mean on the dashboard?",
        answer: "A request remains in the 'Pending' status until it is approved by the Regional IT personnel after being approved by the HO HR. Once the Regional IT personnel approve the request and send the SIM details to the vendor, the process moves to the 'Ongoing' status.",
      },
      {
        question: "How many types of requests are available on the CUG portal?",
        answer: "There are four types of requests on the CUG portal: New SIM Activation, Suspension, Swapping, and Deactivation.",
      },
      {
        question: "What is New Activation, and where do its requests appear?",
        answer: "New Activation refers to the process of activating a new SIM. These requests appear under the 'Activation' section in the sidebar, which consists of two subsections: Request Initiation and Request Submission.",
      },
      {
        question: "How can we upload the stock of new blank SIMs on the portal?",
        answer: "The stock of new blank SIMs can be uploaded through the 'SIM Bulk Upload' section. There are two methods to upload SIMs: Single Upload (uploading one SIM at a time) and Bulk Upload (uploading multiple SIMs in one go).",
      },
      {
        question: "How can we upload SIM stock in bulk?",
        answer: "Go to the 'Bulk Upload' page and click on the Template option to download the format. Fill in the data as per the template format. Click on Upload Excel, select the file, and upload it.",
      },
      {
        question: "Can ICCID or IMSI numbers be uploaded as duplicates?",
        answer: "No, each SIM must have a unique ICCID and IMSI number, and duplicates are not allowed.",
      },
      {
        question: "Where can we track the requests raised by the Regional HR?",
        answer: "These requests can be tracked in the 'SIM Record' section under the 'Reports' category. By selecting the Approval Request option, you can view the relevant data.",
      },
      {
        question: "How can we check which region we are mapped to and which region's data is being displayed?",
        answer: "You can check this information by clicking on the dashboard. Your Name, Employee Code, and Mapped Region will be displayed on the navbar.",
      },
      {
        question: "What is the process for activating a new SIM for a new employee?",
        answer: "The Regional HR raises a request through the CUG portal. The HO HR reviews and approves the request. Once approved, the request appears under the 'Request Initiation' section within 'Activation' in the sidebar for the respective Regional IT personnel. At this stage, the request status will be marked as 'Pending' until further processing.",
      },
    ],
    hi: [
      {
        question: "हम अपने क्षेत्र के सभी डेटा कहाँ देख सकते हैं?",
        answer: "आप डैशबोर्ड पर अपने क्षेत्र के सभी डेटा देख सकते हैं। डैशबोर्ड वेंडर-वाइज़ कैटेगरीज़ किए गए कुल डेटा प्रदान करता है और तीन महीने तक के डेटा को ग्राफ़िकल फ़ॉर्मेट में भी प्रदर्शित करता है।",
      },
      {
        question: "डैशबोर्ड पर 'पेंडिंग' और 'ऑनगोइंग' का क्या मतलब है?",
        answer: "एक अनुरोध 'पेंडिंग' स्टेटस में रहता है जब तक कि यह HO HR द्वारा स्वीकृत हो जाए और फिर क्षेत्रीय IT कर्मचारियों द्वारा स्वीकृत हो जाए। एक बार क्षेत्रीय IT कर्मचारी अनुरोध को स्वीकृत कर लें और वेंडर को SIM के विवरण भेज दें, तो प्रक्रिया 'ऑनगोइंग' स्टेटस में चली जाती है।",
      },
      {
        question: "CUG पोर्टल पर कितने प्रकार के अनुरोध उपलब्ध हैं?",
        answer: "CUG पोर्टल पर चार प्रकार के अनुरोध उपलब्ध हैं: नई SIM एक्टिवेशन, सस्पेंशन, स्वैपिंग, और डीएक्टिवेशन।",
      },
      {
        question: "नई एक्टिवेशन क्या है, और इसके अनुरोध कहाँ दिखाई देते हैं?",
        answer: "नई एक्टिवेशन एक नई SIM को एक्टिव करने की प्रक्रिया को संदर्भित करता है। ये अनुरोध साइडबार में 'एक्टिवेशन' सेक्शन के अंतर्गत दिखाई देते हैं, जो दो उप-सेक्शनों से मिलकर बना है: रिक्वेस्ट इनिशिएशन और रिक्वेस्ट सबमिशन।",
      },
      {
        question: "हम नई खाली ब्लैंक SIM के स्टॉक को पोर्टल पर कैसे अपलोड कर सकते हैं?",
        answer: "नई खाली ब्लैंक SIM के स्टॉक को 'SIM बल्क अपलोड' सेक्शन के माध्यम से अपलोड किया जा सकता है। दो तरीके हैं SIM को अपलोड करने के लिए: सिंगल अपलोड (एक SIM को एक समय में अपलोड करना) और बल्क अपलोड (एक ही बार में कई SIM को अपलोड करना)।",
      },
      {
        question: "हम बल्क में SIM स्टॉक कैसे अपलोड कर सकते हैं?",
        answer: "'बल्क अपलोड' पेज पर जाएँ और टेम्पलेट ऑप्शन पर क्लिक करके फ़ॉर्मेट डाउनलोड करें। टेम्पलेट फ़ॉर्मेट के अनुसार डेटा भरें। 'अपलोड एक्सेल' पर क्लिक करें, फ़ाइल को चुनें, और इसे अपलोड करें।",
      },
      {
        question: "क्या ICCID या IMSI नंबर डुप्लिकेट के रूप में अपलोड किए जा सकते हैं?",
        answer: "नहीं, हर SIM के लिए एक यूनिक ICCID और IMSI नंबर होना चाहिए, और डुप्लिकेट अनुमति नहीं है।",
      },
      {
        question: "हम क्षेत्रीय HR द्वारा उठाए गए अनुरोधों को कहाँ ट्रैक कर सकते हैं?",
        answer: "ये अनुरोध 'SIM रिकॉर्ड' सेक्शन के अंतर्गत 'रिपोर्ट्स' कैटेगरी में ट्रैक किए जा सकते हैं। अप्रूवल रिक्वेस्ट ऑप्शन को चुनकर, आप संबंधित डेटा देख सकते हैं।",
      },
      {
        question: "हम यह जानने के लिए कहाँ देख सकते हैं कि हम किस क्षेत्र में मैप किए गए हैं और किस क्षेत्र का डेटा दिखाई दे रहा है?",
        answer: "डैशबोर्ड पर क्लिक करके आप इस जानकारी प्राप्त कर सकते हैं। आपका नाम, एम्प्लॉयी कोड, और मैप किया गया क्षेत्र नेवबार पर दिखाई देगा।",
      },
      {
        question: "एक नए एम्प्लॉयी के लिए नई SIM एक्टिव करने की प्रक्रिया क्या है?",
        answer: "क्षेत्रीय HR CUG पोर्टल के माध्यम से एक अनुरोध उठाता है। HO HR अनुरोध को समीक्षा करता है और स्वीकृत करता है। एक बार स्वीकृत हो जाने के बाद, अनुरोध साइडबार में 'एक्टिवेशन' सेक्शन के अंतर्गत संबंधित क्षेत्रीय IT कर्मचारी के लिए दिखाई देता है। इस स्टेज पर, अनुरोध की स्थिति 'पेंडिंग' के रूप में चिह्नित की जाएगी जब तक कि इसे और आगे प्रोसेस किया जाए।",
      },
    ],
  };

  useEffect(() => {
    const userRegion = localStorage.getItem("region");
    if (userRegion) {
      setRegion(userRegion);
    } else {
      console.error("Region not found in local storage");
    }
  }, []);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const activationResponse = await getCount("activation");
        const deactivationResponse = await getCount("deactivation");
        const suspensionResponse = await getCount("suspension");
        const swapRequestResponse = await getCount("swap-request");

        setActivationCount(activationResponse[0]?.requestCount || 0);
        setDeactivationCount(deactivationResponse[0]?.requestCount || 0);
        setSuspensionCount(suspensionResponse[0]?.requestCount || 0);
        setSwapRequestCount(swapRequestResponse[0]?.requestCount || 0);
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    };

    fetchCounts();
  }, []);

  const handleLogoutClick = () => {
    setShowModal(true);
  };

  const theme = useTheme();

  const confirmLogout = () => {
    setShowModal(false);
    localStorage.clear();
    sessionStorage.clear();
    navigate("/");
    if (handleLogout) {
      handleLogout();
    }
  };

  const cancelLogout = () => {
    setShowModal(false);
  };

  const handleActivationOptionsClick = () => {
    setShowActivationOptions(!showActivationOptions);
  };

  const handleLinkClick = () => {
    navigate("/HOReqInitiation");
  };

  const handleonLinkClick = () => {
    navigate("/HOSubmitRequest");
  };

  const handlesimtracker = () => {
    navigate("/simtracker");
  };

  const handleFAQClick = () => {
    setShowFAQModal(true);
  };

  const closeFAQModal = () => {
    setShowFAQModal(false);
    speechSynthesis.cancel();
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    console.log("Sidebar is now", isSidebarOpen ? "closed" : "open");
  };

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const handleSpeak = (text) => {
    if (!supportedLanguages.includes(language)) {
      alert("Text-to-speech is not supported for the selected language.");
      return;
    }
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    speechSynthesis.speak(utterance);
  };

  const stopSpeech = () => {
    speechSynthesis.cancel();
  };

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
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

          <ListItem button component={Link} to="/ItDashboard">
            <ListItemIcon sx={{ color: "white" }}>
              <i className="fs-4 bi-speedometer2"></i>
            </ListItemIcon>
            {isSidebarOpen && <ListItemText primary="Dashboard" />}
          </ListItem>
          <ListItem button onClick={handleActivationOptionsClick}>
            <ListItemIcon sx={{ color: "white" }}>
              <Badge badgeContent={activationCount} color="error">
                <i className="fs-4 bi-journal-plus"></i>
              </Badge>
            </ListItemIcon>
            {isSidebarOpen && <ListItemText primary="Activation" />}
            {isSidebarOpen &&
              (showActivationOptions ? <ExpandLess /> : <ExpandMoreIcon />)}
          </ListItem>
          <Collapse in={showActivationOptions} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem button onClick={handleLinkClick} sx={{ pl: 4 }}>
                <ListItemIcon sx={{ color: "white" }}>
                  <i className="fs-4 bi-arrow-right"></i>
                </ListItemIcon>
                <ListItemText primary="Request Initiation" />
              </ListItem>
              <ListItem button onClick={handleonLinkClick} sx={{ pl: 4 }}>
                <ListItemIcon sx={{ color: "white" }}>
                  <i className="fs-4 bi-arrow-right"></i>
                </ListItemIcon>
                <ListItemText primary="Request Submission" />
              </ListItem>
            </List>
          </Collapse>

          <ListItem button component={Link} to="/HODeactivationReq">
            <ListItemIcon sx={{ color: "white" }}>
              <Badge badgeContent={deactivationCount} color="error">
                <i className="fs-4 bi-journal-minus"></i>
              </Badge>
            </ListItemIcon>
            {isSidebarOpen && <ListItemText primary="Deactivation" />}
          </ListItem>

          <ListItem button component={Link} to="/SwapRequestSubmit">
            <ListItemIcon sx={{ color: "white" }}>
              <Badge badgeContent={swapRequestCount} color="error">
                <i className="fs-4 bi-arrow-repeat"></i>
              </Badge>
            </ListItemIcon>
            {isSidebarOpen && <ListItemText primary="Swap Request" />}
          </ListItem>

          <ListItem button component={Link} to="/bulkUpload">
            <ListItemIcon sx={{ color: "white" }}>
              <i className="fs-4 bi-cloud-upload"></i>
            </ListItemIcon>
            {isSidebarOpen && <ListItemText primary="Sim Bulk Upload" />}
          </ListItem>

          <ListItem button onClick={handlesimtracker}>
            <ListItemIcon sx={{ color: "white" }}>
              <TrackChangesIcon />
            </ListItemIcon>
            <ListItemText primary="Sim Record" />
          </ListItem>

          <ListItem button onClick={handleFAQClick}>
            <ListItemIcon sx={{ color: "white" }}>
              <i className="fs-4 bi-question-circle"></i>
            </ListItemIcon>
            {isSidebarOpen && <ListItemText primary="FAQ" />}
          </ListItem>

          <ListItem button onClick={handleLogoutClick}>
            <ListItemIcon sx={{ color: "white" }}>
              <i className="fs-4 bi-box-arrow-right"></i>
            </ListItemIcon>
            {isSidebarOpen && <ListItemText primary="Logout" />}
          </ListItem>
        </List>
      </Drawer>

      <Modal
        open={showModal}
        onClose={cancelLogout}
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
            <Button onClick={cancelLogout}>Cancel</Button>
            <Button variant="contained" color="primary" onClick={confirmLogout}>
              Logout
            </Button>
          </Box>
        </Box>
      </Modal>

      <Modal
        open={showFAQModal}
        onClose={closeFAQModal}
        aria-labelledby="faq-modal-title"
        aria-describedby="faq-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            maxHeight: "80vh",
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            overflowY: "auto",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <h2 id="faq-modal-title">Frequently Asked Questions</h2>
            <IconButton onClick={closeFAQModal} aria-label="close">
              <i className="bi-x-lg"></i>
            </IconButton>
          </Box>
          <Select value={language} onChange={handleLanguageChange} sx={{ mb: 2 }}>
            <MenuItem value="en">English</MenuItem>
            <MenuItem value="hi">Hindi</MenuItem>
          </Select>
          {faqs[language].map((faq, index) => (
            <Accordion
              key={index}
              expanded={expanded === `panel${index}`}
              onChange={handleChange(`panel${index}`)}
              sx={{
                mb: 2,
                border: expanded === `panel${index}` ? '2px solid #007bff' : '1px solid #ddd',
                backgroundColor: expanded === `panel${index}` ? '#f0f8ff' : 'inherit',
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`faq-content-${index}`}
                id={`faq-header-${index}`}
              >
                <Typography>{faq.question}</Typography>
                <IconButton
                  onClick={() => handleSpeak(faq.question)}
                  aria-label="speak"
                  sx={{ ml: 1 }}
                >
                  <VolumeUpIcon />
                </IconButton>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>{faq.answer}</Typography>
                <IconButton
                  onClick={() => handleSpeak(faq.answer)}
                  aria-label="speak"
                >
                  <VolumeUpIcon />
                </IconButton>
                <IconButton onClick={stopSpeech} aria-label="stop">
                  <StopIcon />
                </IconButton>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Modal>
    </>
  );
};

export default SidebarIt;

