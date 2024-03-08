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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv = __importStar(require("dotenv"));
const express_1 = require("express");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const authRouter = (0, express_1.Router)();
dotenv.config({ path: '../.env' });
authRouter.use('', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers.authorization || "";
        if (!token.startsWith('Bearer ')) {
            return res.status(403).json({
                message: "Access denied! Login required."
            });
        }
        const tokenPart = token.split(' ')[1];
        console.log(tokenPart);
        const secret = process.env.SECRET || "";
        try {
            const verifiedToken = jsonwebtoken_1.default.verify(tokenPart, secret);
            const userData = prisma.user.findFirst({
                where: {
                    email: verifiedToken.email,
                    password: verifiedToken.password
                }
            });
            if (!userData) {
                return res.status(403).json({
                    message: "Access denied! Login required."
                });
            }
            // req.query['userId']=userData.id;
        }
        catch (error) {
            return res.status(403).json({
                message: "Unauthorized! Please Login to continue."
            });
        }
        console.log('.....');
        next();
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}));
exports.default = authRouter;
