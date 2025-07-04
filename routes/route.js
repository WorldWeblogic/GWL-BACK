const express = require('express')
const router = express.Router();

const upload = require("../middleware/pdf-upload-middleware");
 
const { signup, login, user, updateCustomer, getallcustomer, softdeletecustomer, updatesinglecustomer, approvecustomer, deleteCustomer, rejectcustomer,getLastCusId } = require("../controllers/customer-controllers")

const { signupAdmin, loginAdmin, admin, updateadmin } = require("../controllers/admin-controller");

const { signupEmployee, loginEmployee, getallemployee, updateEmployee, employee, monthlysaleform, softdeleteemployee, updatesingleemployee, approveEmp, deleteEmp, rejectEmp, requestpoints, allrequest, pointsreview, getLastEmpId, getleaderboard } = require("../controllers/employee-controller");

const { signupManager, loginManager, manager, getallmanager, softdeletemanager, updateManager, updatesingleSManager, getLastSuperManId } = require("../controllers/manager-controller");

// const authenticatetoken = require("../middleware/auth-middleware");
// const validate = require("../middleware/validate-middleware")
// const loginSchema = require("../validators/user-validator");
// const addcustomerschema = require("../validators/user-validator");

const { createOffer, getalloffer, updateoffer, softdeleteoffer, approveOffer, deleteOffer, rejectOffer, getSingleCustomerOffer, getapproveoffer, getLastOfferId} = require('../controllers/offer-controller');

const { upcomingcreateOffer, upcomingupdateoffer, upcomingsoftdeleteoffer, allupcomingoffer, deleteupcomingOffer, approveupcomingOffer, rejectupcomingOffer, getSingleCustomerUpcomingOffer, allapproveupcomingoffer,getLastCusOfferId } = require('../controllers/upcomingoffer-controller');

const { employeecreateOffer, employeegetalloffer, getSingleEmpOffer, employeeupdateoffer, employeesoftdeleteoffer, approveEmployeeOffer, deleteEmployeeOffer, rejectEmployeeOffer, employeegetallapproveoffer, getLastAddEmpOffer } = require('../controllers/employee-offer-controller');

const { upcomingcreateemployeeOffer, allupcomingemployeeoffer, upcomingupdateemployeeoffer, upcomingsoftdeleteemployeeoffer, deleteemployeeupcomingOffer, approveemployeeupcomingOffer, rejectemployeeupcomingOffer, getSingleEmpUpOffer, employeegetallupcomapproveoffer, getLastEmpOfferId } = require('../controllers/EmployeeUpcomingOffer-controllers');

const { CreateCompany, softdeletecompany, getallcompany, updatecompany, approvecompany, deletecompany, rejectcompany, getCompany, requestcompanypoints, allcompanyrequest, companypointsreview, getLastComId } = require('../controllers/Company-controller');

const { signuplowerManager, loginlowerManager, lowermanager, updatelowerManager, getallLowermanager, softdeletelowermanager, updatesingleLManager, getLastLowerManId } = require('../controllers/lowermanager-controller');

const {sendMail}=require("../controllers/mail-controller");

// user routes
// router.post("/signup",validate(addcustomerschema),signup);
router.post("/signup", signup);
router.post("/login", login);
router.get("/user/:id", user);
router.get("/alluser", getallcustomer);
router.put('/update-customer/:customerid', updateCustomer);
router.patch("/deleteuser/:id", softdeletecustomer)
router.put("/update-singlecustomer/:id", updatesinglecustomer);
router.put("/approvecustomer/:id", approvecustomer);
router.put("/deletecustomer/:id", deleteCustomer);
router.put("/rejectcustomer/:id", rejectcustomer);

// admin routes
router.post("/signupAdmin", signupAdmin);
router.post("/loginAdmin", loginAdmin);
router.get("/admin/:id", admin);
router.put("/updateadmin/:id",updateadmin);

// employee routes
router.post("/signupEmployee", signupEmployee);
// router.post("/loginEmployee",validate(loginSchema),loginEmployee);
router.post("/loginEmployee", loginEmployee);
router.get("/allemployee", getallemployee);
router.get("/employee/:id", employee);
router.put('/update-employee/:employeeid', updateEmployee);
router.put("/monthlysaleform/:id", monthlysaleform);
router.patch("/deleteemployee/:id", softdeleteemployee);
router.put("/updatesingleemployee/:id", updatesingleemployee);
router.put("/approveEmp/:id", approveEmp);
router.put("/deleteEmp/:id", deleteEmp);
router.put("/rejectEmp/:id", rejectEmp);
router.post("/request", requestpoints);
router.get("/allrequest", allrequest);
router.post('/review/:id', pointsreview);
router.get('/empleader',getleaderboard);

// manager routes
router.post("/signupManager", signupManager);
router.post("/loginManager", loginManager);
router.get("/manager/:id", manager);
router.get("/allmanager", getallmanager);
router.put("/superManagerProfile/:id", updatesingleSManager);
router.patch("/delete-manager/:id", softdeletemanager);
router.put('/update-manager/:managerid', updateManager);
router.get("/getLastSuperManager",getLastSuperManId);

