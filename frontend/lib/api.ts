import { Project, ProjectCategory, ProjectItem, TaskPriority } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://jadenk.de:4000";

export async function getProjects(): Promise<Project[]> {
  const response = await fetch(`${API_BASE_URL}/projects`, {
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error("Failed to fetch projects");
  }

  return response.json();
}

export async function getProjectById(id: string): Promise<Project> {
  const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error("Failed to fetch project");
  }

  return response.json();
}

export async function createProject(
  title: string,
  description: string
): Promise<Project> {
  const response = await fetch(`${API_BASE_URL}/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ title, description })
  });

  if (!response.ok) {
    throw new Error("Failed to create project");
  }

  return response.json();
}

export async function updateProject(
  id: string,
  title: string,
  description: string
): Promise<Project> {
  const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ title, description })
  });

  if (!response.ok) {
    throw new Error("Failed to update project");
  }

  return response.json();
}

export async function deleteProject(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
    method: "DELETE"
  });

  if (!response.ok) {
    throw new Error("Failed to delete project");
  }
}

export async function createCategory(
  projectId: string,
  payload: {
    name: string;
    subtitle: string;
    color: string;
  }
): Promise<ProjectCategory> {
  const response = await fetch(`${API_BASE_URL}/projects/${projectId}/categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error("Failed to create category");
  }

  return response.json();
}

export async function deleteCategory(
  projectId: string,
  categoryId: string
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/projects/${projectId}/categories/${categoryId}`,
    {
      method: "DELETE"
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete category");
  }
}

export async function createItem(
  projectId: string,
  categoryId: string,
  payload: {
    title: string;
    description: string;
    priority: TaskPriority;
  }
): Promise<ProjectItem> {
  const response = await fetch(
    `${API_BASE_URL}/projects/${projectId}/categories/${categoryId}/items`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create item");
  }

  return response.json();
}

export async function moveItem(
  projectId: string,
  itemId: string,
  payload: {
    sourceCategoryId: string;
    targetCategoryId: string;
    targetIndex: number;
  }
): Promise<Project> {
  const response = await fetch(`${API_BASE_URL}/projects/${projectId}/items/${itemId}/move`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error("Failed to move item");
  }

  return response.json();
}