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

export type List = {
  id: string;
  title: string;
  boardId: string;
  position: number;
};

export type Card = {
  id: string;
  title: string;
  description?: string;
  listId: string;
  position: number;
};