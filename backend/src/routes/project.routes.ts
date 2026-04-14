import { Router } from "express";
import {
  createCategory,
  createItem,
  createProject,
  deleteCategory,
  deleteProject,
  getProjectById,
  getProjects,
  moveItem,
  updateProject
} from "../controllers/project.controller.js";

const projectRouter = Router();

projectRouter.get("/projects", getProjects);
projectRouter.get("/projects/:id", getProjectById);
projectRouter.post("/projects", createProject);
projectRouter.patch("/projects/:id", updateProject);
projectRouter.delete("/projects/:id", deleteProject);

projectRouter.post("/projects/:id/categories", createCategory);
projectRouter.delete("/projects/:id/categories/:categoryId", deleteCategory);

projectRouter.post("/projects/:id/categories/:categoryId/items", createItem);
projectRouter.patch("/projects/:id/items/:itemId/move", moveItem);

export default projectRouter;