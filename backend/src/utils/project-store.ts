import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

export type Project = {
  id: string;
  title: string;
  description: string;
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataFilePath = path.join(__dirname, "../data/projects.json");

export async function readProjects(): Promise<Project[]> {
  const fileContent = await fs.readFile(dataFilePath, "utf-8");
  return JSON.parse(fileContent) as Project[];
}

export async function writeProjects(projects: Project[]): Promise<void> {
  await fs.writeFile(dataFilePath, JSON.stringify(projects, null, 2));
}