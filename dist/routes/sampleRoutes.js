"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const sampleControllers_1 = require("../controllers/sampleControllers");
const authGuard_1 = require("../utiles/authGuard");
const router = express_1.default.Router();
const storage = multer_1.default.diskStorage({});
const upload = (0, multer_1.default)({
    storage: storage,
    limits: {
        fieldNameSize: 200,
        fileSize: 6 * 1024 * 1024,
    },
});
router.use(authGuard_1.protect);
router.post("/", upload.single("sample"), sampleControllers_1.addSample);
router.post("/addtocustomdataset", upload.fields([{
        name: 'sample', maxCount: 1
    }, {
        name: 'report', maxCount: 1
    }]), sampleControllers_1.addToCustomDataset);
router.get("/addtocustomdataset", sampleControllers_1.getAllSamplesInCustomDataset);
router.get("/", sampleControllers_1.getSamples);
router.get("/:id", sampleControllers_1.getSample);
router.delete("/:id", sampleControllers_1.deleteSample);
exports.default = router;
