import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  IconButton,
  useTheme,
  Box,
  CssBaseline,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon,
} from "@mui/icons-material";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import SidebarHr from "../Sidebar/SidebarAdmin";
import { getDashbordcnt } from "../../Services/Api";
import Avatar from "react-avatar";

const COLORS = {
  total: ["#0088FE", "#00C49F", "#FFBB28"],
  activations: ["#FF8042", "#FF4242", "#DB4437"],
  suspended: ["#4285F4", "#34A853", "#FBBC05"],
  requests: ["#7C4DFF", "#536DFE", "#448AFF"],
  remaining: ["#009688", "#4CAF50", "#8BC34A"],
};

const PieChartComponent = ({ data, colors }) => {
  const chartData = Object.entries(data).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <ResponsiveContainer width="100%" height={120}>
      {/* <ResponsiveContainer width="100%" height={100} style={{marginBottom:"25px"}}> */}
      <PieChart>
        <Pie
          data={chartData}
          // new code
          dataKey="value" 
          cx="50%"
          cy="50%"
          innerRadius={30} 
          outerRadius={50}
          paddingAngle={5}
        >
          {chartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={colors[index % colors.length]}
              stroke="#ffffff"
              strokeWidth={2}
            />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};

const DataCard = ({ title, data, colors }) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        height: "90%",
        display: "flex",
        flexDirection: "column",
        background:
          theme.palette.mode === "dark"
            ? "linear-gradient(145deg, #2a2a2a, #3a3a3a)"
            : "linear-gradient(145deg, #e6f7ff, #f0f8ff)",
        borderRadius: "15px",
        boxShadow:
          theme.palette.mode === "dark"
            ? "10px 10px 20px #1a1a1a, -10px -10px 20px #2a2a2a"
            : "10px 10px 20px #d1e8f5, -10px -10px 20px #ffffff",
        transition: "transform 0.3s ease-in-out",
        "&:hover": {
          transform: "scale(1.05)",
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" gutterBottom noWrap>
          {title}
        </Typography>
        <PieChartComponent data={data} colors={colors} />
        {Object.entries(data).map(([key, value], index) => (
          <Typography
            key={key}
            variant="body2"
            noWrap
            sx={{
              display: "flex",
              alignItems: "center",
              marginBottom: "4px",
            }}
          >
            <Box
              component="span"
              sx={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                backgroundColor: colors[index % colors.length],
                marginRight: "8px",
                display: "inline-block",
              }}
            />
            {`${key}: ${value}`}
          </Typography>
        ))}
      </CardContent>
    </Card>
  );
};

