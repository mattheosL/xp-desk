import { request, apiRequest } from './api';
import { readSession } from '../utils/storage';

import type {
  Project,
  ProjectBoard,
  ProjectColor,
  ProjectMember,
  ProjectRole,
  ProjectSummary,
} from '../types/project';

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


export function canEdit(project: Project, userId?: string) {
  return project.ownerId === userId || project.role === 'OWNER' || project.role === 'ADMIN';
}

/* ------------------------------------------------------------------ */
/* Dashboard: resumo de projetos (/api/v1/projects com X-User-Id)      */
/* ------------------------------------------------------------------ */


export type DataSource = 'api' | 'mock';

export interface ProjectSummaryResult {
  projects: ProjectSummary[];
  source: DataSource;
}

const DAY_MS = 24 * 60 * 60 * 1000;

function daysAgo(days: number): string {
  return new Date(Date.now() - days * DAY_MS).toISOString();
}

function createMockMember(
  id: string,
  username: string,
  role: ProjectRole
): ProjectMember {
  return {
    id,
    userId: id,
    username,
    email: '',
    joinedAt: new Date().toISOString(),
    role,
  };
}

function mockTeam(
  currentUserId: string,
  currentUsername: string
): ProjectMember[] {
  return [
    createMockMember(currentUserId, currentUsername, 'OWNER'),
    createMockMember('mock-ana', 'Ana Beatriz Lima', 'MEMBER'),
    createMockMember('mock-carlos', 'Carlos Eduardo Souza', 'MEMBER'),
    createMockMember('mock-julia', 'Júlia Martins', 'MEMBER'),
  ];
}

/** Dados simulados exibidos enquanto a API não responde. */
export function buildMockProjectSummaries(userId: string, username: string): ProjectSummary[] {
  const team = mockTeam(userId, username);
  const asMember = (owner: ProjectMember): ProjectMember[] => [
  owner,
  createMockMember(userId, username, 'MEMBER'),
];
  const ana = team[1];
  const carlos = team[2];

  return [
    { id: 'site-institucional', name: 'Site institucional', description: '', role: 'OWNER', archived: false, updatedAt: daysAgo(2), color: 'blue', members: team },
    { id: 'app-entregas', name: 'App de entregas', description: '', role: 'OWNER', archived: false, updatedAt: daysAgo(5), color: 'green', members: team.slice(0, 3) },
    { id: 'planejamento-semestre', name: 'Planejamento do semestre', description: '', role: 'MEMBER', archived: false, updatedAt: daysAgo(7), color: 'yellow', members: asMember({ ...ana, role: 'OWNER' }) },
    { id: 'blog-equipe', name: 'Blog da equipe', description: '', role: 'OWNER', archived: false, updatedAt: daysAgo(12), color: 'blue', members: team.slice(0, 2) },
    { id: 'pesquisa-usuarios', name: 'Pesquisa com usuários', description: '', role: 'OWNER', archived: false, updatedAt: daysAgo(16), color: 'green', members: team.slice(0, 2) },
    { id: 'eventos-2026', name: 'Eventos 2026', description: '', role: 'MEMBER', archived: false, updatedAt: daysAgo(20), color: 'yellow', members: asMember({ ...carlos, role: 'OWNER' }) },
    { id: 'campanha-matricula', name: 'Campanha de matrícula', description: '', role: 'OWNER', archived: true, updatedAt: daysAgo(21), archivedAt: daysAgo(21), color: 'gray', members: team.slice(0, 2) },
    { id: 'prototipo-aplicativo', name: 'Protótipo do aplicativo', description: '', role: 'OWNER', archived: true, updatedAt: daysAgo(32), archivedAt: daysAgo(32), color: 'gray', members: team.slice(0, 3) },
  ];
}

/* ---------- Normalização da resposta da API (tolerante ao formato) ---------- */

type RawRecord = Record<string, unknown>;

function isRecord(value: unknown): value is RawRecord {
  return typeof value === 'object' && value !== null;
}

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : typeof value === 'number' ? String(value) : fallback;
}

function unwrapList(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload;
  if (isRecord(payload)) {
    for (const key of ['data', 'content', 'items', 'projects']) {
      if (Array.isArray(payload[key])) return payload[key] as unknown[];
    }
  }
  throw new Error('Formato inesperado na lista de projetos.');
}

