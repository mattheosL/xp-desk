import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useProjects } from '../hooks/useProjects';

import {
  archiveProject,
  canEdit,
  createProject,
  restoreProject,
  updateProject
} from '../services/projectService';

import type { Project } from '../types/project';
import '../styles/projects.css';

const icons = ['🌐', '🚚', '📅', '🛍️', '🎓', '📦'];

function dateLabel(value?: string | null) {
  return value ? new Date(value).toLocaleDateString('pt-BR') : '—';
}

export function Projects() {
  const { user } = useAuth();
  const { projects, archived, loading, error, reload } = useProjects();

  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('recent');

  const [editor, setEditor] = useState<{ id?: string; name: string } | null>(null);
  const [confirmation, setConfirmation] = useState<Project | null>(null);

  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState('');
  const [success, setSuccess] = useState('');

  const owned = projects.filter(project => project.ownerId === user?.id).length;
  const member = projects.length - owned;
  const percent = projects.length ? (owned / projects.length) * 100 : 0;

  const boards = projects.every(project => project.boardCount !== undefined)
    ? projects.reduce((total, project) => total + (project.boardCount ?? 0), 0)
    : '—';

  const visible = projects
    .filter(project => {
      const isOwner = project.ownerId === user?.id;

      const matchesFilter =
        filter === 'all' ||
        (filter === 'owner' && isOwner) ||
        (filter === 'member' && !isOwner);

      const matchesSearch = project.name
        .toLocaleLowerCase()
        .includes(search.trim().toLocaleLowerCase());

      return matchesFilter && matchesSearch;
    })
    .sort((first, second) => {
      if (sort === 'name') {
        return first.name.localeCompare(second.name, 'pt-BR');
      }

      if (sort === 'old') {
        return first.createdAt.localeCompare(second.createdAt);
      }

      return second.createdAt.localeCompare(first.createdAt);
    });

  const filters = [
    { value: 'all', label: `Todos (${projects.length})` },
    { value: 'owner', label: `Proprietário (${owned})` },
    { value: 'member', label: `Membro (${member})` }
  ];

  async function mutate(action: () => Promise<unknown>, message: string) {
    setBusy(true);
    setActionError('');
    setSuccess('');

    try {
      await action();

      setEditor(null);
      setConfirmation(null);
      setSuccess(message);

      await reload();
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : 'Não foi possível concluir a operação.'
      );
    } finally {
      setBusy(false);
    }
  }

  function submit(event: FormEvent) {
    event.preventDefault();

    if (!editor || busy) return;

    const name = editor.name.trim();
    const projectId = editor.id;

    if (name.length < 3 || name.length > 100) {
      setActionError('Informe um nome de 3 a 100 caracteres.');
      return;
    }

    if (projectId) {
      void mutate(() => updateProject(projectId, name), 'Projeto atualizado.');
    } else {
      void mutate(() => createProject(name), 'Projeto criado com sucesso.');
    }
  }

  function openCreateDialog() {
    setActionError('');
    setEditor({ name: '' });
  }

  function openEditDialog(project: Project) {
    setActionError('');
    setEditor({ id: project.id, name: project.name });
  }

  function openArchiveDialog(project: Project) {
    setActionError('');
    setConfirmation(project);
  }

  function closeDialog() {
    setEditor(null);
    setConfirmation(null);
    setActionError('');
  }

  function handleArchive() {
    if (!confirmation) return;

    const projectId = confirmation.id;

    void mutate(() => archiveProject(projectId), 'Projeto arquivado.');
  }

  function handleRestore(project: Project) {
    void mutate(() => restoreProject(project.id), 'Projeto restaurado.');
  }

  function getProjectRole(project: Project) {
    if (project.ownerId === user?.id) return 'Proprietário';
    if (project.role === 'ADMIN') return 'Admin';

    return 'Membro';
  }

  const chartBackground = projects.length
    ? `conic-gradient(#2c7bd5 0% ${percent}%, #4ca84b ${percent}% 100%)`
    : '#d7dce2';

  const connectionStatus = loading
    ? 'Carregando'
    : error ? 'Falha na API' : 'API conectada';

  const dialogTitle = editor
    ? editor.id ? 'Editar projeto' : 'Novo projeto'
    : 'Arquivar projeto';

  return (
    <div className="projects-page">
      <section className="projects-hero">
        <span className="projects-folder" aria-hidden="true">📁</span>

        <div>
          <h1>Meus Projetos</h1>
          <p>Gerencie seus projetos e organize suas tarefas.</p>
        </div>

        <button className="projects-primary" onClick={openCreateDialog} disabled={busy}>+ Novo Projeto</button>
      </section>

      {error && (
        <div className="projects-error" role="alert">
          {error}
          <button onClick={() => void reload()}>Tentar novamente</button>
        </div>
      )}

      {actionError && !editor && !confirmation && (
        <div className="projects-error" role="alert">{actionError}</div>
      )}

      {success && (
        <div className="projects-success" role="status">{success}</div>
      )}

      <div className="projects-toolbar">
        <div className="projects-filters">
          {filters.map(item => (
            <button
              key={item.value}
              aria-pressed={filter === item.value}
              className={filter === item.value ? 'selected' : ''}
              onClick={() => setFilter(item.value)}
            >{item.label}</button>
          ))}
        </div>

        <div className="projects-search">
          <input
            aria-label="Buscar projeto"
            placeholder="Buscar projeto..."
            value={search}
            onChange={event => setSearch(event.target.value)}
          />

          <select aria-label="Ordenar projetos" value={sort} onChange={event => setSort(event.target.value)}>
            <option value="recent">Mais recentes</option>
            <option value="old">Mais antigos</option>
            <option value="name">Nome A–Z</option>
          </select>
        </div>
      </div>

      {loading && <p role="status">Carregando projetos...</p>}

      <div className="projects-columns">
        <div className="projects-content">
          <div className="projects-grid">
            {visible.map((project, index) => {
              const isOwner = project.ownerId === user?.id;
              const canManage = canEdit(project, user?.id);

              return (
                <article className="project-card" key={project.id}>
                  <header>
                    <h2>{project.name}</h2>
                    <span className={isOwner ? 'project-role owner' : 'project-role'}>{getProjectRole(project)}</span>
                  </header>

                  <div className="project-card-body">
                    <p>Projeto criado em {dateLabel(project.createdAt)}.</p>
                    <span className="project-symbol" aria-hidden="true">{icons[index % icons.length]}</span>
                    <small>{project.boardCount ?? '—'} quadros • {project.memberCount ?? '—'} membros</small>
                  </div>

                  <footer>
                    <div>
                      <button disabled={busy || !canManage} onClick={() => openEditDialog(project)}>Editar</button>
                      {' '}
                      <button disabled={busy || !canManage} onClick={() => openArchiveDialog(project)}>Arquivar</button>
                    </div>

                    <Link className="project-open" to={`/app/projetos/${project.id}`}>
                      <span>➜</span> Abrir Projeto
                    </Link>
                  </footer>
                </article>
              );
            })}

            {!loading && !error && visible.length === 0 && (
              <div className="projects-empty">
                {projects.length
                  ? 'Nenhum projeto corresponde aos filtros.'
                  : 'Nenhum projeto ativo. Crie seu primeiro projeto!'}
              </div>
            )}
          </div>

          <section className="projects-archive">
            <h2>Projetos arquivados</h2>
            <p>Ficam guardados e podem ser restaurados por quem é proprietário.</p>

            {archived.map(project => (
              <div className="archive-row" key={project.id}>
                <div>
                  <strong>{project.name}</strong>
                  <small>Arquivado em {dateLabel(project.archivedAt)}</small>
                </div>

                <button disabled={busy || !canEdit(project, user?.id)} onClick={() => handleRestore(project)}>Restaurar</button>
              </div>
            ))}

            {!loading && archived.length === 0 && (
              <div className="archive-row">Nenhum projeto arquivado.</div>
            )}
          </section>
        </div>

        <aside className="projects-summary">
          <h2>Resumo</h2>

          <div className="summary-body">
            <dl>
              <div>
                <dt>Total de Projetos:</dt>
                <dd>{projects.length}</dd>
              </div>

              <div>
                <dt>Quadros Ativos:</dt>
                <dd>{boards}</dd>
              </div>

              <div>
                <dt>Arquivados:</dt>
                <dd>{archived.length}</dd>
              </div>
            </dl>

            <div
              className="projects-pie"
              role="img"
              aria-label={`${owned} projetos próprios e ${member} como membro`}
              style={{ background: chartBackground }}
            />

            <p><i className="legend-owner" /> Proprietário em {owned}</p>
            <p><i className="legend-member" /> Membro em {member}</p>
          </div>
        </aside>
      </div>

      <footer className="projects-status">
        <span>
          <i className={error ? 'status-off' : 'status-on'} />
          {connectionStatus}
        </span>

        <span>Usuário: {user?.username}</span>
        <span>{projects.length} projetos</span>
        <span>Dados: API (reais)</span>
      </footer>

      {(editor || confirmation) && (
        <div
          className="projects-overlay"
          onKeyDown={event => {
            if (event.key === 'Escape' && !busy) {
              closeDialog();
            }
          }}
        >
          <section className="projects-dialog" role="dialog" aria-modal="true" aria-labelledby="project-dialog-title">
            <h2 id="project-dialog-title">{dialogTitle}</h2>

            {actionError && <p className="projects-error" role="alert">{actionError}</p>}

            {editor ? (
              <form onSubmit={submit}>
                <label htmlFor="project-name">Nome do projeto</label>

                <input
                  id="project-name"
                  autoFocus
                  required
                  minLength={3}
                  maxLength={100}
                  value={editor.name}
                  onChange={event => setEditor({ ...editor, name: event.target.value })}
                />

                <div className="dialog-actions">
                  <button type="button" disabled={busy} onClick={closeDialog}>Cancelar</button>
                  <button type="submit" className="projects-primary" disabled={busy}>{busy ? 'Salvando...' : 'Salvar'}</button>
                </div>
              </form>
            ) : (
              <>
                <p>Arquivar “{confirmation?.name}”? Você poderá restaurá-lo depois.</p>

                <div className="dialog-actions">
                  <button autoFocus disabled={busy} onClick={closeDialog}>Cancelar</button>
                  <button className="projects-primary" disabled={busy} onClick={handleArchive}>{busy ? 'Arquivando...' : 'Arquivar'}</button>
                </div>
              </>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
