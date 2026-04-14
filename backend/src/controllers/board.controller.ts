import type { Request, Response } from "express";
import { boards } from "../data/boards.js";

export function getBoards(_req: Request, res: Response) {
  res.json(boards);
}