function normalizeRole(value: unknown): ProjectRole | undefined {
  const role = asString(value).trim().toUpperCase();

  if (
    role === 'OWNER' ||
    role === 'PROPRIETARIO' ||
    role === 'PROPRIETÁRIO'
  ) {
    return 'OWNER';
  }

  if (role === 'MEMBER' || role === 'MEMBRO') {
    return 'MEMBER';
  }

  if (role === 'ADMIN' || role === 'ADMINISTRATOR') {
    return 'ADMIN';
  }
  if (role === 'VIEWER' || role === 'VISUALIZADOR') {
    return 'VIEWER';
  }

  return undefined;
}

function normalizeMember(
  raw: unknown,
  ownerId: string
): ProjectMember | null {
  if (typeof raw === 'string') {
    return createMockMember(
      raw,
      raw,
      raw === ownerId ? 'OWNER' : 'MEMBER'
    );
  }

  if (!isRecord(raw)) return null;

  const user = isRecord(raw.user) ? raw.user : raw;

  const id = asString(raw.id ?? user.id ?? raw.userId);

  if (!id) return null;

  const userId = asString(raw.userId ?? user.id ?? id);

  const username = asString(
    user.username ?? user.name ?? user.email,
    id
  );

  const email = asString(user.email ?? raw.email);

  const joinedAt = asString(
    raw.joinedAt ?? raw.createdAt ?? raw.addedAt,
    daysAgo(0)
  );

  const role =
    normalizeRole(raw.role) ??
    (userId === ownerId || id === ownerId ? 'OWNER' : 'MEMBER');

  return {
    id,
    userId,
    username,
    email,
    joinedAt,
    role,
  };
}

const COLORS: ProjectColor[] = ['blue', 'green', 'yellow'];

function normalizeProject(raw: unknown, index: number, userId: string): ProjectSummary | null {
  if (!isRecord(raw)) return null;
  const id = asString(raw.id);
  if (!id) return null;

  const ownerId = asString(raw.ownerId ?? (isRecord(raw.owner) ? raw.owner.id : undefined));
  const status = asString(raw.status).toLowerCase();
  const archived = raw.archived === true || status === 'archived' || status === 'arquivado';
  const role =
  normalizeRole(raw.role) ??
  (ownerId && ownerId === userId ? 'OWNER' : 'MEMBER');
  const members = Array.isArray(raw.members)
    ? raw.members.map((member) => normalizeMember(member, ownerId)).filter((m): m is ProjectMember => m !== null)
    : [];

  return {
    id,
    name: asString(raw.name ?? raw.title, 'Projeto sem nome'),
    description: asString(raw.description),
    role,
    archived,
    updatedAt: asString(raw.updatedAt ?? raw.lastAccessedAt ?? raw.createdAt, new Date().toISOString()),
    archivedAt: archived ? asString(raw.archivedAt ?? raw.updatedAt) || undefined : undefined,
    color: archived ? 'gray' : COLORS[index % COLORS.length],
    members,
  };
}

/** Busca os projetos do usuário na API; usa dados simulados se ela não responder. */
export async function fetchProjectSummaries(
  userId: string,
  username: string,
  signal?: AbortSignal,
): Promise<ProjectSummaryResult> {
  try {
    const payload = await apiRequest<unknown>('/projects', { userId, signal });
    const projects = unwrapList(payload)
      .map((raw, index) => normalizeProject(raw, index, userId))
      .filter((project): project is ProjectSummary => project !== null);
    return { projects, source: 'api' };
  } catch {
    return { projects: buildMockProjectSummaries(userId, username), source: 'mock' };
  }
}

export function restoreProject(projectId: string): Promise<unknown>;

export function restoreProject(
  userId: string,
  projectId: string
): Promise<void>;

export async function restoreProject(
  first: string,
  second?: string
): Promise<unknown | void> {
  // Restauração pelo serviço original de projetos.
  if (second === undefined) {
    return projectRequest(`${base}/${first}/restore`, {
      method: 'PATCH',
    });
  }

  // Restauração utilizada pelo Dashboard.
  await apiRequest<unknown>(
    `/projects/${encodeURIComponent(second)}`,
    {
      method: 'PATCH',
      userId: first,
      body: { archived: false },
    }
  );
}
