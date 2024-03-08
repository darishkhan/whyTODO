import jwt, { JwtPayload } from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import express, {Request, Response, NextFunction, Router} from 'express';
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

dotenv.config({path:'../.env'});


const authCheck = async (req:Request, res:Response, next:NextFunction)=>{
    try {
        const token:string = req.headers.authorization!;
        if(!token.startsWith('Bearer '))
        {
            return res.status(403).json({
                message: "Access denied! Login required."
            })
        }
        const tokenPart = token.split(' ')[1];

        const secret = process.env.SECRET||"";
        try {
            const verifiedToken:JwtPayload = jwt.verify(tokenPart, secret) as JwtPayload;

            const userData = prisma.user.findFirst({
                where:{
                    email: verifiedToken.email,
                    password: verifiedToken.password
                }
            })
            console.log(userData);
            if(!userData)
            {
                return res.status(403).json({
                    message: "Access denied! Login required."
                });
            }

        } catch (error) {
            return res.status(403).json({
                message: "Unauthorized! Please Login to continue."
            })
        }
        console.log('.....');
        next();
                
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

export default authCheck;

