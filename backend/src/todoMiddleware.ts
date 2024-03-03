import jwt, { JwtPayload } from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import express, {Router} from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const authRouter = Router();

dotenv.config({path:'../.env'});


authRouter.use('', async (req, res, next)=>{
    try {
        const token = req.headers.authorization || "";
        if(!token.startsWith('Bearer '))
        {
            return res.status(403).json({
                message: "Access denied! Login required."
            })
        }
        const tokenPart = token.split(' ')[1];
        console.log(tokenPart);

        const secret = process.env.SECRET||"";
        try {
            const verifiedToken:JwtPayload = jwt.verify(tokenPart, secret) as JwtPayload;

            const userData = prisma.user.findFirst({
                where:{
                    email: verifiedToken.email,
                    password: verifiedToken.password
                }
            })
            if(!userData)
            {
                return res.status(403).json({
                    message: "Access denied! Login required."
                });
            }
            req.query['userId']=userData.id;

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
})

export default authRouter;

