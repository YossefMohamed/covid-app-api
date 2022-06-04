import asyncHandler from "express-async-handler";
import cloudinary from "cloudinary";
import { Request } from "express";
import { UserInterface } from "../models/userModel";
import Sample from "../models/sampleModel";
import axios from "axios";
import formData from "form-data";
interface RequestInterface extends Request {
  user: UserInterface;
}

export const addSample = asyncHandler(async (req: any, res: any, next: any) => {
  try {
    const { path } = req.file;
    const fName = req.file.originalname.split(".")[0];
    const { breathProblem, fever } = req.body;
    const sampleData = await cloudinary.v2.uploader.upload(path, {
      resource_type: "raw",
      public_id: `AudioUploads/${fName}`,
      overwrite: true,
    });
    const deployedLink: string =
      "http://" + process.env.DEPLOYED_LINK + "/sample";
    var form = new formData();
    form.append("fever", fever);
    form.append("breathProblem", breathProblem);
    form.append("link", sampleData.secure_url);

    const data = await axios({
      method: "post",
      url: deployedLink,
      data: form,
      headers: { "Content-Type": "multipart/form-data" },
    });
    const sample = await Sample.create({
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
  } catch (error: any) {
    next(new Error(error));
  }
});

export const getSamples = asyncHandler(
  async (req: any, res: any, next: any) => {
    try {
      const samples = await Sample.find({ user: req.user._id });
      res.status(200).json({
        status: "ok",
        data: {
          samples,
        },
      });
    } catch (error: any) {
      next(new Error(error));
    }
  }
);

export const getSample = asyncHandler(async (req: any, res: any, next: any) => {
  try {
    const sample = await Sample.findById(req.params.id);
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
  } catch (error: any) {
    next(new Error(error));
  }
});

export const deleteSample = asyncHandler(
  async (req: any, res: any, next: any) => {
    try {
      const sample = await Sample.findById(req.params.id);
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
      await cloudinary.v2.uploader.destroy(sample.link.split("/")[7]);
      await sample.remove();
      res.status(202).json({
        status: "ok",
        data: {
          sample,
        },
      });
    } catch (error: any) {
      next(new Error(error));
    }
  }
);
