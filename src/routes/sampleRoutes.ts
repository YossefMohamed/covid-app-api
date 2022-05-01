import express from "express";
import multer from "multer";
import {
  addSample,
  deleteSample,
  getSample,
  getSamples,
} from "../controllers/sampleControllers";

import { protect } from "../utiles/authGuard";

const router = express.Router();
router.use(protect);

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now());
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fieldNameSize: 200,
    fileSize: 6 * 1024 * 1024,
  },
});
router.post("/", upload.single("sample"), addSample);

router.get("/", getSamples);
router.get("/:id", getSample);
router.delete("/:id", deleteSample);

export default router;
