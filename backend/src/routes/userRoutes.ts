import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { z } from "zod";
import * as dotenv from "dotenv";

dotenv.config({ path: "../../.env" });
const userRouter = Router();

const prisma = new PrismaClient();

const signupUser = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(3),
  lastName: z.string().min(3),
});

const loginUser = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

userRouter.post("/signup", async (req, res) => {
  const parsedData = signupUser.safeParse(req.body);
  if (!parsedData.success) {
    ``;
    return res.status(400).json({
      message: "Inputs are not of correct format",
    });
  }
  console.log(parsedData.data);

  try {
    const checkUser = await prisma.user.findMany({
      where: {
        email: parsedData.data.email,
      },
    });
    if (checkUser.length) {
      return res.status(403).json({
        message: "Email already exists!",
      });
    }
    const userSignUp = await prisma.user.create({
      data: parsedData.data,
    });

    const toTokenize = { email: parsedData.data.email };
    const secret = process.env.SECRET || "";
    const token = "Bearer " + jwt.sign(toTokenize, secret);

    return res.status(200).json({
      message: "User successfully created",
      token: token,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server under maintenance",
    });
  }
});

userRouter.post("/login", async (req, res) => {
  const parsedData = loginUser.safeParse(req.body);
  if (!parsedData.success) {
    return res.status(400).json({
      message: "Inputs are not of correct format",
    });
  } else {
    console.log(parsedData.data);

    try {
      const checkUser = await prisma.user.findMany({
        where: {
          email: parsedData.data.email,
          password: parsedData.data.password,
        },
      });
      if (checkUser.length) {
        const toTokenize = { email: parsedData.data.email };
        const secret = process.env.SECRET || "";
        const token = "Bearer " + jwt.sign(toTokenize, secret);

        return res.status(200).json({
          message: "Login successful!",
          token: token,
        });
      } else {
        return res.status(403).json({
          message: "Invalid credentials!",
        });
      }
    } catch (error) {
      return res.status(500).json({
        message: "Server under maintenance",
      });
    }
  }
});

export default userRouter;
