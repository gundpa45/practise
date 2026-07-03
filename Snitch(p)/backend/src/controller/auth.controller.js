import mongoose from "mongoose"
import userModel from "../models/user.model.js"
import jwt from "jsonwebtoken"
import config from "../config/config.js"


    async function sendToken(user){
        const token =jwt.sign({id:user._id},config.JWT_SECRET,{expiresIn:"1d"})
        return token    
    }


async function  registerController(req,res){

    const [email,password,contact,fullname] =req.body

    try{
        const userExits= await userModel.findOne({
            $or:[{email:email},{contact:contact}]
        })

        if (userExits) {
            return res.status(400).json({
                msg: "User already exists"
            })
        }

        const user = userModel.create({
            email,password,contact,fullname
        })
        const token = sendToken(user)

        res.status(201).json({
            msg:"user created sucessfully",
            token
        })



    
    } catch (error) {
        return res.status(500).json({
            msg: "Internal server error"
        })
    }

}



export default {
    registerController
}