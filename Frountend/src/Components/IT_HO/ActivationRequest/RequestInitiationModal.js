// import React, { useState, useEffect } from "react";
// import { Modal, Button, Form, Container, Row, Col } from "react-bootstrap";
// import { useTheme } from "@mui/material/styles";
// import { icciddetails, imsidetails } from "../../../Services/Api";

// const RequestInitiationModal = ({
//   open,
//   onClose,
//   onSubmit,
//   requestId,
//   ICCID_Number,
//   IMSI_Number,
//   vendorName,
//   setICCIDNumber,
//   setIMSI_Number,
//   setVendorName,
// }) => {
//   const theme = useTheme();
//   const [iccidOptions, setIccidOptions] = useState([]);
//   const [isFetchingIMSI, setIsFetchingIMSI] = useState(false);

//   const resetFields = () => {
//     setICCIDNumber("");
//     setIMSI_Number("");
//     setVendorName("");
//   };

//   useEffect(() => {
//     if (!open) {
//       resetFields();
//     } else {
//       fetchIccidDetails();
//     }
//   }, [open]);

//   const fetchIccidDetails = async () => {
//     try {
//       const response = await icciddetails();
//       console.log(response);
//       if (response) {
//         setIccidOptions(response[0]);
//       }
//     } catch (error) {
//       console.error("Error fetching ICCID details:", error);
//     }
//   };

//   const handleICCIDChange = async (e) => {
//     const selectedICCID = e.target.value;
//     setICCIDNumber(selectedICCID);

//     if (selectedICCID) {
//       setIsFetchingIMSI(true); 
//       try {
//         const response = await imsidetails(selectedICCID);
//         if (response) {
//           setIMSI_Number(response[0].imsiNumber); 
//           setVendorName(response[0].telecomPartner); 
//         } else {
//           setIMSI_Number("");
//           setVendorName(""); 
//         }
//       } catch (error) {
//         console.error("Error fetching IMSI details:", error);
//         setIMSI_Number("");
//         setVendorName(""); 
//       } finally {
//         setIsFetchingIMSI(false); 
//       }
//     }
//   };

//   const handleSubmit = () => { 
//       onSubmit();
//       onClose();
//   };

//   return (
//     <>
//       <Modal show={open} onHide={onClose} centered>
//         <div
//           style={{
//             backgroundColor: theme.palette.background.paper,
//           }}
//         >
//           <Modal.Header closeButton>
//             <Modal.Title>Request Initiation</Modal.Title>
//           </Modal.Header>
//           <Modal.Body>
//             <Container>
//               <Form>
//                 <Form.Group as={Row} controlId="formReqID">
//                   <Form.Label
//                     column
//                     sm={4}
//                     style={{ color: theme.palette.text.primary }}
//                   >
//                     ReqID
//                   </Form.Label>
//                   <Col sm={8}>
//                     <Form.Control type="text" value={requestId} readOnly />
//                   </Col>
//                 </Form.Group>
//                 <Form.Group
//                   as={Row}
//                   controlId="formICCIDNumber"
//                   className="mt-3"
//                 >
//                   <Form.Label
//                     column
//                     sm={4}
//                     style={{ color: theme.palette.text.primary }}
//                   >
//                     ICCID Number
//                   </Form.Label>
//                   <Col sm={8}>
//                     <Form.Control
//                       as="select"
//                       value={ICCID_Number}
//                       onChange={handleICCIDChange}
//                     >
//                       <option value="" disabled>
//                         Select ICCID Number
//                       </option>
//                       {iccidOptions.map((iccid, index) => (
//                         <option key={index} value={iccid.iccidNumber}>
//                           {iccid.iccidNumber}
//                         </option>
//                       ))}
//                     </Form.Control>
//                   </Col>
//                 </Form.Group>

//                 <Form.Group
//                   as={Row}
//                   controlId="formIMSI_Number"
//                   className="mt-3"
//                 >
//                   <Form.Label
//                     column
//                     sm={4}
//                     style={{ color: theme.palette.text.primary }}
//                   >
//                     IMSI Number
//                   </Form.Label>
//                   <Col sm={8}>
//                     <Form.Control
//                       type="text"
//                       value={IMSI_Number}
//                       readOnly
//                     />
//                   </Col>
//                 </Form.Group>
//                 <Form.Group
//                   as={Row}
//                   controlId="formVendorName"
//                   className="mt-3"
//                 >
//                   <Form.Label
//                     column
//                     sm={4}
//                     style={{ color: theme.palette.text.primary }}
//                   >
//                     Telecom Partner
//                   </Form.Label>
//                   <Col sm={8}>
//                     <Form.Control
//                       type="text"
//                       value={vendorName}
//                       readOnly
//                     />
//                   </Col>
//                 </Form.Group>
//               </Form>
//             </Container>
//           </Modal.Body>
//           <Modal.Footer>
//             <Button variant="secondary" onClick={onClose}>
//               Close
//             </Button>
//             <Button variant="primary" onClick={handleSubmit}>
//               Submit
//             </Button>
//           </Modal.Footer>
//         </div>
//       </Modal>
//     </>
//   );
// };