// offer route
router.post("/create-offer", createOffer);
router.get("/get-offer", getalloffer)
router.get("/get-approveoffer",getapproveoffer)
router.get("/getSingleCustomerOffer/:id", getSingleCustomerOffer)
router.put("/update-offer/:offerid", updateoffer);
router.patch("/delete-offer/:id", softdeleteoffer);
router.put("/approve-offer/:id", approveOffer);
router.put("/decline-offer/:id", deleteOffer);
router.put("/reject-offer/:id", rejectOffer);
router.get("/getLastOfferId", getLastOfferId);
router.get("/getLastCustomerId", getLastCusId);

// employee offer route
router.post("/create-employee-offer", employeecreateOffer);
router.get("/getall-employee-offer", employeegetalloffer)
router.get("/getallapprove-employee-offer", employeegetallapproveoffer)
router.get("/single-employee-offer/:id", getSingleEmpOffer);
router.get("/last-emp-offer-id", getLastEmpOfferId);
router.put("/update-employee-offer/:offerid", employeeupdateoffer);
router.patch("/delete-employee-offer/:id", employeesoftdeleteoffer);
router.put("/approve-employee-offer/:id", approveEmployeeOffer);
router.put("/decline-employee-offer/:id", deleteEmployeeOffer);
router.put("/reject-employee-offer/:id", rejectEmployeeOffer);
router.get("/getLastEmpId", getLastEmpId);
router.get("/getLastEmpOffeerId", getLastAddEmpOffer);

// upcoming offer route
router.post("/upcomingcreate-offer", upcomingcreateOffer);
router.get("/getupcoming-offer", allupcomingoffer);
router.get("/get-approveupcomingoffer",allapproveupcomingoffer)
router.get("/singleCust-upcoming-offer/:id", getSingleCustomerUpcomingOffer);
router.get("/last-cust-up-offer-id", getLastCusOfferId);
router.put("/upcomingupdate-offer/:offerid", upcomingupdateoffer);
router.patch("/upcomingdelete-offer/:id", upcomingsoftdeleteoffer);
router.put("/approveupcomingoffer/:id", approveupcomingOffer);
router.put("/deleteupcomingoffer/:id", deleteupcomingOffer);
router.put("/rejectupcomingoffer/:id", rejectupcomingOffer);

// employee upcoming offer route
router.post("/upcomingcreate-employee-offer", upcomingcreateemployeeOffer);
router.get("/getupcoming-employee-offer", allupcomingemployeeoffer);
router.get("/getapproveupcoming-employee-offer", employeegetallupcomapproveoffer);
router.get("/upcoming-singleEmployee-offer/:id", getSingleEmpUpOffer);
router.put("/upcomingupdate-employee-offer/:offerid", upcomingupdateemployeeoffer);
router.get("/last-emp-up-offer-id", getLastEmpOfferId);
router.patch("/upcomingdelete-employee-offer/:id", upcomingsoftdeleteemployeeoffer);
router.put("/approveemployeeupcomingoffer/:id", approveemployeeupcomingOffer);
router.put("/deleteemployeeupcomingoffer/:id", deleteemployeeupcomingOffer);
router.put("/rejectemployeeupcomingoffer/:id", rejectemployeeupcomingOffer);

// company route
router.post(
  "/create-company",
  upload.fields([
    { name: "pdf1", maxCount: 1 },
    { name: "pdf2", maxCount: 1 }
  ]),
  CreateCompany
);
router.patch("/softdelete-company/:id", softdeletecompany);
router.get("/getallcompany", getallcompany);
router.get("/getCompany/:id", getCompany);
// router.put("/updatecompany/:companyId", updatecompany);
router.put(
  "/updatecompany/:companyId",
  upload.fields([
    { name: "pdf1", maxCount: 1 },
    { name: "pdf2", maxCount: 1 }
  ]),
  updatecompany
);
router.put("/approvecompany/:id", approvecompany);
router.put("/deletecompany/:id", deletecompany);
router.put("/rejectcompany/:id", rejectcompany);
router.post("/companypoints", requestcompanypoints);
router.get("/allcompanyrequest", allcompanyrequest);
router.post('/reviewpoints/:id', companypointsreview);
router.get("/getLastComId", getLastComId);

// lower manager route
router.post("/create-lowermanager", signuplowerManager);
router.post("/login-lowermanager", loginlowerManager);
router.get("/getlowermanager/:id", lowermanager);
router.put("/update-lowermanager/:managerid", updatelowerManager)
router.put("/update-singleLM/:id", updatesingleLManager)
router.get("/allLowermanager", getallLowermanager);
router.patch("/deletelowermanager/:id", softdeletelowermanager);
router.get("/getLastLowerMan",getLastLowerManId)

// send mail
router.post('/send-mail', sendMail);

module.exports = router;


