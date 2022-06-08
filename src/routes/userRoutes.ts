import express from "express";
import {
  signup,
  messageSender,
  verfiyNumber,
  login,
} from "../controllers/userControllers";
const router = express.Router();


router.post("/", signup);
router.post("/login", login);

router.post("/message", messageSender);
router.post("/verify", verfiyNumber);
export default router;
