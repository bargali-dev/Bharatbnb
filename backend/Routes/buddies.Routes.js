import express from "express";
import { findBuddy, checkBuddy, confirmBuddy, acceptBuddyRequest, rejectBuddyRequest, sendBuddyRequest, getMyRequests } from "../Controllers/buddies.Controllers.js";
import isAuth from "../Middleware/isAuth.js";

const buddiesRouter = express.Router();

// 🔍 Find buddy (with real-time matching)
buddiesRouter.post("/find",isAuth, findBuddy);

// 🔁 Check buddy (fallback if socket fails)
buddiesRouter.post("/check", checkBuddy);

buddiesRouter.post("/send-request", isAuth, sendBuddyRequest);

buddiesRouter.post("/confirm", isAuth, confirmBuddy);


// ✅ ACCEPT
buddiesRouter.post("/accept", isAuth, acceptBuddyRequest);

// ❌ REJECT
buddiesRouter.post("/reject", isAuth, rejectBuddyRequest);

buddiesRouter.get("/requests", isAuth, getMyRequests);
export default buddiesRouter;
