import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const protectRoute = async (req, res, next)=>{
    try {
        const token = req.cookies.jwt;
        if(!token){
            return res.status(401).json({message:"Pas d'autorisation! Aucun token trouvé"})
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if(!decoded){
            return res.status(401).json({message:"Pas d'autorisation! Token invalide"})
        }

        const user = await User.findById(decoded.userId).select("-password");

        if(!user){
            return res.status(404).json({message: "User not found."})
        }

        req.user = user

        next()

    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal server error"})
        
    }
}