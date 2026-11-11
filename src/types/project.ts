import type { Board } from './board';

export interface Project {
  id: string;
  name: string;
  description: string;
  members: string[];
  board: Board;
}
