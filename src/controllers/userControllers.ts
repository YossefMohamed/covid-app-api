import { Response, Request, NextFunction } from "express";
import twilio from "twilio";
import mongoose from "mongoose";
import User from "../models/userModel";
import asyncHandler from "express-async-handler";
import { signIn } from "../utiles/authGuard";
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_TOKEN);

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
      const verCode = "784585";

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
      client.messages
        .create({
          messagingServiceSid: "MGcbb30f95b11a5d112df6ac104ca16f8f",
          to: `+2${user.number}`,
          body: `Your Code Is ${verCode}\n STAY SAFE :)`,
        })
        .then((message) => console.log("Message SENT!!"))
        .catch((err) => console.log(err));

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
    res.status(200).json({
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
