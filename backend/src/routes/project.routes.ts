import { Router } from "express";
import {
  createProject,
  deleteProject,
  getProjectById,
  getProjects,
  updateProject
} from "../controllers/project.controller.js";

const projectRouter = Router();

projectRouter.get("/projects", getProjects);
projectRouter.get("/projects/:id", getProjectById);
projectRouter.post("/projects", createProject);
projectRouter.patch("/projects/:id", updateProject);
projectRouter.delete("/projects/:id", deleteProject);

export default projectRouter;