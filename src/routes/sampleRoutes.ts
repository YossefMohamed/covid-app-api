import express from "express";
import multer from "multer";
import {
  addSample,
  addToCustomDataset,
  deleteSample,
  getAllSamplesInCustomDataset,
  getSample,
  getSamples,
  getUnvirfiedSamples,
  verifySample,
} from "../controllers/sampleControllers";

import { protect } from "../utiles/authGuard";

const router = express.Router();

const storage = multer.diskStorage({});


const upload = multer({
  storage: storage,
  limits: {
    fieldNameSize: 200,
    fileSize: 6 * 1024 * 1024,
  },
});


router.use(protect);
router.post("/", upload.single("sample"), addSample);
router.post("/addtocustomdataset",upload.fields([{
    name: 'sample', maxCount: 1
  }, {
    name: 'report', maxCount: 1
  }]), addToCustomDataset);
router.get("/dataset", getAllSamplesInCustomDataset);
router.get("/verifysample", getUnvirfiedSamples);
router.patch("/verifysample", verifySample);
router.get("/", getSamples);
router.get("/:id", getSample);
router.delete("/:id", deleteSample);

export default router;
