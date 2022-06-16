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
exports.deleteUser = exports.resetPassword = exports.updateUser = exports.login = exports.verfiyNumber = exports.messageSender = exports.signup = void 0;
const twilio_1 = __importDefault(require("twilio"));
const mongoose_1 = __importDefault(require("mongoose"));
const userModel_1 = __importDefault(require("../models/userModel"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const authGuard_1 = require("../utiles/authGuard");
const server_sdk_1 = __importDefault(require("@vonage/server-sdk"));
const client = (0, twilio_1.default)(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_TOKEN);
exports.signup = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, lastName, number, gender, email, password, confirmPassword, } = req.body;
    if (password !== confirmPassword) {
        res.status(400).json({
            status: "failed",
            message: "password and confirm password must be same",
        });
        return;
    }
    const user = yield userModel_1.default.create({
        name,
        lastName,
        number,
        gender,
        email,
        password,
    });
    const token = (0, authGuard_1.signIn)(user.id);
    res.status(200).json({
        status: "ok",
        data: { user, token },
    });
}));
exports.messageSender = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const verCode = "784585";
        if (!mongoose_1.default.isValidObjectId(req.query.user)) {
            res.status(404).json({
                status: "failed",
                message: "Invalid ID!",
            });
            return;
        }
        const user = yield userModel_1.default.findById(req.query.user);
        if (!user) {
            res.status(404).json({
                status: "failed",
                message: "User Not Found !",
            });
            return;
        }
        //       const from = "Vonage APIs"
        // const to = "201151784019"
        // const text = 'A text message sent using the Vonage SMS API'
        // vonage.message.sendSms(from, to, text, (err, responseData) => {
        //     if (err) {
        //         console.log(err);
        //     } else {
        //         if(responseData.messages[0]['status'] === "0") {
        //             console.log("Message sent successfully.");
        //         } else {
        //             console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
        //         }
        //     }
        // })
        const vonage = new server_sdk_1.default({
            apiKey: "6634bc4e",
            apiSecret: "WAM92kRle91tUoVd",
        });
        const from = "Vonage APIs";
        const to = `2${user.number}`;
        const text = `Your Code Is ${verCode}\n STAY SAFE :)`;
        vonage.message.sendSms(from, to, text, {}, (err, responseData) => {
            if (err) {
                console.log(err);
            }
            else {
                if (responseData.messages[0]["status"] === "0") {
                    console.log("Message sent successfully.");
                }
                else {
                    console.log(`Message failed with error: ${responseData.messages[0]["error-text"]}`);
                }
            }
        });
        user.code = `${verCode}`;
        yield user.save();
        res.status(200).json({
            status: "ok",
            data: { user },
        });
    }
    catch (error) {
        next(new Error(error));
    }
}));
exports.verfiyNumber = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoose_1.default.isValidObjectId(req.query.user)) {
        res.status(404).json({
            status: "failed",
            message: "Invalid ID!",
        });
        return;
    }
    const user = yield userModel_1.default.findById(req.query.user);
    if (!user) {
        res.status(404).json({
            status: "failed",
            message: "User Not Found !",
        });
        return;
    }
    if (user.code === req.body.code) {
        user.verified = true;
        user.code = undefined;
        yield user.save();
        res.status(200).json({
            status: "ok",
            data: { user },
        });
        return;
    }
    res.status(400).json({
        status: "failed",
        message: "Code Is Not Correct",
    });
}));
exports.login = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { number, password } = req.body;
    const user = yield userModel_1.default.findOne({ number });
    if (!user || !(yield user.matchPassword(password))) {
        res.status(404).json({
            status: "failed",
            message: "Number Or Password Is Incorrect",
        });
        return;
    }
    const token = (0, authGuard_1.signIn)(user.id);
    res.status(200).json({
        status: "ok",
        data: { user, token },
    });
}));
exports.updateUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, lastName, email } = req.body;
    if (!mongoose_1.default.isValidObjectId(req.query.user)) {
        res.status(404).json({
            status: "failed",
            message: "Invalid ID!",
        });
        return;
    }
    const user = yield userModel_1.default.findById(req.query.user);
    if (!user) {
        res.status(404).json({
            status: "failed",
            message: "User Not Found !",
        });
        return;
    }
    user.name = name;
    user.lastName = lastName;
    user.email = email;
    yield user.save();
    res.status(200).json({
        status: "ok",
        data: { user },
    });
}));
exports.resetPassword = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { password, confirmPassword } = req.body;
    if (!mongoose_1.default.isValidObjectId(req.query.user)) {
        res.status(404).json({
            status: "failed",
            message: "Invalid ID!",
        });
        return;
    }
    const user = yield userModel_1.default.findById(req.query.user);
    if (!user) {
        res.status(404).json({
            status: "failed",
            message: "User Not Found !",
        });
        return;
    }
    if (password !== confirmPassword) {
        res.status(400).json({
            status: "failed",
            message: "password and confirm password must be same",
        });
        return;
    }
    user.password = password;
    yield user.save();
    res.status(200).json({
        status: "ok",
        data: { user },
    });
}));
exports.deleteUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoose_1.default.isValidObjectId(req.query.user)) {
        res.status(404).json({
            status: "failed",
            message: "Invalid ID!",
        });
        return;
    }
    const user = yield userModel_1.default.findById(req.query.user);
    if (!user) {
        res.status(404).json({
            status: "failed",
            message: "User Not Found !",
        });
        return;
    }
    yield user.remove();
    res.status(200).json({
        status: "ok",
        data: { user },
    });
}));