const BarChartComponent = ({ data, bars, title }) => {
  const theme = useTheme();

  const barColors = {
    Activated: "#4CAF50",
    Deactivated: "#F44336",
    Suspended: "#FFEB3B",
    Swapped: "#2196F3",
    Pending: "#FF9800",
    Completed: "#00C49F",
    Ongoing: "#9C27B0",
  };

  return (
    <Card
      sx={{
        height: "100%",
        maxHeight: 320,
        display: "flex",
        flexDirection: "column",
        background:
          theme.palette.mode === "dark"
            ? "linear-gradient(145deg, #2a2a2a, #3a3a3a)"
            : "linear-gradient(145deg, #e6f7ff, #f0f8ff)",
        borderRadius: "15px",
        boxShadow:
          theme.palette.mode === "dark"
            ? "10px 10px 20px #1a1a1a, -10px -10px 20px #2a2a2a"
            : "10px 10px 20px #d1e8f5, -10px -10px 20px #ffffff",
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis dataKey="vendor" stroke={theme.palette.text.primary} />
            <YAxis stroke={theme.palette.text.primary} />
            <Tooltip
              contentStyle={{
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary,
              }}
            />
            <Legend />
            {bars.map((bar) => (
              <Bar
                key={bar}
                dataKey={bar}
                fill={barColors[bar] || theme.palette.primary.main}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    simData: null,
    vendorSimActivities: [],
    vendorRequests: [],
  });
  const [apiData, setApiData] = useState([]);

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? "dark" : "light",
          primary: {
            main: darkMode ? "#bb86fc" : "#6200ea",
          },
          background: {
            default: darkMode ? "#121212" : "#f0f8ff",
            paper: darkMode ? "#1e1e1e" : "#ffffff",
          },
          text: {
            primary: darkMode ? "#ffffff" : "#000000",
            secondary: darkMode ? "#b0b0b0" : "#606060",
          },
        },
      }),
    [darkMode]
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const region = localStorage.getItem("region");
        const response = await getDashbordcnt({ region });
        console.log(response);
        setApiData(response.data || []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setApiData([]);
      }
    };
    fetchData();
  }, []);

  const calculateTotal = (data) =>
    Object.values(data).reduce((sum, val) => sum + val, 0);

  const transformAPIData = (apiData) => {
    const simData = {
      total: {
        Airtel:
          apiData[2]?.find((item) => item.telecomPartner === "Airtel")
            ?.TotalCount ?? 0,
        Jio:
          apiData[2]?.find((item) => item.telecomPartner === "Jio")
            ?.TotalCount ?? 0,
        Vi:
          apiData[2]?.find((item) => item.telecomPartner === "VI")
            ?.TotalCount ?? 0,
      },
      activations: {
        Airtel:
          apiData[5]?.find((item) => item.telecomPartner === "Airtel")
            ?.TotalActiveSIMs ?? 0,
        Jio:
          apiData[5]?.find((item) => item.telecomPartner === "Jio")
            ?.TotalActiveSIMs ?? 0,
        Vi:
          apiData[5]?.find((item) => item.telecomPartner === "VI")
            ?.TotalActiveSIMs ?? 0,
      },
      suspended: {
        Airtel:
          apiData[5]?.find(
            (item) =>
              item.telecomPartner === "Airtel" 
          )?.TotalSuspendedSIMs ?? 0,
        Jio:
          apiData[5]?.find(
            (item) =>
              item.telecomPartner === "Jio" 
          )?.TotalSuspendedSIMs ?? 0,
        Vi:
          apiData[5]?.find(
            (item) =>
              item.telecomPartner === "VI" 
          )?.TotalSuspendedSIMs ?? 0,
      },
      remaining: {
        Airtel:
          apiData[0]?.find((item) => item.telecomPartner === "Airtel")
            ?.NullCugCount ?? 0,
        Jio:
          apiData[0]?.find((item) => item.telecomPartner === "Jio")
            ?.NullCugCount ?? 0,
        Vi:
          apiData[0]?.find((item) => item.telecomPartner === "VI")
            ?.NullCugCount ?? 0,
      },
      requests: {
        Pending: apiData[1]?.[0]?.PendingRequests ?? 0,
        Completed: apiData[1]?.[0]?.CompletedRequests ?? 0,
        Ongoing: apiData[1]?.[0]?.OngoingRequests ?? 0,
      },
    };

    const vendorSimActivities = {
      Airtel: {
        Activated:
          apiData[5]?.find((item) => item.telecomPartner === "Airtel")
            ?.TotalActiveSIMs ?? 0,
        Deactivated:
          apiData[5]?.find((item) => item.telecomPartner === "Airtel")
            ?.TotalDeactivatedSIMs ?? 0,
        Suspended:
          apiData[5]?.find((item) => item.telecomPartner === "Airtel")
            ?.TotalSuspendedSIMs ?? 0,
      },
      Jio: {
        Activated:
          apiData[5]?.find((item) => item.telecomPartner === "Jio")
            ?.TotalActiveSIMs ?? 0,
        Deactivated:
          apiData[5]?.find((item) => item.telecomPartner === "Jio")
            ?.TotalDeactivatedSIMs ?? 0,
        Suspended:
          apiData[5]?.find((item) => item.telecomPartner === "Jio")
            ?.TotalSuspendedSIMs ?? 0,
      },
      Vi: {
        Activated:
          apiData[5]?.find((item) => item.telecomPartner === "VI")
            ?.TotalActiveSIMs ?? 0,
        Deactivated:
          apiData[5]?.find((item) => item.telecomPartner === "VI")
            ?.TotalDeactivatedSIMs ?? 0,
        Suspended:
          apiData[5]?.find((item) => item.telecomPartner === "VI")
            ?.TotalSuspendedSIMs ?? 0,
      },
    };

    const currentDate = new Date();













  //   const currentMonth = currentDate.toLocaleString("default", {
  //     month: "long",
  //   });
  //   const previousMonth = new Date(
  //     currentDate.getFullYear(),
  //     currentDate.getMonth() - 1,
  //     1
  //   ).toLocaleString("default", { month: "long" });
  //   const twoMonthsAgo = new Date(
  //     currentDate.getFullYear(),
  //     currentDate.getMonth() - 2,
  //     1
  //   ).toLocaleString("default", { month: "long" });

  //   const vendorRequests = [
  //     {
  //       vendor: twoMonthsAgo,
  //       Pending:
  //         apiData[4]?.find(
  //           (item) =>
  //             item.MonthYear === `${twoMonthsAgo} ${currentDate.getFullYear()}`
  //         )?.TotalPendingRequests ?? 0,
  //       Completed:
  //         apiData[4]?.find(
  //           (item) =>
  //             item.MonthYear === `${twoMonthsAgo} ${currentDate.getFullYear()}`
  //         )?.TotalCompletedRequests ?? 0,
  //       Ongoing:
  //         apiData[4]?.find(
  //           (item) =>
  //             item.MonthYear === `${twoMonthsAgo} ${currentDate.getFullYear()}`
  //         )?.TotalOngoingRequests ?? 0,
  //     },
  //     {
  //       vendor: previousMonth,
  //       Pending:
  //         apiData[4]?.find(
  //           (item) =>
  //             item.MonthYear === `${previousMonth} ${currentDate.getFullYear()}`
  //         )?.TotalPendingRequests ?? 0,
  //       Completed:
  //         apiData[4]?.find(
  //           (item) =>
  //             item.MonthYear === `${previousMonth} ${currentDate.getFullYear()}`
  //         )?.TotalCompletedRequests ?? 0,
  //       Ongoing:
  //         apiData[4]?.find(
  //           (item) =>
  //             item.MonthYear === `${previousMonth} ${currentDate.getFullYear()}`
  //         )?.TotalOngoingRequests ?? 0,
  //     },
  //     {
  //       vendor: currentMonth,
  //       Pending:
  //         apiData[4]?.find(
  //           (item) =>
  //             item.MonthYear === `${currentMonth} ${currentDate.getFullYear()}`
  //         )?.TotalPendingRequests ?? 0,
  //       Completed:
  //         apiData[4]?.find(
  //           (item) =>
  //             item.MonthYear === `${currentMonth} ${currentDate.getFullYear()}`
  //         )?.TotalCompletedRequests ?? 0,
  //       Ongoing:
  //         apiData[4]?.find(
  //           (item) =>
  //             item.MonthYear === `${currentMonth} ${currentDate.getFullYear()}`
  //         )?.TotalOngoingRequests ?? 0,
  //     },
  //   ];
  //   return { simData, vendorSimActivities, vendorRequests };
  // };





  

  const normalize = (str) => str?.trim().toLowerCase() ?? "";
    
  const getMonthYearOffset = (offset) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1);
    return {
      month: date.toLocaleString("default", { month: "long" }),
      year: date.getFullYear(),
    };
  };
  
  const { month: currentMonth, year: currentYear } = getMonthYearOffset(0);
  const { month: previousMonth, year: previousYear } = getMonthYearOffset(-1);
  const { month: twoMonthsAgo, year: twoMonthsAgoYear } = getMonthYearOffset(-2);
  
  console.log("Two Months Ago:", `${twoMonthsAgo} ${twoMonthsAgoYear}`);
  
  const findDataByMonthYear = (month, year) =>
    apiData[4]?.find((item) => normalize(item.MonthYear) === normalize(`${month} ${year}`)) ?? {};
  
  const vendorRequests = [
    {
      vendor: twoMonthsAgo,
      Pending: findDataByMonthYear(twoMonthsAgo, twoMonthsAgoYear).TotalPendingRequests ?? 0,
      Completed: findDataByMonthYear(twoMonthsAgo, twoMonthsAgoYear).TotalCompletedRequests ?? 0,
      Ongoing: findDataByMonthYear(twoMonthsAgo, twoMonthsAgoYear).TotalOngoingRequests ?? 0,
    },
    {
      vendor: previousMonth,
      Pending: findDataByMonthYear(previousMonth, previousYear).TotalPendingRequests ?? 0,
      Completed: findDataByMonthYear(previousMonth, previousYear).TotalCompletedRequests ?? 0,
      Ongoing: findDataByMonthYear(previousMonth, previousYear).TotalOngoingRequests ?? 0,
    },
    {
      vendor: currentMonth,
      Pending: findDataByMonthYear(currentMonth, currentYear).TotalPendingRequests ?? 0,
      Completed: findDataByMonthYear(currentMonth, currentYear).TotalCompletedRequests ?? 0,
      Ongoing: findDataByMonthYear(currentMonth, currentYear).TotalOngoingRequests ?? 0,
    },
  ];
  return { simData, vendorSimActivities, vendorRequests };
};


















  const { simData, vendorSimActivities, vendorRequests } = React.useMemo(() => {
    return transformAPIData(apiData);
  }, [apiData]);

  const chartData = React.useMemo(() => {
    return Object.keys(vendorSimActivities || {}).map((vendor) => ({
      vendor,
      ...(vendorSimActivities[vendor] || {}),
    }));
  }, [vendorSimActivities]);





  
     // new code
     const [employeeCode, setEmployeeCode] = useState("");
     const [region, setRegion] = useState("");
     const [roleName, setRoleName] = useState("");
     const [name, setName] = useState("");
   
   
     useEffect(() => {
       // Retrieve employee code and region from localStorage
       const storedEmployeeCode = localStorage.getItem("employeeCode") || "Guest"; // Fallback to 'Guest'
       const storedRegion = localStorage.getItem("region") || "Unknown"; // Fallback to 'Unknown'
       const storedRoleName = localStorage.getItem("roleName") || "Unknown"; // Fallback to 'Unknown'
       const storedName = localStorage.getItem("name") || "Unknown"; // Fallback to 'Unknown'
       setEmployeeCode(storedEmployeeCode);
       setRegion(storedRegion);
       setRoleName(storedRoleName);
       setName(storedName);
     }, []);
  

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        <SidebarHr
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        <Box
          sx={{
            flexGrow: 1,
            transition: "margin-left 0.3s",
            marginLeft: isSidebarOpen ? "240px" : "0",
          }}
        >
          <AppBar
            position="static"
            sx={{
              backgroundColor:
                theme.palette.mode === "dark" ? "#1a1a1a" : "#003366",
            }}
          >
            <Toolbar>
            <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  mt: 1.5,
                  ml: -1,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Avatar
                    name={name} // Generates avatar based on name
                    size="24" // Size of the avatar
                    round={true} // Makes the avatar round
                    maxInitials={6} // Max initials to show (default 2)
                    color="rgb(51, 21, 246)"
                    style={{
                      marginRight: "13px",
                      fontWeight: "bold",
                      border: "7px double #fff",
                      borderRadius: "15%",
                    }} // Style customization
                  />
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: "bold", mt: -1.5 }}
                  >
                    {name} ({employeeCode})
                  </Typography>
                </Box>
                <Typography
                  variant="body3"
                  sx={{
                    color: "white",
                    fontSize: "0.7rem",
                    mt: -1.2,
                    // mr: 11.5,
                  }}
                >
                  {roleName} - {region}
                </Typography>
              </Box>



              <Box
                sx={{ flexGrow: 1, display: "flex", justifyContent: "center" ,
                  ml: -20,}}
              >
                <Typography variant="h6">Dashboard</Typography>
              </Box>
              <IconButton
                onClick={() => setDarkMode(!darkMode)}
                color="inherit"
              >
                {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </Toolbar>
          </AppBar>

          {/* <Container maxWidth="xl" sx={{ mt: 4 }}> */}
          <Container maxWidth="xl" sx={{ mt: 2 }}>
            <Grid container spacing={3} alignItems="stretch" sx={{ mb: 5 }}>
              {simData &&
                [
                  {
                    title: `Total SIM - ${calculateTotal(simData.total)}`,
                    data: simData.total,
                    colors: COLORS.total,
                  },
                  {
                    title: `Activated - ${calculateTotal(simData.activations)}`,
                    data: simData.activations,
                    colors: COLORS.activations,
                  },
                  {
                    title: `Suspended - ${calculateTotal(simData.suspended)}`,
                    data: simData.suspended,
                    colors: COLORS.suspended,
                  },
                  {
                    title: `Requests - ${calculateTotal(simData.requests)}`,
                    data: simData.requests,
                    colors: COLORS.requests,
                  },
                  {
                    title: `Stock Avail. - ${calculateTotal(
                      simData.remaining
                    )}`,
                    data: simData.remaining,
                    colors: COLORS.remaining,
                  },
                ].map((card, index) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={2.4}
                    key={index}
                    sx={{ display: "flex", flexDirection: "column" }}
                  >
                    <DataCard {...card} />
                  </Grid>
                ))}
            </Grid>

            {vendorSimActivities && vendorRequests && (
              <Grid container spacing={3} alignItems="stretch" sx={{ mt: -8 }}>
                <Grid item xs={12} md={6}>
                  <BarChartComponent
                    data={chartData}
                    bars={["Activated", "Deactivated", "Suspended"]}
                    title="Overall SIM Activities"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <BarChartComponent
                    data={vendorRequests}
                    bars={["Pending", "Completed", "Ongoing"]}
                    title="Monthly Requests "
                  />
                </Grid>
              </Grid>
            )}
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}



