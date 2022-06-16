"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const database = () => {
    console.log(process.env.MONGODBURI);
    mongoose_1.default.connect(process.env.MONGODBURI || "mongodb://localhost:27020/mydb")
        .then((e) => console.log("connected"))
        .catch((e) => console.log(e.message));
};
exports.default = database;
