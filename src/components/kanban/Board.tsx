import { Column } from './Column';
import type { Board } from '../../types/board';
import type { Task } from '../../types/task';

interface BoardProps {
  board: Board;
  onTaskClick?: (task: Task) => void;
}

export function Board({ board, onTaskClick }: BoardProps) {
  return (
    <div className="page-stack">
      {board.columns.map((column) => (
        <Column key={column.id} column={column} onTaskClick={onTaskClick} />
      ))}
    </div>
  );
}
