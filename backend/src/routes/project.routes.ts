import { Router } from "express";
import {
  createProject,
  deleteProject,
  getProjects,
  updateProject
} from "../controllers/project.controller.js";

const projectRouter = Router();

projectRouter.get("/projects", getProjects);
projectRouter.post("/projects", createProject);
projectRouter.patch("/projects/:id", updateProject);
projectRouter.delete("/projects/:id", deleteProject);

export default projectRouter;