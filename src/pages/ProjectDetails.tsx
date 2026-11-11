import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Board } from '../components/kanban/Board';
import { TaskModal } from '../components/kanban/TaskModal';
import { useProjects } from '../hooks/useProjects';
import type { Task } from '../types/task';

export function ProjectDetails() {
  const { projectId } = useParams();
  const { projects } = useProjects();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const project = projects.find((item) => item.id === projectId);

  if (!project) {
    return (
      <div className="page-stack">
        <h1>Projeto não encontrado</h1>
      </div>
    );
  }

  return (
    <div className="page-stack">
      <div className="page-heading-row">
        <div>
          <div className="eyebrow">PROJETO</div>
          <h1>{project.name}</h1>
          <p className="page-description">{project.description}</p>
        </div>
      </div>
      <Board board={project.board} onTaskClick={setSelectedTask} />
      <TaskModal task={selectedTask} onClose={() => setSelectedTask(null)} />
    </div>
  );
}
