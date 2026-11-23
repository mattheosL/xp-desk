export type ProjectRole = 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER';

export interface Project {
  id: string;
  name: string;
  ownerId: string;
  createdAt: string;
  role?: ProjectRole;
  archivedAt?: string | null;
  boardCount?: number;
  memberCount?: number;
}

export interface ProjectBoard {
  id: string;
  name: string;
  colorHex: string;
  isArchived: boolean;
}

export interface ProjectMember {
  userId: string;
  username: string;
  email: string;
  role: ProjectRole;
  joinedAt: string;
}


export interface ProjectMember {
  id: string;
  username: string;
  role: ProjectRole;
}

/** Resumo de projeto usado no dashboard (lista vinda de /api/v1/projects). */
export interface ProjectSummary {
  id: string;
  name: string;
  description: string;
  role: ProjectRole;
  archived: boolean;
  /** ISO 8601 — última atualização/acesso do projeto. */
  updatedAt: string;
  /** ISO 8601 — preenchido quando o projeto está arquivado. */
  archivedAt?: string;
  color?: ProjectColor;
  members: ProjectMember[];
}

export type ProjectColor = 'blue' | 'green' | 'yellow' | 'gray';
