import { request } from './api';
import { readSession } from '../utils/storage';
import type { Project, ProjectBoard, ProjectMember } from '../types/project';

function projectRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  const user = readSession();
  if (user)
    headers.set('X-User-Id', user.id);
  return request<T>(path, { ...options, headers });
}

const base = '/api/v1/projects';

async function allPages<T>(path: string): Promise<T[]> {
  const result: T[] = [];
  for (let page = 0; ; page++) {
    const items = await projectRequest<T[]>(`${path}?page=${page}&size=100`);
    result.push(...items);
    if (items.length < 100)
      return result;
  }
}

export function listProjects() {
  return allPages<Project>(base);
}

export async function getProjectById(id: string): Promise<Project> {
  const data = await projectRequest<Omit<Project, 'id'> & {
    projectId: string;
  }>(`${base}/${id}`);
  return { ...data, id: data.projectId };
}

export async function listArchivedProjects(): Promise<Project[]> {
  const items = await allPages<{
    id: string;
    name: string;
    archivedAt: string;
  }>(`${base}/archived`);
  return Promise.all(items.map(async (item) => ({ ...await getProjectById(item.id), ...item })));
}

export async function listBoards(id: string) {
  const data = await projectRequest<{
    boards: ProjectBoard[];
  }>(`/api/v1/boards/project/${id}`);
  return data.boards;
}

export function listMembers(id: string) {
  return allPages<ProjectMember>(`${base}/${id}/members`);
}

export function createProject(name: string) {
  return projectRequest<{
    id: string;
  }>(base, { method: 'POST', body: JSON.stringify({ name }) });
}

export function updateProject(id: string, name: string) {
  return projectRequest(`${base}/${id}`, { method: 'PUT', body: JSON.stringify({ name }) });
}

export function archiveProject(id: string) {
  return projectRequest(`${base}/${id}/archive`, { method: 'PATCH' });
}

export function restoreProject(id: string) {
  return projectRequest(`${base}/${id}/restore`, { method: 'PATCH' });
}

export function canEdit(project: Project, userId?: string) {
  return project.ownerId === userId || project.role === 'OWNER' || project.role === 'ADMIN';
}
