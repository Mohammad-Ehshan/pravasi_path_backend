import express from 'express'
import { deleteJob, getAllJobs,getmyJobs,postJob, updateJob, getSinglejob } from '../controllers/jobController.js';
import { isAuthorized } from '../middlerwares/auth.js';

const router= express.Router();

router.get("/getall",getAllJobs);
router.post("/post",isAuthorized,postJob);
router.get("/getmyjobs",isAuthorized,getmyJobs);
router.put("/update/:id",isAuthorized,updateJob);
router.delete("/delete/:id",isAuthorized,deleteJob);
router.get("/:id",isAuthorized,getSinglejob);

export default router;