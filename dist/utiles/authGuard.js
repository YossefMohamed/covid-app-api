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
exports.protect = exports.signIn = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const userModel_1 = __importDefault(require("../models/userModel"));
const signIn = (id) => {
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET || "randomSecret", {
        expiresIn: "30d",
    });
};
exports.signIn = signIn;
exports.protect = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let token;
        if (req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }
        if (!token) {
            res.status(400);
            return next(new Error("PLease Login !"));
        }
        // 2- validate token
        const login = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "randomSecret");
        const freshUser = yield userModel_1.default.findById(login.id);
        if (!freshUser) {
            return next(new Error("Please Login Again !"));
        }
        req.user = freshUser;
        next();
    }
    catch (error) {
        next(error);
    }
}));
