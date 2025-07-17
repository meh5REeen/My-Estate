import express from "express";
import {test, updateUser,deleteUser,getUserListing,getUser}  from "../controllers/userController.js";
import { verifyToken } from "../utils/VerifyUser.js";
const userRouter = express.Router();


userRouter.get("/",test)
userRouter.put('/:id/update',verifyToken, updateUser);
userRouter.delete('/:id/delete',verifyToken, deleteUser);
userRouter.get('/listings/:id',verifyToken,getUserListing)
userRouter.get('/:id',verifyToken,getUser)

export default userRouter;