// adding the new dahsboard fucntionalities for regionwise search option and voice integration.


// import React, { useEffect, useState, useCallback } from "react";
// import {
//   AppBar,
//   Toolbar,
//   Typography,
//   Container,
//   Grid,
//   Card,
//   CardContent,
//   IconButton,
//   useTheme,
//   Box,
//   CssBaseline,
//   TextField,
//   MenuItem,
//   Tooltip,
// } from "@mui/material";
// import { ThemeProvider, createTheme } from "@mui/material/styles";
// import {
//   Brightness4 as Brightness4Icon,
//   Brightness7 as Brightness7Icon,
//   Search as SearchIcon,
// } from "@mui/icons-material";
// import {
//   PieChart,
//   Pie,
//   Cell,
//   ResponsiveContainer,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip as RechartsTooltip,
//   Legend,
//   CartesianGrid,
// } from "recharts";
// import SidebarHr from "../Sidebar/SidebarAdmin";
// import { getDashbordcnt } from "../../Services/Api";
// import Avatar from "react-avatar";

// const COLORS = {
//   total: ["#0088FE", "#00C49F", "#FFBB28"],
//   activations: ["#FF8042", "#FF4242", "#DB4437"],
//   suspended: ["#4285F4", "#34A853", "#FBBC05"],
//   requests: ["#7C4DFF", "#536DFE", "#448AFF"],
//   remaining: ["#009688", "#4CAF50", "#8BC34A"],
//   pending: "#FF9800",
//   completed: "#00C49F",
//   activated: "#4CAF50",
// };

