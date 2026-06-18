import express from "express";
import { getMessages } from "../Controllers/message.Controllers.js";

const router = express.Router();

router.get("/", getMessages);

export default router;
