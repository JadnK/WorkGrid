import { Router } from "express";
import { getHealth } from "../controllers/healt.controller.js";

const healthRouter = Router();

healthRouter.get("/health", getHealth);

export default healthRouter;