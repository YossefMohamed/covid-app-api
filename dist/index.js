"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const body_parser_1 = __importDefault(require("body-parser"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const cloudinary_1 = __importDefault(require("cloudinary"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, "./.env") });
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const sampleRoutes_1 = __importDefault(require("./routes/sampleRoutes"));
const database_1 = __importDefault(require("./database"));
const swaggerOptions_1 = __importDefault(require("./swaggerOptions"));
const app = (0, express_1.default)();
const router = express_1.default.Router();
cloudinary_1.default.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
const swaggerDocs = (0, swagger_jsdoc_1.default)(swaggerOptions_1.default);
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocs));
const port = process.env.PORT || 3000;
(0, database_1.default)();
router.use("/users", userRoutes_1.default);
router.use("/samples", sampleRoutes_1.default);
app.get("/", (req, res) => {
    res.send("Hello World");
});
app.use("/api/v1", router);
app.use((err, req, res, next) => {
    res.status(500).json({
        status: "failed",
        message: err.message,
    });
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
