import express from "express";
import { protectRoute } from "../Middleware/protectRoute.js";
import { postGroupMessage,createToken,getGroupMessages } from "../Controllers/ChatController.js";
const router = express.Router();

router.get('/:subjectId/messages', protectRoute, getGroupMessages);
router.post('/:subjectId/messages', protectRoute, postGroupMessage);
router.get('/stream/token', protectRoute,createToken);

export default router