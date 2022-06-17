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

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now());
  },
});


const addToCustomDataset = async (req: any, res: any, next: any) => {
  res.send()
}



const upload = multer({
  storage: storage,
  limits: {
    fieldNameSize: 200,
    fileSize: 6 * 1024 * 1024,
  },
});


router.use(protect);
router.post("/", upload.single("sample"), addSample);
router.post("/addtocustomdataset", upload.single("sample"), addToCustomDataset);
router.get("/", getSamples);
router.get("/:id", getSample);
router.delete("/:id", deleteSample);

export default router;
