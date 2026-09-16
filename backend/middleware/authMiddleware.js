import jwt from 'jsonwebtoken';
import User from '../models/userModel.js'
import { wrapAsync } from '../utlis/wrapAsync.js';

export const validateUser = wrapAsync(async(req,res,next)=>{
       const token = req.headers.authorization?.split(" ")[1];
        if(!token){
            return res.status(401).json({message : 'Token not found!!'});
        }
        const decoded = jwt.verify(token, process.env.KEY)
        const user = await User.findById(decoded.userId);
        if(!user) {
            return res.status(401).json({message: "User not found" });
        }
        req.user = user;
        next();
        
})


