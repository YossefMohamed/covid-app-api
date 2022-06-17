import express from "express";
import {
  signup,
  messageSender,
  verfiyNumber,
  login,
  resetPassword,
  updateUser,
  deleteUser,
} from "../controllers/userControllers";

const router = express.Router();

router.post("/", signup);
router.post("/login", login);
router.post("/passwordreset", resetPassword);
router.patch("/update", updateUser);
router.delete("/delete", deleteUser);
router.post("/message", messageSender);
router.post("/verify", verfiyNumber);
export default router;


