import { useMemo } from 'react';
import { listProjects } from '../services/projectService';

export function useProjects() {
  const projects = useMemo(() => listProjects(), []);
  return { projects };
}
