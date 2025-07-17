import express from "express";
import { google, signin,signout, signup } from "../controllers/authController.js";

export const authRouter = express.Router();

authRouter.post("/signup",signup)
authRouter.post("/signin",signin)
authRouter.post("/google",google)
authRouter.get("/signout",signout)