
import { useState } from 'react';
import { Link } from 'react-router-dom';

import {
  BoltIcon,
  FolderIcon,
  InfoIcon,
  PeopleIcon,
  UserIcon,
  WindowsLogo,
} from '../components/dashboard/Icons';

import { XpPanel } from '../components/dashboard/XpPanel';
import { useDashboard } from '../hooks/useDashboard';
import { API_BASE_URL, API_HOST_LABEL } from '../services/api';
import type { ProjectMember, ProjectRole } from '../types/project';
import { formatRelative } from '../utils/relativeTime';

import './Dashboard.css';

const TEAM_PREVIEW = 3;

const AVATAR_THEMES = [
  { bg: '#a9cdf5', shirt: '#2f63c4' },
  { bg: '#c9e8b8', shirt: '#7a4fc1' },
  { bg: '#f5c4a6', shirt: '#2f8a3c' },
  { bg: '#f3e2a0', shirt: '#c2492f' },
];

const ROLE_LABEL: Record<ProjectRole, string> = {
  OWNER: 'Proprietário',
  ADMIN: 'Administrador',
  MEMBER: 'Membro',
  VIEWER: 'Visualizador',
};

function RoleBadge({ role }: { role: ProjectRole }) {
  return (
    <span className={`role-badge role-badge--${role}`}>
      {ROLE_LABEL[role]}
    </span>
  );
}

