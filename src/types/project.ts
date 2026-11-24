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
