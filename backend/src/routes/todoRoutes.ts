import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import jwt, { JwtPayload } from "jsonwebtoken";
import * as dotenv from "dotenv";
import authCheck from "../todoMiddleware";

dotenv.config({ path: "../../.env" });
const todoRouter = Router();

const prisma = new PrismaClient();

type User = {
    email: string,
    password: string
}

todoRouter.get('/alltodos', authCheck, async (req, res)=>{
    const token = req.headers.authorization?.split(' ')[1]||"";

    const secret = process.env.SECRET||"";
    try {
        const decodedToken = jwt.verify(token, secret);
        console.log(decodedToken);
        
        const todoUser = await prisma.user.findFirst({
            where:{
                email: (decodedToken as JwtPayload).email
            }
        });
        
        
        if(!todoUser)
        {
            return res.status(401).json("First create an account.");
        }
        
        const todos = await prisma.todo.findMany({
            where:{
                userId: todoUser.id
            }
        })
        
        return res.status(200).json({
            message: "Todo fetch successful",
            todos: todos
        })
        
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error!"
        })
    }
});

todoRouter.post('/newtodo', authCheck, async (req, res)=>{
    const token = req.headers.authorization?.split(' ')[1]||"";

    const secret = process.env.SECRET||"";
    try {
        const decodedToken = jwt.verify(token, secret);
        console.log(decodedToken);
        
        const todoUser = await prisma.user.findFirst({
            where:{
                email: (decodedToken as JwtPayload).email
            }
        });
        
        
        if(!todoUser)
        {
            return res.status(401).json("First create an account.");
        }
        
        const todos = await prisma.todo.create({
            data:{
                title: req.body.title,
                description: req.body.description,
                done: false,
                userId: todoUser.id
            }
        });
        
        return res.status(200).json({
            message: "Todo created successful",
            todos: todos
        })
        
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error!"
        })
    }
})

export default todoRouter;