// const PieChartComponent = ({ data, colors }) => {
//   const chartData = Object.entries(data).map(([name, value]) => ({
//     name,
//     value,
//   }));

//   return (
//     <ResponsiveContainer width="100%" height={120}>
//       <PieChart>
//         <Pie
//           data={chartData}
//           dataKey="value"
//           cx="50%"
//           cy="50%"
//           innerRadius={30}
//           outerRadius={50}
//           paddingAngle={5}
//         >
//           {chartData.map((entry, index) => (
//             <Cell
//               key={`cell-${index}`}
//               fill={colors[index % colors.length]}
//               stroke="#ffffff"
//               strokeWidth={2}
//             />
//           ))}
//         </Pie>
//         <RechartsTooltip />
//       </PieChart>
//     </ResponsiveContainer>
//   );
// };

// const DataCard = ({ title, data, colors }) => {
//   const theme = useTheme();

//   return (
//     <Card
//       sx={{
//         height: "100%",
//         display: "flex",
//         flexDirection: "column",
//         background:
//           theme.palette.mode === "dark"
//             ? "linear-gradient(145deg, #2a2a2a, #3a3a3a)"
//             : "linear-gradient(145deg, #e6f7ff, #f0f8ff)",
//         borderRadius: "15px",
//         boxShadow:
//           theme.palette.mode === "dark"
//             ? "10px 10px 20px #1a1a1a, -10px -10px 20px #2a2a2a"
//             : "10px 10px 20px #d1e8f5, -10px -10px 20px #ffffff",
//         transition: "transform 0.3s ease-in-out",
//         "&:hover": {
//           transform: "scale(1.05)",
//         },
//       }}
//     >
//       <CardContent sx={{ flexGrow: 1 }}>
//         <Typography variant="h6" gutterBottom noWrap>
//           {title.includes("Pending") ? (
//             <Tooltip title="Req Approved by HO HR and send to Regional IT">
//               <span>{title}</span>
//             </Tooltip>
//           ) : title.includes("Ongoing") ? (
//             <Tooltip title="Req send from Regional IT to Vendor">
//               <span>{title}</span>
//             </Tooltip>
//           ) : (
//             title
//           )}
//         </Typography>
//         <PieChartComponent data={data} colors={colors} />
//         {Object.entries(data).map(([key, value], index) => (
//           <Typography
//             key={key}
//             variant="body2"
//             noWrap
//             sx={{
//               display: "flex",
//               alignItems: "center",
//               marginBottom: "4px",
//             }}
//           >
//             <Box
//               component="span"
//               sx={{
//                 width: "12px",
//                 height: "12px",
//                 borderRadius: "50%",
//                 backgroundColor: colors[index % colors.length],
//                 marginRight: "8px",
//                 display: "inline-block",
//               }}
//             />
//             {`${key}: ${value}`}
//           </Typography>
//         ))}
//       </CardContent>
//     </Card>
//   );
// };

