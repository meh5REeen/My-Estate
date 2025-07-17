import { errorHandler } from "./error.js";
import jwt from "jsonwebtoken";
export const verifyToken = (req,res,next) =>{
    console.log("I am here")
    const token =  req.cookies.access_token || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token' });
    }
    console.log("tokani de",token);
    jwt.verify(token,process.env.JWT_SECRET,(err,user) => {
        if(err) return next(errorHandler(403,'Forbidden'));

        req.user = user;
        console.log("vfty",user);
        next();
    });

    }
