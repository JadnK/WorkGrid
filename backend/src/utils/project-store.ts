import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

export type TaskPriority = "low" | "medium" | "high";

export type ProjectItem = {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
};

export type ProjectCategory = {
  id: string;
  name: string;
  subtitle: string;
  color: string;
  items: ProjectItem[];
};

export type Project = {
  id: string;
  title: string;
  description: string;
  categories: ProjectCategory[];
};

const dataDir = path.join(process.cwd(), "data");
const filePath = path.join(dataDir, "projects.json");

async function ensureFile() {
  await fs.mkdir(dataDir, { recursive: true });

  try {
    await fs.access(filePath);
  } catch {
    await fs.writeFile(filePath, "[]", "utf-8");
  }
}

export async function readProjects() {
  await ensureFile();
  const data = await fs.readFile(filePath, "utf-8");
  return JSON.parse(data);
}

export async function writeProjects(projects: any[]) {
  await ensureFile();
  await fs.writeFile(filePath, JSON.stringify(projects, null, 2));
}