// export default RequestInitiationModal;








import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Container, Row, Col } from "react-bootstrap";
import Select from "react-select"; // Import react-select
import { useTheme } from "@mui/material/styles";
import { icciddetails, imsidetails } from "../../../Services/Api";

const RequestInitiationModal = ({
  open,
  onClose,
  onSubmit,
  requestId,
  ICCID_Number,
  IMSI_Number,
  vendorName,
  setICCIDNumber,
  setIMSI_Number,
  setVendorName,
}) => {
  const theme = useTheme();
  const [iccidOptions, setIccidOptions] = useState([]);
  const [isFetchingIMSI, setIsFetchingIMSI] = useState(false);

  const resetFields = () => {
    setICCIDNumber("");
    setIMSI_Number("");
    setVendorName("");
  };

  useEffect(() => {
    if (!open) {
      resetFields();
    } else {
      fetchIccidDetails();
    }
  }, [open]);

  const fetchIccidDetails = async () => {
    try {
      const response = await icciddetails();
      if (response) {
        // Transform ICCID data for react-select
        const formattedOptions = response[0].map((item) => ({
          value: item.iccidNumber,
          label: item.iccidNumber,
        }));
        setIccidOptions(formattedOptions);
      }
    } catch (error) {
      console.error("Error fetching ICCID details:", error);
    }
  };

  const handleICCIDChange = async (selectedOption) => {
    const selectedICCID = selectedOption ? selectedOption.value : "";
    setICCIDNumber(selectedICCID);

    if (selectedICCID) {
      setIsFetchingIMSI(true);
      try {
        const response = await imsidetails(selectedICCID);
        if (response) {
          setIMSI_Number(response[0].imsiNumber);
          setVendorName(response[0].telecomPartner);
        } else {
          setIMSI_Number("");
          setVendorName("");
        }
      } catch (error) {
        console.error("Error fetching IMSI details:", error);
        setIMSI_Number("");
        setVendorName("");
      } finally {
        setIsFetchingIMSI(false);
      }
    }
  };

  const handleSubmit = () => {
    onSubmit();
    onClose();
  };

  return (
    <>
      <Modal show={open} onHide={onClose} centered>
        <div
          style={{
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title>Request Initiation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Container>
              <Form>
                <Form.Group as={Row} controlId="formReqID">
                  <Form.Label
                    column
                    sm={4}
                    style={{ color: theme.palette.text.primary }}
                  >
                    ReqID
                  </Form.Label>
                  <Col sm={8}>
                    <Form.Control type="text" value={requestId} readOnly />
                  </Col>
                </Form.Group>
                <Form.Group
                  as={Row}
                  controlId="formICCIDNumber"
                  className="mt-3"
                >
                  <Form.Label
                    column
                    sm={4}
                    style={{ color: theme.palette.text.primary }}
                    
                  >
                    ICCID Number
                  </Form.Label>
                  <Col sm={8}  style={{ color: theme.palette.text.primary }}>
                    <Select
                      options={iccidOptions}
                      style={{ color: theme.palette.text.primary }}
                     
                      value={
                        ICCID_Number
                          ? { value: ICCID_Number, label: ICCID_Number }
                          : null
                      }
                      onChange={handleICCIDChange}
                      placeholder="Search ICCID Number"
                      isClearable
                    />
                  </Col>
                </Form.Group>

                <Form.Group
                  as={Row}
                  controlId="formIMSI_Number"
                  className="mt-3"
                >
                  <Form.Label
                    column
                    sm={4}
                    style={{ color: theme.palette.text.primary }}
                  >
                    IMSI Number
                  </Form.Label>
                  <Col sm={8}>
                    <Form.Control type="text" value={IMSI_Number} readOnly />
                  </Col>
                </Form.Group>
                <Form.Group
                  as={Row}
                  controlId="formVendorName"
                  className="mt-3"
                >
                  <Form.Label
                    column
                    sm={4}
                    style={{ color: theme.palette.text.primary }}
                  >
                    Telecom Partner
                  </Form.Label>
                  <Col sm={8}>
                    <Form.Control type="text" value={vendorName} readOnly />
                  </Col>
                </Form.Group>
              </Form>
            </Container>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              Submit
            </Button>
          </Modal.Footer>
        </div>
      </Modal>
    </>
  );
};

export default RequestInitiationModal;