// const BarChartComponent = ({ data, bars, title, xAxisDataKey }) => {
//   const theme = useTheme();

//   const barColors = {
//     Pending: "#FF9800",
//     Completed: "#00C49F",
//     Ongoing: "#9C27B0",
//     Activated: "#4CAF50",
//     Deactivated: "#F44336",
//     Suspended: "#FFEB3B",
//   };

//   return (
//     <Card
//       sx={{
//         height: "100%",
//         maxHeight: 320,
//         display: "flex",
//         flexDirection: "column",
//         background:
//           theme.palette.mode === "dark"
//             ? "linear-gradient(145deg, #2a2a2a, #3a3a3a)"
//             : "linear-gradient(145deg, #e6f7ff, #f0f8ff)",
//         borderRadius: "15px",
//         boxShadow:
//           theme.palette.mode === "dark"
//             ? "10px 10px 20px #1a1a1a, -10px -10px 20px #2a2a2a"
//             : "10px 10px 20px #d1e8f5, -10px -10px 20px #ffffff",
//       }}
//     >
//       <CardContent sx={{ flexGrow: 1 }}>
//         <Typography variant="h6" gutterBottom>
//           {title}
//         </Typography>
//         <ResponsiveContainer width="100%" height={250}>
//           <BarChart
//             data={data}
//             margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
//           >
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey={xAxisDataKey} stroke={theme.palette.text.primary} />
//             <YAxis stroke={theme.palette.text.primary} />
//             <RechartsTooltip
//               contentStyle={{
//                 backgroundColor: theme.palette.background.paper,
//                 color: theme.palette.text.primary,
//               }}
//             />
//             <Legend />
//             {bars.map((bar) => (
//               <Bar
//                 key={bar}
//                 dataKey={bar}
//                 fill={barColors[bar] || theme.palette.primary.main}
//               />
//             ))}
//           </BarChart>
//         </ResponsiveContainer>
//       </CardContent>
//     </Card>
//   );
// };

// export default function Dashboard() {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [darkMode, setDarkMode] = useState(false);
//   const [dashboardData, setDashboardData] = useState({
//     simData: null,
//     vendorSimActivities: [],
//     vendorRequests: [],
//   });
//   const [apiData, setApiData] = useState([]);
//   const [searchRegion, setSearchRegion] = useState("");
//   const [regions, setRegions] = useState([]);
//   const [greetingSpoken, setGreetingSpoken] = useState(false);

