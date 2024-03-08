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
const dotenv = __importStar(require("dotenv"));
const todoMiddleware_1 = __importDefault(require("../todoMiddleware"));
dotenv.config({ path: "../../.env" });
const todoRouter = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
todoRouter.get('/alltodos', todoMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = ((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1]) || "";
    const secret = process.env.SECRET || "";
    try {
        const decodedToken = jsonwebtoken_1.default.verify(token, secret);
        console.log(decodedToken);
        const todoUser = yield prisma.user.findFirst({
            where: {
                email: decodedToken.email
            }
        });
        if (!todoUser) {
            return res.status(401).json("First create an account.");
        }
        const todos = yield prisma.todo.findMany({
            where: {
                userId: todoUser.id
            }
        });
        return res.status(200).json({
            message: "Todo fetch successful",
            todos: todos
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal server error!"
        });
    }
}));
todoRouter.post('/newtodo', todoMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const token = ((_b = req.headers.authorization) === null || _b === void 0 ? void 0 : _b.split(' ')[1]) || "";
    const secret = process.env.SECRET || "";
    try {
        const decodedToken = jsonwebtoken_1.default.verify(token, secret);
        console.log(decodedToken);
        const todoUser = yield prisma.user.findFirst({
            where: {
                email: decodedToken.email
            }
        });
        if (!todoUser) {
            return res.status(401).json("First create an account.");
        }
        const todos = yield prisma.todo.create({
            data: {
                title: req.body.title,
                description: req.body.description,
                done: false,
                userId: todoUser.id
            }
        });
        return res.status(200).json({
            message: "Todo created successful",
            todos: todos
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal server error!"
        });
    }
}));
exports.default = todoRouter;
