import express from "express";
import { findBuddy, checkBuddy, confirmBuddy, acceptBuddyRequest, rejectBuddyRequest, sendBuddyRequest, getMyRequests } from "../Controllers/buddies.Controllers.js";
import isAuth from "../Middleware/isAuth.js";

const buddiesRouter = express.Router();

buddiesRouter.post("/find",isAuth, findBuddy)
buddiesRouter.post("/check", checkBuddy);
buddiesRouter.post("/send-request", isAuth, sendBuddyRequest);
buddiesRouter.post("/confirm", isAuth, confirmBuddy);
buddiesRouter.post("/accept", isAuth, acceptBuddyRequest)
buddiesRouter.post("/reject", isAuth, rejectBuddyRequest);
buddiesRouter.get("/requests", isAuth, getMyRequests);
export default buddiesRouter;
