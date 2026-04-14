import { Router } from "express";
import { getBoards } from "../controllers/board.controller.js";

const boardRouter = Router();

boardRouter.get("/boards", getBoards);

export default boardRouter;