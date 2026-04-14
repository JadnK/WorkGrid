export type Project = {
  id: string;
  title: string;
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