//   const theme = React.useMemo(
//     () =>
//       createTheme({
//         palette: {
//           mode: darkMode ? "dark" : "light",
//           primary: {
//             main: darkMode ? "#bb86fc" : "#6200ea",
//           },
//           background: {
//             default: darkMode ? "#121212" : "#f0f8ff",
//             paper: darkMode ? "#1e1e1e" : "#ffffff",
//           },
//           text: {
//             primary: darkMode ? "#ffffff" : "#000000",
//             secondary: darkMode ? "#b0b0b0" : "#606060",
//           },
//         },
//       }),
//     [darkMode]
//   );

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const region = localStorage.getItem("region");
//         const response = await getDashbordcnt({ region });
//         console.log(response.data);
//         setApiData(response.data || []);
//         setRegions(response.data[7] || []);
//       } catch (error) {
//         console.error("Error fetching dashboard data:", error);
//         setApiData([]);
//       }
//     };
//     fetchData();
//   }, []);

//   const calculateTotal = (data) =>
//     Object.values(data).reduce((sum, val) => sum + val, 0);
// // 5 apl
//   // const transformAPIData = (apiData) => {
//   //   const simData = {
//   //     total: {
//   //       NewSims: apiData[8]?.[0]?.NewSimRequest ?? 0,
//   //       SwappedSims: apiData[8]?.[0]?.SwapSimRequest ?? 0,
//   //       SuspensionSims: apiData[8]?.[1]?.PendingRequestCount ?? 0,
//   //       DeactivatedSims: apiData[8]?.[2]?.PendingRequestCount ?? 0,
//   //     },
//   const transformAPIData = (apiData) => {
//     // const index = searchRegion === "Head Office" ||!searchRegion  ? 8 : 7;
//     let index =  7;
//     const x=localStorage.getItem("region");
//     if(x==="Head Office"){
//       console.log(searchRegion); // Debug log
//        index = searchRegion === "Head Office" ||!searchRegion  ? 8 : 7;
//     }
//     const simData = {
//       total: {
//         NewSims: apiData[index]?.[0]?.NewSimRequest ?? 0,
//         SwappedSims: apiData[index]?.[0]?.SwapSimRequest ?? 0,
//         SuspensionSims: apiData[index]?.[1]?.PendingRequestCount ?? 0,
//         DeactivatedSims: apiData[index]?.[2]?.PendingRequestCount ?? 0,
//       },
//       activations: {
//         Airtel: apiData[5]?.find((item) => item.telecomPartner === "Airtel")?.TotalActiveSIMs ?? 0,
//         Jio: apiData[5]?.find((item) => item.telecomPartner === "Jio")?.TotalActiveSIMs ?? 0,
//         Vi: apiData[5]?.find((item) => item.telecomPartner === "VI")?.TotalActiveSIMs ?? 0,
//       },
//       suspended: {
//         Airtel: apiData[5]?.find((item) => item.telecomPartner === "Airtel")?.TotalSuspendedSIMs ?? 0,
//         Jio: apiData[5]?.find((item) => item.telecomPartner === "Jio")?.TotalSuspendedSIMs ?? 0,
//         Vi: apiData[5]?.find((item) => item.telecomPartner === "VI")?.TotalSuspendedSIMs ?? 0,
//       },
//       remaining: {
//         Airtel: apiData[0]?.find((item) => item.telecomPartner === "Airtel")?.NullCugCount ?? 0,
//         Jio: apiData[0]?.find((item) => item.telecomPartner === "Jio")?.NullCugCount ?? 0,
//         Vi: apiData[0]?.find((item) => item.telecomPartner === "VI")?.NullCugCount ?? 0,
//       },
//       requests: {
//         Airtel: apiData[6]?.find((item) => item.telecomPartner === "Airtel")?.OngoingRequestCount ?? 0,
//         Jio: apiData[6]?.find((item) => item.telecomPartner === "Jio")?.OngoingRequestCount ?? 0,
//         Vi: apiData[6]?.find((item) => item.telecomPartner === "VI")?.OngoingRequestCount ?? 0,
//       },
//     };

//     const vendorSimActivities = {
//       Airtel: {
//         vendor: "Airtel",
//         Activated: apiData[5]?.find((item) => item.telecomPartner === "Airtel")?.TotalActiveSIMs ?? 0,
//         Deactivated: apiData[5]?.find((item) => item.telecomPartner === "Airtel")?.TotalDeactivatedSIMs ?? 0,
//         Suspended: apiData[5]?.find((item) => item.telecomPartner === "Airtel")?.TotalSuspendedSIMs ?? 0,
//       },
//       Jio: {
//         vendor: "Jio",
//         Activated: apiData[5]?.find((item) => item.telecomPartner === "Jio")?.TotalActiveSIMs ?? 0,
//         Deactivated: apiData[5]?.find((item) => item.telecomPartner === "Jio")?.TotalDeactivatedSIMs ?? 0,
//         Suspended: apiData[5]?.find((item) => item.telecomPartner === "Jio")?.TotalSuspendedSIMs ?? 0,
//       },
//       Vi: {
//         vendor: "Vi",
//         Activated: apiData[5]?.find((item) => item.telecomPartner === "VI")?.TotalActiveSIMs ?? 0,
//         Deactivated: apiData[5]?.find((item) => item.telecomPartner === "VI")?.TotalDeactivatedSIMs ?? 0,
//         Suspended: apiData[5]?.find((item) => item.telecomPartner === "VI")?.TotalSuspendedSIMs ?? 0,
//       },
//     };

