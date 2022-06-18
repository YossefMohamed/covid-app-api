import { Response, Request, NextFunction } from "express";
import twilio from "twilio";
import mongoose from "mongoose";
import User from "../models/userModel";
import asyncHandler from "express-async-handler";
import { signIn } from "../utiles/authGuard";
import Vonage from "@vonage/server-sdk";


export const signup = asyncHandler(async (req: Request, res: Response) => {
  const {
    name,
    lastName,
    number,
    gender,
    email,
    password,
    confirmPassword,
  }: {
    name: string;
    lastName: string;
    number: number;
    gender: string;
    email: string;
    password: string;
    confirmPassword: string;
  } = req.body;
  if (password !== confirmPassword) {
    res.status(400).json({
      status: "failed",
      message: "password and confirm password must be same",
    });
    return;
  }

  const user = await User.create({
    name,
    lastName,
    number,
    gender,
    email,
    password,
  });
  const token = signIn(user.id);
  res.status(200).json({
    status: "ok",
    data: { user, token },
  });
});

export const messageSender = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      var verCode = "";
      var possible = "0123456789";
    
      for (var i = 0; i < 5; i++)
      verCode += possible.charAt(Math.floor(Math.random() * possible.length));
    


      if (!mongoose.isValidObjectId(req.query.user)) {
        res.status(404).json({
          status: "failed",
          message: "Invalid ID!",
        });
        return;
      }
      const user: any = await User.findById(req.query.user);

      if (!user) {
        res.status(404).json({
          status: "failed",
          message: "User Not Found !",
        });
        return;
      }
      const vonage = new Vonage({
        apiKey: "6634bc4e",
        apiSecret: "WAM92kRle91tUoVd",
      });
      const from = "Vonage APIs";
      const to = `2${user.number}`;
      const text = `Your Code Is ${verCode}\n STAY SAFE :)`;

      vonage.message.sendSms(from, to, text, {}, (err, responseData) => {
        if (err) {
          console.log(err);
        } else {
          if (responseData.messages[0]["status"] === "0") {
            console.log("Message sent successfully.");
          } else {
            console.log(
              `Message failed with error: ${responseData.messages[0]["error-text"]}`
            );
          }
        }
      });
      user.code = `${verCode}`;
      await user.save();

      res.status(200).json({
        status: "ok",
        data: { user },
      });
    } catch (error: any) {
      next(new Error(error));
    }
  }
);

export const verfiyNumber = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!mongoose.isValidObjectId(req.query.user)) {
      res.status(404).json({
        status: "failed",
        message: "Invalid ID!",
      });
      return;
    }
    const user: any = await User.findById(req.query.user);

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
      await user.save();
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
  }
);

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { number, password } = req.body;
  const user: any = await User.findOne({ number });
  if (!user || !(await user.matchPassword(password))) {
    res.status(404).json({
      status: "failed",
      message: "Number Or Password Is Incorrect",
    });
    return;
  }
  const token = signIn(user.id);

  res.status(200).json({
    status: "ok",
    data: { user, token },
  });
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, lastName, email } = req.body;
  if (!mongoose.isValidObjectId(req.query.user)) {
    res.status(404).json({
      status: "failed",
      message: "Invalid ID!",
    });
    return;
  }
  const user: any = await User.findById(req.query.user);

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
  await user.save();
  res.status(200).json({
    status: "ok",
    data: { user },
  });
});

export const resetPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { password, confirmPassword } = req.body;
    if (!mongoose.isValidObjectId(req.query.user)) {
      res.status(404).json({
        status: "failed",
        message: "Invalid ID!",
      });
      return;
    }
    const user: any = await User.findById(req.query.user);

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
    await user.save();
    res.status(200).json({
      status: "ok",
      data: { user },
    });
  }
);

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  if (!mongoose.isValidObjectId(req.query.user)) {
    res.status(404).json({
      status: "failed",
      message: "Invalid ID!",
    });
    return;
  }
  const user: any = await User.findById(req.query.user);

  if (!user) {
    res.status(404).json({
      status: "failed",
      message: "User Not Found !",
    });
    return;
  }
  await user.remove();
  res.status(200).json({
    status: "ok",
    data: { user },
  });
});
