import { createNextState } from "@reduxjs/toolkit";
import User from "../models/user.js";
import Listing from "../models/listing.js";
import bcryptjs from "bcryptjs";
import mongoose from 'mongoose';
import { errorHandler } from "../utils/error.js";
export const test =(req,res) => {
    res.json({
        message:"Hi this is home"
    })
}

export const updateUser = async (req, res, next) => {


   console.log('req.user:', req.user);
   console.log('req.user._id:', req.user._id);
    console.log('req.params.id:', req.params.id);
    console.log('req.body:', req.body);
  if (!req.user || !req.user.id) {
      return next(errorHandler(401, 'User not authenticated'));
    }
   

  if (req.user.id !== req.params.id)
    return next(errorHandler(401, 'You can only update your own account!'));
  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
  return next(errorHandler(400, 'Invalid user ID'));
}

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );

    const { password, ...rest } = updatedUser._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};



export const deleteUser= async(req,res,next) => {
  console.log("inside deleteeee")
      if (req.user.id !== req.params.id)
    return next(errorHandler(401, 'You can only delete your own account!'));
        console.log("inside deleteeee")
      try{
          await User.findByIdAndDelete(req.params.id);
          res.clearCookie("access_token");
          res.status(200).json({message:"user deleted"});
      
        }catch(error){
          console.log(error.message)
        next(error)
      }
    }


export const getUserListing = async (req,res,next) => {
  
      if(req.user.id === req.params.id){
  try{
    const listings = await Listing.find({userRef:req.params.id})
    res.status(200).json(listings);
  }
    catch(error){
        next(error);
    }
      }else{
        return next(errorHandler(401,"You can only view your own listings"))
      }
      
}


export const getUser = async (req,res,next) => {
  try{
  const user = await User.findById(req.params.id);

  if(!user) return next(errorHandler(404,"User not found"));

  const {password:pass,...rest} = user._doc;
  res.status(200).json(rest);}
  catch(error){
    next(error)
  }

}