//     const currentDate = new Date();

//     const normalize = (str) => str?.trim().toLowerCase() ?? "";

//     const getMonthYearOffset = (offset) => {
//       const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1);
//       return {
//         month: date.toLocaleString("default", { month: "long" }),
//         year: date.getFullYear(),
//       };
//     };

//     const { month: currentMonth, year: currentYear } = getMonthYearOffset(0);
//     const { month: previousMonth, year: previousYear } = getMonthYearOffset(-1);
//     const { month: twoMonthsAgo, year: twoMonthsAgoYear } = getMonthYearOffset(-2);

//     const findDataByMonthYear = (month, year) =>
//       apiData[4]?.find((item) => normalize(item.MonthYear) === normalize(`${month} ${year}`)) ?? {};

//     const vendorRequests = [
//       {
//         vendor: twoMonthsAgo,
//         Pending: findDataByMonthYear(twoMonthsAgo, twoMonthsAgoYear).TotalPendingRequests ?? 0,
//         Completed: findDataByMonthYear(twoMonthsAgo, twoMonthsAgoYear).TotalCompletedRequests ?? 0,
//         Ongoing: findDataByMonthYear(twoMonthsAgo, twoMonthsAgoYear).TotalOngoingRequests ?? 0,
//       },
//       {
//         vendor: previousMonth,
//         Pending: findDataByMonthYear(previousMonth, previousYear).TotalPendingRequests ?? 0,
//         Completed: findDataByMonthYear(previousMonth, previousYear).TotalCompletedRequests ?? 0,
//         Ongoing: findDataByMonthYear(previousMonth, previousYear).TotalOngoingRequests ?? 0,
//       },
//       {
//         vendor: currentMonth,
//         Pending: findDataByMonthYear(currentMonth, currentYear).TotalPendingRequests ?? 0,
//         Completed: findDataByMonthYear(currentMonth, currentYear).TotalCompletedRequests ?? 0,
//         Ongoing: findDataByMonthYear(currentMonth, currentYear).TotalOngoingRequests ?? 0,
//       },
//     ];

//     return { simData, vendorSimActivities, vendorRequests };
//   };

//   const { simData, vendorSimActivities, vendorRequests } = React.useMemo(() => {
//     return transformAPIData(apiData);
//   }, [apiData]);

//   const chartData = React.useMemo(() => {
//     return Object.keys(vendorSimActivities || {}).map((vendor) => ({
//       vendor,
//       ...(vendorSimActivities[vendor] || {}),
//     }));
//   }, [vendorSimActivities]);

//   const [employeeCode, setEmployeeCode] = useState("");
//   const [region, setRegion] = useState("");
//   const [roleName, setRoleName] = useState("");
//   const [name, setName] = useState("");

//   useEffect(() => {
//     const storedEmployeeCode = localStorage.getItem("employeeCode") || "Guest";
//     const storedRegion = localStorage.getItem("region") || "Unknown";
//     const storedRoleName = localStorage.getItem("roleName") || "Unknown";
//     const storedName = localStorage.getItem("name") || "Unknown";
//     setEmployeeCode(storedEmployeeCode);
//     setRegion(storedRegion);
//     setRoleName(storedRoleName);
//     setName(storedName);

//     // Check if the greeting has already been spoken for this session
//     const hasGreetingSpoken = localStorage.getItem("greetingSpoken");
//     if (!hasGreetingSpoken && window.speechSynthesis) {
//       const utterance = new SpeechSynthesisUtterance(`Hi ${storedName}, welcome to the CUG management portal.`);
//       window.speechSynthesis.speak(utterance);
//       localStorage.setItem("greetingSpoken", "true");
//       setGreetingSpoken(true);
//     }
//   }, []);

//   const handleSearch = useCallback(async () => {
//     console.log("Selected Region:", searchRegion); // Debug log
//     try {
//       const response = await getDashbordcnt({ region: searchRegion });
//       console.log("Fetched Data:", response.data); // Debug log
//       setApiData(response.data || []);
//     } catch (error) {
//       console.error("Error fetching dashboard data:", error);
//       setApiData([]);
//     }
//   }, [searchRegion]);

//   useEffect(() => {
//     if (searchRegion) {
//       handleSearch();
//     }
//   }, [searchRegion, handleSearch]);

//   const handleKeyDown = (event) => {
//     if (event.key === "Enter") {
//       handleSearch();
//     }
//   };

//   return (
//     <ThemeProvider theme={theme}>
//       <CssBaseline />
//       <Box sx={{ display: "flex", minHeight: "100vh" }}>
//         <SidebarHr
//           isSidebarOpen={isSidebarOpen}
//           setIsSidebarOpen={setIsSidebarOpen}
//         />

