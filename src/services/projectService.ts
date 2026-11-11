import type { Project } from '../types/project';

const mockProjects: Project[] = [
  {
    id: 'projeto-demo',
    name: 'Projeto Demonstrativo',
    description: 'Estrutura inicial do Xp Desk.',
    members: ['visitante@kanban.local'],
    board: {
      id: 'board-demo',
      name: 'Kanban Sprint 1',
      columns: [
        {
          id: 'todo',
          name: 'A Fazer',
          tasks: [
            {
              id: 'task-1',
              title: 'Definir estrutura inicial',
              description: 'Organizar as pastas base do frontend.',
              status: 'todo',
            },
          ],
        },
        {
          id: 'in-progress',
          name: 'Em Andamento',
          tasks: [],
        },
        {
          id: 'done',
          name: 'Concluído',
          tasks: [],
        },
      ],
    },
  },
];

export function listProjects(): Project[] {
  return mockProjects;
}

export function getProjectById(projectId: string): Project | undefined {
  return mockProjects.find((project) => project.id === projectId);
}
