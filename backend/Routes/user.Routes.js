import express from "express";
import isAuth from "../Middleware/isAuth.js";
import { getCurrentUser } from "../Controllers/user.Controllers.js";

let userRouter = express.Router();

userRouter.get('/currentuser',isAuth,getCurrentUser)

export default userRouter;