import type { Task } from '../../types/task';

interface TaskCardProps {
  task: Task;
  onClick?: (task: Task) => void;
}

export function TaskCard({ task, onClick }: TaskCardProps) {
  return (
    <button type="button" className="feature-card" onClick={() => onClick?.(task)}>
      <span className="feature-state">{task.status.toUpperCase()}</span>
      <h3>{task.title}</h3>
      <p>{task.description}</p>
    </button>
  );
}