export function Dashboard() {
  const {
    user,
    loading,
    source,
    error,
    restoringId,
    restore,
    active,
    archived,
    recent,
    ownedCount,
    memberCount,
    lastOpened,
  } = useDashboard();

  const [showAllMembers, setShowAllMembers] = useState(false);

  const team: ProjectMember[] = lastOpened?.members ?? [];
  const visibleTeam = showAllMembers
    ? team
    : team.slice(0, TEAM_PREVIEW);

  const isApi = source === 'api';

  return (
    <div className="page-stack dashboard" aria-busy={loading}>
      <section className="dash-hero">
        <WindowsLogo />
        <div>
          <div className="dash-hero__eyebrow">Área de Trabalho</div>
          <h1>Visão geral</h1>
          <p>Resumo dos seus projetos e atalhos rápidos.</p>
        </div>
      </section>

      <div className="dash-stats">
        <XpPanel
          title="Projetos Ativos"
          icon={<FolderIcon color="yellow" />}
        >
          <div className="stat">
            <strong>{loading ? '–' : active.length}</strong>
            <span>Em andamento</span>
          </div>
        </XpPanel>

        <XpPanel
          title="Arquivados"
          icon={<FolderIcon color="blue" />}
        >
          <div className="stat">
            <strong>{loading ? '–' : archived.length}</strong>
            <span>
              {archived.length > 0
                ? 'Restauração disponível'
                : 'Nenhum projeto arquivado'}
            </span>
          </div>
        </XpPanel>

        <XpPanel
          title="Proprietário em"
          icon={<PeopleIcon />}
        >
          <div className="stat">
            <strong>{loading ? '–' : ownedCount}</strong>
            <span>Outros {memberCount} como membro</span>
          </div>
        </XpPanel>
      </div>

      <div className="dash-grid dash-grid--recent">
        <XpPanel
          title="Projetos recentes"
          icon={<FolderIcon color="yellow" />}
          subtitle="Os últimos projetos que você acessou."
        >
          {loading ? (
            <p className="dash-empty">Carregando projetos…</p>
          ) : recent.length === 0 ? (
            <p className="dash-empty">
              Você ainda não tem projetos ativos.
            </p>
          ) : (
            <ul className="project-list">
              {recent.map((project) => (
                <li
                  key={project.id}
                  className="project-row"
                >
                  <FolderIcon color={project.color ?? 'yellow'} />

                  <div className="project-row__info">
                    <Link
                      to={`/app/projetos/${project.id}`}
                      className="project-row__name"
                    >
                      {project.name}
                    </Link>

                    <span>
                      Atualizado {formatRelative(project.updatedAt)}
                    </span>
                  </div>

                  <RoleBadge role={project.role} />

                  <Link
                    to={`/app/projetos/${project.id}`}
                    className="project-row__open"
                    aria-label={`Abrir ${project.name}`}
                  >
                    Abrir →
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </XpPanel>

        <XpPanel
          title="Ações rápidas"
          icon={<BoltIcon />}
          className="quick-actions"
        >
          <div className="quick-actions__list">
            <Link
              to="/app/projetos?novo=1"
              className="quick-action"
            >
              <FolderIcon color="yellow" />
              <span>+ Criar projeto</span>
            </Link>

            <a
              href="#arquivados"
              className="quick-action"
            >
              <FolderIcon color="yellow" search />
              <span>Ver arquivados</span>
            </a>

            <Link
              to="/app/perfil"
              className="quick-action"
            >
              <UserIcon />
              <span>Editar perfil</span>
            </Link>
          </div>
        </XpPanel>
      </div>

      <div className="dash-notice" role="note">
        <InfoIcon />
        <p>
          Os projetos vêm de <code>{API_BASE_URL}/projects</code> com
          o header <code>X-User-Id</code>. Enquanto a API não
          responde, os dados simulados ficam identificados na tela.
        </p>
      </div>

      {error && (
        <div className="dash-error" role="alert">
          {error}
        </div>
      )}

      <div className="dash-grid dash-grid--bottom">
        <XpPanel
          id="arquivados"
          title="Projetos arquivados"
          icon={<FolderIcon color="gray" />}
          subtitle="Ficam guardados e podem ser restaurados por quem é proprietário."
        >
          {!loading && archived.length === 0 ? (
            <p className="dash-empty">
              Nenhum projeto arquivado.
            </p>
          ) : (
            <ul className="project-list">
              {archived.map((project) => (
                <li
                  key={project.id}
                  className="project-row project-row--archived"
                >
                  <FolderIcon color="gray" />

                  <div className="project-row__info">
                    <span className="project-row__name">
                      {project.name}
                    </span>

                    <span>
                      Arquivado{' '}
                      {formatRelative(
                        project.archivedAt ?? project.updatedAt
                      )}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="restore-button"
                    onClick={() => restore(project.id)}
                    disabled={
                      project.role !== 'OWNER' ||
                      restoringId !== null
                    }
                    title={
                      project.role !== 'OWNER'
                        ? 'Somente o proprietário pode restaurar'
                        : undefined
                    }
                  >
                    {restoringId === project.id
                      ? 'Restaurando…'
                      : 'Restaurar'}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </XpPanel>

        <XpPanel
          title="Equipe"
          icon={<PeopleIcon />}
          subtitle={
            lastOpened
              ? `${lastOpened.name} · último projeto aberto`
              : 'Nenhum projeto aberto'
          }
          footer={
            team.length > 0 && (
              <>
                <span>
                  Mostrando {visibleTeam.length} de {team.length}{' '}
                  {team.length === 1 ? 'membro' : 'membros'}
                </span>

                {team.length > TEAM_PREVIEW && (
                  <button
                    type="button"
                    onClick={() =>
                      setShowAllMembers((value) => !value)
                    }
                  >
                    {showAllMembers ? 'Ver menos' : 'Ver mais'}
                  </button>
                )}
              </>
            )
          }
        >
          {team.length === 0 ? (
            <p className="dash-empty">
              {loading
                ? 'Carregando equipe…'
                : 'Sem membros para exibir.'}
            </p>
          ) : (
            <ul className="member-list">
              {visibleTeam.map((member, index) => {
                const theme =
                  AVATAR_THEMES[index % AVATAR_THEMES.length];

                const isMe = member.id === user?.id;

                return (
                  <li
                    key={member.id}
                    className="member-row"
                  >
                    <span
                      className="member-avatar"
                      style={{ background: theme.bg }}
                    >
                      <UserIcon
                        size={36}
                        shirt={theme.shirt}
                      />
                    </span>

                    <strong>
                      {member.username}
                      {isMe && ' (você)'}
                    </strong>

                    <RoleBadge role={member.role} />
                  </li>
                );
              })}
            </ul>
          )}
        </XpPanel>
      </div>

      <div className="status-bar" role="status">
        <span className="status-bar__cell">
          <i
            className={`status-dot ${
              isApi ? 'status-dot--ok' : 'status-dot--off'
            }`}
            aria-hidden="true"
          />

          {loading
            ? 'Conectando a '
            : isApi
              ? 'Conectado a '
              : 'Sem conexão com '}

          {API_HOST_LABEL}
        </span>

        <span className="status-bar__cell">
          Usuário: {user?.username}
        </span>

        <span className="status-bar__cell">
          {active.length}{' '}
          {active.length === 1 ? 'projeto' : 'projetos'}
        </span>

        <span className="status-bar__cell status-bar__cell--grow">
          Dados: {loading ? '…' : isApi ? 'API (reais)' : 'simulados'}
        </span>
      </div>
    </div>
  );
}