//         <Box
//           sx={{
//             flexGrow: 1,
//             transition: "margin-left 0.3s",
//             marginLeft: isSidebarOpen ? "240px" : "0",
//           }}
//         >
//           <AppBar
//             position="static"
//             sx={{
//               backgroundColor:
//                 theme.palette.mode === "dark" ? "#1a1a1a" : "#003366",
//             }}
//           >
//             <Toolbar>
//               <Box
//                 sx={{
//                   display: "flex",
//                   flexDirection: "column",
//                   alignItems: "flex-end",
//                   mt: 1.5,
//                   ml: -1,
//                 }}
//               >
//                 <Box sx={{ display: "flex", alignItems: "center" }}>
//                   <Avatar
//                     name={name}
//                     size="24"
//                     round={true}
//                     maxInitials={6}
//                     color="rgb(51, 21, 246)"
//                     style={{
//                       marginRight: "13px",
//                       fontWeight: "bold",
//                       border: "7px double #fff",
//                       borderRadius: "15%",
//                     }}
//                   />
//                   <Typography
//                     variant="body1"
//                     sx={{ fontWeight: "bold", mt: -1.5 }}
//                   >
//                     {name} ({employeeCode})
//                   </Typography>
//                 </Box>
//                 <Typography
//                   variant="body3"
//                   sx={{
//                     color: "white",
//                     fontSize: "0.7rem",
//                     mt: -1.2,
//                   }}
//                 >
//                   {roleName} - {region}
//                 </Typography>
//               </Box>

//               <Box
//                 sx={{ flexGrow: 1, display: "flex", justifyContent: "center", ml: -20 }}
//               >
//                 <Typography variant="h6">Dashboard</Typography>
//               </Box>

//               {region === "Head Office" && (
//                 <Box sx={{ display: "flex", alignItems: "center" }}>
//                   <TextField
//                     select
//                     variant="outlined"
//                     size="small"
//                     value={searchRegion}
//                     onChange={(e) => {
//                       const selectedRegion = e.target.value;
//                       console.log("Region selected:", selectedRegion); // Debug log
//                       setSearchRegion(selectedRegion);
//                     }}
//                     SelectProps={{
//                       displayEmpty: true,
//                       renderValue: (selected) => !selected ? "Search Region" : selected, // Custom render to show placeholder
//                     }}
//                     sx={{ marginRight: 2, backgroundColor: "white", width: 160 }}
//                   >
//                     {regions.map((region) => (
//                       <MenuItem key={region.regionMaster} value={region.regionMaster}>
//                         {region.regionMaster}
//                       </MenuItem>
//                     ))}
//                   </TextField>
//                 </Box>
//               )}

//               <IconButton
//                 onClick={() => setDarkMode(!darkMode)}
//                 color="inherit"
//               >
//                 {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
//               </IconButton>
//             </Toolbar>
//           </AppBar>

//           <Container maxWidth="xl" sx={{ mt: 2 }}>
//             <Grid container spacing={3} alignItems="stretch" sx={{ mb: 5 }}>
//               {simData &&
//                 [
//                   {
//                     title: `Pending - ${calculateTotal(simData.total)}`,
//                     data: simData.total,
//                     colors: COLORS.total,
//                   },
//                   {
//                     title: `Ongoing - ${calculateTotal(simData.requests)}`,
//                     data: simData.requests,
//                     colors: COLORS.requests,
//                   },
//                   {
//                     title: `Activated - ${calculateTotal(simData.activations)}`,
//                     data: simData.activations,
//                     colors: COLORS.activations,
//                   },
//                   {
//                     title: `Suspended - ${calculateTotal(simData.suspended)}`,
//                     data: simData.suspended,
//                     colors: COLORS.suspended,
//                   },
//                   {
//                     title: `Blank Sims- ${calculateTotal(
//                       simData.remaining
//                     )}`,
//                     data: simData.remaining,
//                     colors: COLORS.remaining,
//                   },
//                 ].map((card, index) => (
//                   <Grid
//                     item
//                     xs={12}
//                     sm={6}
//                     md={2.4}
//                     key={index}
//                     sx={{ display: "flex", flexDirection: "column" }}
//                   >
//                     <DataCard {...card} />
//                   </Grid>
//                 ))}
//             </Grid>

//             {vendorSimActivities && vendorRequests && (
//               <Grid container spacing={3} alignItems="stretch" sx={{ mt: -8 }}>
//                 <Grid item xs={12} md={6}>
//                   <BarChartComponent
//                     data={chartData}
//                     bars={["Activated", "Deactivated", "Suspended"]}
//                     title="Overall SIM Activities"
//                     xAxisDataKey="vendor"
//                   />
//                 </Grid>
//                 <Grid item xs={12} md={6}>
//                   <BarChartComponent
//                     data={vendorRequests}
//                     bars={["Pending", "Completed", "Ongoing"]}
//                     title="Monthly Requests"
//                     xAxisDataKey="vendor"
//                   />
//                 </Grid>
//               </Grid>
//             )}
//           </Container>
//         </Box>
//       </Box>
//     </ThemeProvider>
//   );
// }



