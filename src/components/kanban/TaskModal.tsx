import { Modal } from '../ui/Modal';
import type { Task } from '../../types/task';

interface TaskModalProps {
  task: Task | null;
  onClose: () => void;
}

export function TaskModal({ task, onClose }: TaskModalProps) {
  return (
    <Modal isOpen={Boolean(task)} onClose={onClose} title={task?.title ?? 'Tarefa'}>
      <p>{task?.description}</p>
    </Modal>
  );
}
