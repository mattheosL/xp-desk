import { useCallback, useEffect, useRef, useState } from 'react';
import { listProjects, listArchivedProjects, getProjectById, listBoards, listMembers } from '../services/projectService';
import type { Project } from '../types/project';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [archived, setArchived] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const generation = useRef(0);

  const reload = useCallback(async () => {
    const current = ++generation.current;
    setLoading(true);
    setError('');

    try {
      const [active, inactive] = await Promise.all([listProjects(), listArchivedProjects()]);

      const enriched = await Promise.all(active.map(async (project) => {
        const [detail, boards, members] = await Promise.allSettled([
          getProjectById(project.id),
          listBoards(project.id),
          listMembers(project.id)
        ]);
        return {
          ...project,
          ...(detail.status === 'fulfilled' ? detail.value : {}),
          boardCount: boards.status === 'fulfilled'
            ? boards.value.filter(board => !board.isArchived).length
            : undefined,
          memberCount: members.status === 'fulfilled'
            ? members.value.length
            : undefined
        };
      }));

      if (current === generation.current) {
        setProjects(enriched);
        setArchived(inactive);
      }
    }
    catch (e) {
      if (current === generation.current)
        setError(e instanceof Error ? e.message : 'Erro ao carregar projetos.');
    }
    finally {
      if (current === generation.current)
        setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
    return () => {
      generation.current++;
    };
  }, [reload]);

  return { projects, archived, loading, error, reload };
}
