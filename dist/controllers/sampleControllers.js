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
exports.deleteSample = exports.getSample = exports.getSamples = exports.getAllSamplesInCustomDataset = exports.addToCustomDataset = exports.addSample = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const cloudinary_1 = __importDefault(require("cloudinary"));
const sampleModel_1 = __importDefault(require("../models/sampleModel"));
const axios_1 = __importDefault(require("axios"));
const form_data_1 = __importDefault(require("form-data"));
exports.addSample = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { path } = req.file;
        const fName = req.file.originalname.split(".")[0];
        const { breathProblem, fever } = req.body;
        const sampleData = yield cloudinary_1.default.v2.uploader.upload(path, {
            resource_type: "raw",
            public_id: `AudioUploads/${fName}`,
            overwrite: true,
        });
        const deployedLink = "http://" + process.env.DEPLOYED_LINK + "/sample";
        var form = new form_data_1.default();
        form.append("fever", fever);
        form.append("breathProblem", breathProblem);
        form.append("link", sampleData.secure_url);
        const data = yield (0, axios_1.default)({
            method: "post",
            url: deployedLink,
            data: form,
            headers: { "Content-Type": "multipart/form-data" },
        });
        const sample = yield sampleModel_1.default.create({
            link: sampleData.secure_url,
            covid: data.data.covid,
            user: req.user._id,
            breathProblem,
            fever,
        });
        res.status(201).json({
            status: "ok",
            data: sample,
        });
    }
    catch (error) {
        next(new Error(error));
    }
}));
exports.addToCustomDataset = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { path } = req.file;
        const fName = req.file.originalname.split(".")[0];
        const { breathProblem, fever, tested } = req.body;
        const sampleData = yield cloudinary_1.default.v2.uploader.upload(path, {
            resource_type: "raw",
            public_id: `AudioUploads/${fName}`,
            overwrite: true,
        });
        const sample = yield sampleModel_1.default.create({
            link: sampleData.secure_url,
            covid: true,
            user: req.user._id,
            breathProblem,
            fever,
            tested: true
        });
        res.status(201).json({
            status: "ok",
            data: sample,
        });
    }
    catch (error) {
        next(new Error(error));
    }
}));
exports.getAllSamplesInCustomDataset = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const samples = yield sampleModel_1.default.find({ tested: true });
        res.status(200).json({
            status: "ok",
            data: samples,
        });
    }
    catch (error) {
        next(new Error(error));
    }
}));
exports.getSamples = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const samples = yield sampleModel_1.default.find({ user: req.user._id, tested: false });
        res.status(200).json({
            status: "ok",
            data: {
                samples,
            },
        });
    }
    catch (error) {
        next(new Error(error));
    }
}));
exports.getSample = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sample = yield sampleModel_1.default.findById(req.params.id);
        if (!sample) {
            res.status(404).json({
                status: "failed",
                message: "Sample Not Found !",
            });
            return;
        }
        if (sample.user.toString() !== req.user._id.toString()) {
            res.status(404).json({
                status: "failed",
                message: "Not Authorized !",
            });
            return;
        }
        res.status(200).json({
            status: "ok",
            data: {
                sample,
            },
        });
    }
    catch (error) {
        next(new Error(error));
    }
}));
exports.deleteSample = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sample = yield sampleModel_1.default.findById(req.params.id);
        if (!sample) {
            res.status(404).json({
                status: "failed",
                message: "Sample Not Found !",
            });
            return;
        }
        if (sample.user.toString() !== req.user._id.toString()) {
            res.status(401).json({
                status: "failed",
                message: "Not Authorized !",
            });
            return;
        }
        yield cloudinary_1.default.v2.uploader.destroy(sample.link.split("/")[7]);
        yield sample.remove();
        res.status(202).json({
            status: "ok",
            data: {
                sample,
            },
        });
    }
    catch (error) {
        next(new Error(error));
    }
}));
