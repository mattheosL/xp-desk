import type { Task } from './task';

export interface BoardColumn {
  id: string;
  name: string;
  tasks: Task[];
}

export interface Board {
  id: string;
  name: string;
  columns: BoardColumn[];
}
