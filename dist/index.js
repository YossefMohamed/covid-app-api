"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const sampleRoutes_1 = __importDefault(require("./routes/sampleRoutes"));
const database_1 = __importDefault(require("./database"));
const swaggerOptions_1 = __importDefault(require("./swaggerOptions"));
const userModel_1 = __importDefault(require("./models/userModel"));
const sampleModel_1 = __importDefault(require("./models/sampleModel"));
const authGuard_1 = require("./utiles/authGuard");
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
console.log(path_1.default.join(__dirname, './../public'));
app.use("/statics", express_1.default.static(path_1.default.join(__dirname, './../public')));
app.set('view engine', 'ejs');
app.set('views', path_1.default.join(path_1.default.join(__dirname, './../views')));
app.use((0, cookie_parser_1.default)());
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
// set the view engine to ejs
// admin dashboard route
app.get('/admin', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.cookies.token)
            return res.redirect('/admin/login');
        const usersArray = yield userModel_1.default.find();
        const samples = yield sampleModel_1.default.find({ tested: { $not: { $eq: true } } }).count();
        const samplesArray = yield sampleModel_1.default.find();
        const testedSamples = yield sampleModel_1.default.find({ tested: true }).count();
        const negativeSamples = yield sampleModel_1.default.find({ tested: { $not: { $eq: true } }, covid: false }).count();
        const positiveSamples = yield sampleModel_1.default.find({ tested: { $not: { $eq: true } }, covid: true }).count();
        res.render('index', {
            users: usersArray.length,
            samples: samplesArray.length,
            testedSamples,
            totalSamples: testedSamples + samples,
            negativeSamples,
            positiveSamples,
            samplesArray,
            usersArray
        });
    });
});
app.get('/admin/samples', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.cookies.token)
            return res.redirect('/admin/login');
        const samples = yield sampleModel_1.default.find();
        console.log(samples[0]);
        res.render('samples', {
            samples
        });
    });
});
app.get('/admin/login', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res.render('login', {
            message: ""
        });
    });
});
app.get("/admin/logout", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res.cookie("token", "");
        res.redirect('/admin/login');
    });
});
app.post('/admin/login', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield userModel_1.default.findOne({ number: req.body.number.trim() });
        if (!user || !(yield user.matchPassword(req.body.password))) {
            return res.render('login', {
                message: "Number Or Password Are Incorrect!!"
            });
        }
        const token = (0, authGuard_1.signIn)(user.id);
        res.cookie("token", token);
        res.redirect('/admin');
    });
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
