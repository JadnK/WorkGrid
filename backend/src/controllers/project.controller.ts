import type { Request, Response } from "express";
import { readProjects, writeProjects } from "../utils/project-store.js";

function createProjectId() {
  return `project-${Date.now()}`;
}

export async function getProjects(_req: Request, res: Response) {
  try {
    const projects = await readProjects();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "Could not load projects" });
  }
}

export async function createProject(req: Request, res: Response) {
  try {
    const { title } = req.body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return res.status(400).json({ message: "Title is required" });
    }

    const projects = await readProjects();

    const newProject = {
      id: createProjectId(),
      title: title.trim()
    };

    const updatedProjects = [...projects, newProject];
    await writeProjects(updatedProjects);

    res.status(201).json(newProject);
  } catch (error) {
    res.status(500).json({ message: "Could not create project" });
  }
}

export async function updateProject(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { title } = req.body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return res.status(400).json({ message: "Title is required" });
    }

    const projects = await readProjects();

    const projectIndex = projects.findIndex((project) => project.id === id);

    if (projectIndex === -1) {
      return res.status(404).json({ message: "Project not found" });
    }

    projects[projectIndex] = {
      ...projects[projectIndex],
      title: title.trim()
    };

    await writeProjects(projects);

    res.json(projects[projectIndex]);
  } catch (error) {
    res.status(500).json({ message: "Could not update project" });
  }
}

export async function deleteProject(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const projects = await readProjects();

    const filteredProjects = projects.filter((project) => project.id !== id);

    if (filteredProjects.length === projects.length) {
      return res.status(404).json({ message: "Project not found" });
    }

    await writeProjects(filteredProjects);

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Could not delete project" });
  }
}