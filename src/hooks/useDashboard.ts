import { useCallback, useEffect, useMemo, useState } from 'react';
import { fetchProjectSummaries, restoreProject, type DataSource } from '../services/projectService';
import type { ProjectSummary } from '../types/project';
import { useAuth } from './useAuth';

const RECENT_LIMIT = 3;

export function useDashboard() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [source, setSource] = useState<DataSource>('mock');
  const [loading, setLoading] = useState(true);
  const [restoringId, setRestoringId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const controller = new AbortController();
    setLoading(true);
    fetchProjectSummaries(user.id, user.username, controller.signal).then((result) => {
      if (controller.signal.aborted) return;
      setProjects(result.projects);
      setSource(result.source);
      setLoading(false);
    });
    return () => controller.abort();
  }, [user]);

  const derived = useMemo(() => {
    const byRecent = (a: ProjectSummary, b: ProjectSummary) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt);
    const active = projects.filter((project) => !project.archived).sort(byRecent);
    const archived = projects
      .filter((project) => project.archived)
      .sort((a, b) => Date.parse(b.archivedAt ?? b.updatedAt) - Date.parse(a.archivedAt ?? a.updatedAt));
    const ownedCount = active.filter((project) => project.role === 'OWNER').length;

    return {
      active,
      archived,
      recent: active.slice(0, RECENT_LIMIT),
      ownedCount,
      memberCount: active.length - ownedCount,
      lastOpened: active[0] ?? null,
    };
  }, [projects]);

  const restore = useCallback(
    async (projectId: string) => {
      if (!user) return;
      setError(null);
      setRestoringId(projectId);
      try {
        // Dados simulados são restaurados apenas na tela.
        if (source === 'api') await restoreProject(user.id, projectId);
        setProjects((current) =>
          current.map((project) =>
            project.id === projectId
              ? { ...project, archived: false, archivedAt: undefined, color: 'blue', updatedAt: new Date().toISOString() }
              : project,
          ),
        );
      } catch {
        setError('Não foi possível restaurar o projeto. Tente novamente.');
      } finally {
        setRestoringId(null);
      }
    },
    [source, user],
  );

  return { user, loading, source, error, restoringId, restore, ...derived };
}
