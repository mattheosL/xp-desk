import { TaskCard } from './TaskCard';
import type { BoardColumn } from '../../types/board';
import type { Task } from '../../types/task';

interface ColumnProps {
  column: BoardColumn;
  onTaskClick?: (task: Task) => void;
}

export function Column({ column, onTaskClick }: ColumnProps) {
  return (
    <section className="window">
      <div className="title-bar">
        <div className="title-bar-text">{column.name}</div>
      </div>
      <div className="window-body feature-grid">
        {column.tasks.map((task) => (
          <TaskCard key={task.id} task={task} onClick={onTaskClick} />
        ))}
      </div>
    </section>
  );
}
