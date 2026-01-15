import axios from "axios";

const API_URL = "https://cuguat.midlandmicrofin.co.in/api";
// https://cuguat.midlandmicrofin.co.in/api
// http://localhost:4000/api

const getEmployeeDetails = async (employeeCode) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API_URL}/employees/${employeeCode}`,
      null,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getRegions = async () => {
  try {
    const response = await axios.get(`${API_URL}/regions`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getBranches = async (region) => {
  try {
    const response = await axios.get(
      `${API_URL}/${encodeURIComponent(region)}`
    );
    return response;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return { data: [] };
    } else {
    }
  }
};

const getLoginTypes = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/v1/login-types/types`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
  }
};

const createUser = async (userData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(`${API_URL}/v1`, userData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const HRstatus = async ({ region }) => {
  const token = localStorage.getItem("token");
  return axios.get(`${API_URL}/hr`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: { region },
  });
};

const getSwapRequests = async ({ region }) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`${API_URL}/v1/swapRequests`, {
      params: { region },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

const getHRRequests = async ({ simAllocationType, status, type }) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`${API_URL}/requests/pending`, {
      params: { simAllocationType, status, type },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

const getRegionalRequests = async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(
      `${API_URL}/requests/approval`, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

const approveRequest = async (employeeCode, requestType, action, approvalRemarks) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post(
      `${API_URL}/requests/approve-request`,
      {
        employeeCode,
        requestType,
        action,
        approvalRemarks, 
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};


const getCount = async (type) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/count`, {
      params: { type },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};






const DeactivationRequest = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/v1/deactivationrequests`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

const submitDetails = async (details) => {
  try {
    const formData = new FormData();
    formData.append("requestID", details.requestID);
    formData.append("cugNumber", details.cugNumber);
    formData.append("rechargePlan", details.rechargePlan);
    formData.append("remarksByIT", details.remarksByIT);


    const token = localStorage.getItem("token");

    const response = await axios.post(`${API_URL}/sim-requests`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    if (error.response) {
    } else if (error.request) {
    } else {
    }
    throw error;
  }
};

const getUsers = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/employee/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const deactivateUser = async (employeeCode) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(
      `${API_URL}/employee/users/deactivate/${employeeCode}`,
      null,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const requestInitiation = async (initData) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.post(`${API_URL}/reqinit`, initData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    if (error.response) {
    } else if (error.request) {
    } else {
    }
    throw error;
  }
};

const requestSwapInitiation = async (initData) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authorization token is missing.");
    }

    const response = await axios.post(`${API_URL}/swapreqinit`, initData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    if (error.response) {
    } else if (error.request) {
    } else {
    }
    throw error;
  }
};

const Hrsimrequest = async (reqdata) => {
  console.log(reqdata);
  const token = localStorage.getItem("token");
  return axios.post(`${API_URL}/simrequest`, reqdata, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const submitDeactivatedetails = async (details) => {
  try {
    const data = {
      requestID: details.requestID,
      remarksByIT: details.remarksByIT,
    };

    const token = localStorage.getItem("token");

    const response = await axios.post(`${API_URL}/submitdeacivate`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    if (error.response) {
    } else if (error.request) {
    } else {
    }
    throw error;
  }
};

const submitswapdetails = async (formData) => {
  try {

    const token = localStorage.getItem("token");

    const response = await axios.post(`${API_URL}/swapSubmit`, formData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response);

    return response.data;
  } catch (error) {
    throw error;
  }
};

const bulkUpload = async (data) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(`${API_URL}/v1/bulkupload`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const bulkRequest = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/v1/details`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const bulkupdate = async (data) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(`${API_URL}/v1/update`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getSimRecord = async ({ option }) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post(
      `${API_URL}/hr`,
      { option },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response);
    return response;
  } catch (error) {
    throw error;
  }
};

const getDashbordcnt = async ({ region }) => {
  try {

    const token = localStorage.getItem("token");

    const response = await axios.post(
      `${API_URL}/dashboardCount`,
      { region },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
console.log(region);
    return response;
  } catch (error) {
    throw error;
  }
};

// const getDashbordcnt = async ({ region }) => {
//   try {
//     const token = localStorage.getItem("token");

//     // Ensure region is an array
//     const regions = Array.isArray(region) ? region : [region];

//     const response = await axios.post(
//       `${API_URL}/dashboardCount`,
//       { regions }, 
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );
// console.log(response,regions);
//     return response;
//   } catch (error) {
//     throw error;
//   }
// };
// const getDashbordcnt = async ({ region }) => {
//   try {
//     const token = localStorage.getItem("token");

//     // Convert comma-separated string to array
//     const regions = typeof region === 'string' ? region.split(',') : region;

//     const response = await axios.post(
//       `${API_URL}/dashboardCount`,
//       { regions }, // Send regions as an array
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );
//     console.log(response,regions);
//     return response;
//   } catch (error) {
//     throw error;
//   }
// };
const excelupload = async (formData) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.post(`${API_URL}/uploadExcel`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    if (error.response) {
    } else if (error.request) {
    } else {
    }
    throw error;
  }
};

const icciddetails = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/v1/iccidNumber`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const imsidetails = async (iccidNumber) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${API_URL}/v1/${encodeURIComponent(iccidNumber)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return null;
    }
    throw error;
  }
};

const sendMail = async (requestID) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API_URL}/v1/sendmail`, 
      { requestID }, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};


export {
  getRegions,
  getBranches,
  getLoginTypes,
  createUser,
  getHRRequests,
  submitDetails,
  HRstatus,
  getEmployeeDetails,
  getUsers,
  deactivateUser,
  requestInitiation,
  Hrsimrequest,
  DeactivationRequest,
  submitDeactivatedetails,
  getCount,
  getSwapRequests,
  requestSwapInitiation,
  submitswapdetails,
  bulkUpload,
  bulkRequest,
  bulkupdate,
  getSimRecord,
  getDashbordcnt,
  excelupload,
  icciddetails,
  imsidetails,
  getRegionalRequests,
  approveRequest,
  sendMail
};
