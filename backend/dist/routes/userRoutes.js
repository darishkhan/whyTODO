"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const express_1 = require("express");
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
const dotenv = __importStar(require("dotenv"));
dotenv.config({ path: "../../.env" });
const userRouter = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
const signupUser = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
    firstName: zod_1.z.string().min(3),
    lastName: zod_1.z.string().min(3),
});
const loginUser = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
});
userRouter.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedData = signupUser.safeParse(req.body);
    if (!parsedData.success) {
        ``;
        return res.status(400).json({
            message: "Inputs are not of correct format",
        });
    }
    console.log(parsedData.data);
    try {
        const checkUser = yield prisma.user.findMany({
            where: {
                email: parsedData.data.email,
            },
        });
        if (checkUser.length) {
            return res.status(403).json({
                message: "Email already exists!",
            });
        }
        const userSignUp = yield prisma.user.create({
            data: parsedData.data,
        });
        const toTokenize = { email: parsedData.data.email };
        const secret = process.env.SECRET || "";
        const token = "Bearer " + jsonwebtoken_1.default.sign(toTokenize, secret);
        return res.status(200).json({
            message: "User successfully created",
            token: token,
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Server under maintenance",
        });
    }
}));
userRouter.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedData = loginUser.safeParse(req.body);
    if (!parsedData.success) {
        return res.status(400).json({
            message: "Inputs are not of correct format",
        });
    }
    else {
        console.log(parsedData.data);
        try {
            const checkUser = yield prisma.user.findMany({
                where: {
                    email: parsedData.data.email,
                    password: parsedData.data.password,
                },
            });
            if (checkUser.length) {
                const toTokenize = { email: parsedData.data.email };
                const secret = process.env.SECRET || "";
                const token = "Bearer " + jsonwebtoken_1.default.sign(toTokenize, secret);
                return res.status(200).json({
                    message: "Login successful!",
                    token: token,
                });
            }
            else {
                return res.status(403).json({
                    message: "Invalid credentials!",
                });
            }
        }
        catch (error) {
            return res.status(500).json({
                message: "Server under maintenance",
            });
        }
    }
}));
exports.default = userRouter;
