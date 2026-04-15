import type { Request, Response } from "express";
import {
  readProjects,
  writeProjects,
  type Project,
  type ProjectCategory,
  type ProjectItem,
  type TaskPriority
} from "../utils/project-store.js";

function createProjectId() {
  return `project-${Date.now()}`;
}

function createCategoryId() {
  return `category-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

function createItemId() {
  return `item-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

function createDefaultCategories(): ProjectCategory[] {
  return [
    {
      id: createCategoryId(),
      name: "Idea",
      subtitle: "Open thoughts",
      color: "#64748b",
      items: []
    },
    {
      id: createCategoryId(),
      name: "Progress",
      subtitle: "Active work",
      color: "#2563eb",
      items: []
    },
    {
      id: createCategoryId(),
      name: "Finish",
      subtitle: "Done",
      color: "#16a34a",
      items: []
    }
  ];
}

function normalizePriority(value: unknown): TaskPriority {
  if (value === "low" || value === "medium" || value === "high") {
    return value;
  }

  return "medium";
}

export async function getProjects(_req: Request, res: Response) {
  try {
    const projects = await readProjects();
    res.json(projects);
  } catch (error) {
    console.error("getProjects failed:", error);
    res.status(500).json({ message: "Could not load projects" });
  }
}

export async function getProjectById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const projects = await readProjects();

    const project = projects.find((entry: Project) => entry.id === id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);
  } catch (error) {
    console.error("getProjectById failed:", error);
    res.status(500).json({ message: "Could not load project" });
  }
}

export async function createProject(req: Request, res: Response) {
  try {
    const { title, description } = req.body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return res.status(400).json({ message: "Title is required" });
    }

    const projects = await readProjects();

    const newProject: Project = {
      id: createProjectId(),
      title: title.trim(),
      description: typeof description === "string" ? description.trim() : "",
      categories: createDefaultCategories()
    };

    const updatedProjects: Project[] = [newProject, ...projects];
    await writeProjects(updatedProjects);

    res.status(201).json(newProject);
  } catch (error) {
    console.error("createProject failed:", error);
    res.status(500).json({ message: "Could not create project" });
  }
}

export async function updateProject(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return res.status(400).json({ message: "Title is required" });
    }

    const projects = await readProjects();
    const projectIndex = projects.findIndex((project: Project) => project.id === id);

    if (projectIndex === -1) {
      return res.status(404).json({ message: "Project not found" });
    }

    projects[projectIndex] = {
      ...projects[projectIndex],
      title: title.trim(),
      description: typeof description === "string" ? description.trim() : ""
    };

    await writeProjects(projects);

    res.json(projects[projectIndex]);
  } catch (error) {
    console.error("updateProject failed:", error);
    res.status(500).json({ message: "Could not update project" });
  }
}

export async function deleteProject(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const projects = await readProjects();

    const filteredProjects = projects.filter(
      (project: Project) => project.id !== id
    );

    if (filteredProjects.length === projects.length) {
      return res.status(404).json({ message: "Project not found" });
    }

    await writeProjects(filteredProjects);

    res.status(204).send();
  } catch (error) {
    console.error("deleteProject failed:", error);
    res.status(500).json({ message: "Could not delete project" });
  }
}

export async function createCategory(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { name, subtitle, color } = req.body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const projects = await readProjects();
    const projectIndex = projects.findIndex((project: Project) => project.id === id);

    if (projectIndex === -1) {
      return res.status(404).json({ message: "Project not found" });
    }

    const newCategory: ProjectCategory = {
      id: createCategoryId(),
      name: name.trim(),
      subtitle: typeof subtitle === "string" ? subtitle.trim() : "",
      color:
        typeof color === "string" && color.trim() ? color.trim() : "#64748b",
      items: []
    };

    projects[projectIndex].categories.push(newCategory);
    await writeProjects(projects);

    res.status(201).json(newCategory);
  } catch (error) {
    console.error("createCategory failed:", error);
    res.status(500).json({ message: "Could not create category" });
  }
}

export async function deleteCategory(req: Request, res: Response) {
  try {
    const { id, categoryId } = req.params;

    const projects = await readProjects();
    const projectIndex = projects.findIndex((project: Project) => project.id === id);

    if (projectIndex === -1) {
      return res.status(404).json({ message: "Project not found" });
    }

    const nextCategories = projects[projectIndex].categories.filter(
      (category: ProjectCategory) => category.id !== categoryId
    );

    if (nextCategories.length === projects[projectIndex].categories.length) {
      return res.status(404).json({ message: "Category not found" });
    }

    projects[projectIndex].categories = nextCategories;
    await writeProjects(projects);

    res.status(204).send();
  } catch (error) {
    console.error("deleteCategory failed:", error);
    res.status(500).json({ message: "Could not delete category" });
  }
}

export async function createItem(req: Request, res: Response) {
  try {
    const { id, categoryId } = req.params;
    const { title, description, priority } = req.body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return res.status(400).json({ message: "Item title is required" });
    }

    const projects = await readProjects();
    const projectIndex = projects.findIndex((project: Project) => project.id === id);

    if (projectIndex === -1) {
      return res.status(404).json({ message: "Project not found" });
    }

    const categoryIndex = projects[projectIndex].categories.findIndex(
      (category: ProjectCategory) => category.id === categoryId
    );

    if (categoryIndex === -1) {
      return res.status(404).json({ message: "Category not found" });
    }

    const newItem: ProjectItem = {
      id: createItemId(),
      title: title.trim(),
      description: typeof description === "string" ? description.trim() : "",
      priority: normalizePriority(priority)
    };

    projects[projectIndex].categories[categoryIndex].items.push(newItem);
    await writeProjects(projects);

    res.status(201).json(newItem);
  } catch (error) {
    console.error("createItem failed:", error);
    res.status(500).json({ message: "Could not create item" });
  }
}

export async function moveItem(req: Request, res: Response) {
  try {
    const { id, itemId } = req.params;
    const { sourceCategoryId, targetCategoryId, targetIndex } = req.body;

    const projects = await readProjects();
    const projectIndex = projects.findIndex((project: Project) => project.id === id);

    if (projectIndex === -1) {
      return res.status(404).json({ message: "Project not found" });
    }

    const project = projects[projectIndex];

    const sourceCategory = project.categories.find(
      (category: ProjectCategory) => category.id === sourceCategoryId
    );

    const targetCategory = project.categories.find(
      (category: ProjectCategory) => category.id === targetCategoryId
    );

    if (!sourceCategory || !targetCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    const itemIndex = sourceCategory.items.findIndex(
      (item: ProjectItem) => item.id === itemId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found" });
    }

    const [movedItem] = sourceCategory.items.splice(itemIndex, 1);

    let safeTargetIndex =
      typeof targetIndex === "number" && targetIndex >= 0
        ? targetIndex
        : targetCategory.items.length;

    if (sourceCategoryId === targetCategoryId && itemIndex < safeTargetIndex) {
      safeTargetIndex -= 1;
    }

    targetCategory.items.splice(safeTargetIndex, 0, movedItem);

    await writeProjects(projects);

    res.json(project);
  } catch (error) {
    console.error("moveItem failed:", error);
    res.status(500).json({ message: "Could not move item" });
  }
}