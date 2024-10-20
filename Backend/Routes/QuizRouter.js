import express from "express";
import { protectRoute } from "../Middleware/protectRoute.js";
import { createQuiz } from "../Controllers/QuizController.js";

const router = express.Router();

router.post('/quiz',protectRoute,createQuiz);

export default router;