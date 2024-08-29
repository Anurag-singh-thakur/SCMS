import express from "express";
import { protectRoute } from "../Middleware/protectRoute.js";
import { Addsubject,GetSubject,AddNotice,GetNotice,deleteNotice,deleteSubject } from "../Controllers/SubjectController.js";

const router = express.Router();

router.post('/subject',protectRoute,Addsubject)
router.get('/:Uid',protectRoute,GetSubject)
router.post('/subject/:Sid',protectRoute,AddNotice)
router.get('/subject/:Sid',protectRoute,GetNotice)
router.delete('/notice/:subjectId/:noticeId',protectRoute,deleteNotice)
router.delete('/:subjectId',protectRoute,deleteSubject)

export default router;