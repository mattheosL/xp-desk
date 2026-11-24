import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useProjects } from '../hooks/useProjects';
import { archiveProject, canEdit, createProject, restoreProject, updateProject } from '../services/projectService';
import type { Project } from '../types/project';
import '../styles/projects.css';

const icons = ['🌐', '🚚', '📅', '🛍️', '🎓', '📦'];

const dateLabel = (value?: string | null) => value ? new Date(value).toLocaleDateString('pt-BR') : '—';

export function Projects() {
  const { user } = useAuth();
  const { projects, archived, loading, error, reload } = useProjects();

  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('recent');
  const [editor, setEditor] = useState<{
    id?: string;
    name: string;
  } | null>(null);
  const [confirmation, setConfirmation] = useState<Project | null>(null);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState('');
  const [success, setSuccess] = useState('');

  const owned = projects.filter(p => p.ownerId === user?.id).length;
  const member = projects.length - owned;
  const percent = projects.length ? owned / projects.length * 100 : 0;
  const boards = projects.every(project => project.boardCount !== undefined)
    ? projects.reduce((total, project) => total + (project.boardCount ?? 0), 0)
    : '—';
  const visible = projects
    .filter(project => {
      const isOwner = project.ownerId === user?.id;
      const matchesRole = filter === 'all' || (filter === 'owner' ? isOwner : !isOwner);
      const matchesSearch = project.name.toLocaleLowerCase()
        .includes(search.trim().toLocaleLowerCase());

      return matchesRole && matchesSearch;
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
    }
    catch (e) {
      setActionError(e instanceof Error ? e.message : 'Não foi possível concluir a operação.');
    }
    finally {
      setBusy(false);
    }
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!editor || busy) {
      return;
    }

    const name = editor.name.trim();
    if (name.length < 3 || name.length > 100) {
      setActionError('Informe um nome de 3 a 100 caracteres.');
      return;
    }

    void mutate(
      () => editor.id ? updateProject(editor.id, name) : createProject(name),
      editor.id ? 'Projeto atualizado.' : 'Projeto criado com sucesso.'
    );
  }

  return (
    <div className="projects-page">

      <section className="projects-hero">
        <span className="projects-folder" aria-hidden="true">📁</span>
        <div>
          <h1>Meus Projetos</h1>
          <p>Gerencie seus projetos e organize suas tarefas.</p>
        </div>
        <button className="projects-primary" onClick={() => {
          setActionError('');
          setEditor({ name: '' });
        }} disabled={busy}>+ Novo Projeto</button>
      </section>

      {error && <div className="projects-error" role="alert">
        {error}
        <button onClick={() => void reload()}>Tentar novamente</button>
      </div>}

      {actionError && !editor && !confirmation && <div className="projects-error" role="alert">
        {actionError}
      </div>}

      {success && <div className="projects-success" role="status">
        {success}
      </div>}

      <div className="projects-toolbar">
        <div className="projects-filters">
          {[['all', `Todos (${projects.length})`], ['owner', `Proprietário (${owned})`], ['member', `Membro (${member})`]].map(([key, label]) => <button key={key} aria-pressed={filter === key} className={filter === key ? 'selected' : ''} onClick={() => setFilter(key)}>
            {label}
          </button>)}
        </div>
        <div className="projects-search">
          <input aria-label="Buscar projeto" placeholder="Buscar projeto..." value={search} onChange={e => setSearch(e.target.value)} />
          <select aria-label="Ordenar projetos" value={sort} onChange={e => setSort(e.target.value)}>
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

            {visible.map((p, i) => <article className="project-card" key={p.id}>
              <header>
                <h2>
                  {p.name}
                </h2>
                <span className={p.ownerId === user?.id ? 'project-role owner' : 'project-role'}>
                  {p.ownerId === user?.id ? 'Proprietário' : p.role === 'ADMIN' ? 'Admin' : 'Membro'}
                </span>
              </header>
              <div className="project-card-body">
                <p>Projeto criado em {dateLabel(p.createdAt)}.</p>
                <span className="project-symbol" aria-hidden="true">
                  {icons[i % icons.length]}
                </span>
                <small>
                  {p.boardCount ?? '—'} quadros • {p.memberCount ?? '—'} membros</small>
              </div>
              <footer>
                <div>
                  <button disabled={busy || !canEdit(p, user?.id)} onClick={() => {
                    setActionError('');
                    setEditor({ id: p.id, name: p.name });
                  }}>Editar</button>
                  <button disabled={busy || !canEdit(p, user?.id)} onClick={() => {
                    setActionError('');
                    setConfirmation(p);
                  }}>Arquivar</button>
                </div>
                <Link className="project-open" to={`/app/projetos/${p.id}`}>
                  <span>➜</span> Abrir Projeto</Link>
              </footer>
            </article>)}

            {!loading && !error && visible.length === 0 && <div className="projects-empty">
              {projects.length ? 'Nenhum projeto corresponde aos filtros.' : 'Nenhum projeto ativo. Crie seu primeiro projeto!'}
            </div>}
          </div>
          <section className="projects-archive">
            <h2>Projetos arquivados</h2>
            <p>Ficam guardados e podem ser restaurados por quem é proprietário.</p>
            {archived.map(p => <div className="archive-row" key={p.id}>
              <div>
                <strong>
                  {p.name}
                </strong>
                <small>Arquivado em {dateLabel(p.archivedAt)}
                </small>
              </div>
              <button disabled={busy || !canEdit(p, user?.id)} onClick={() => void mutate(() => restoreProject(p.id), 'Projeto restaurado.')}>Restaurar</button>
            </div>)}
            {!loading && !archived.length && <div className="archive-row">Nenhum projeto arquivado.</div>}
          </section>
        </div>

        <aside className="projects-summary">
          <h2>Resumo</h2>
          <div className="summary-body">
            <dl>
              <div>
                <dt>Total de Projetos:</dt>
                <dd>
                  {projects.length}
                </dd>
              </div>
              <div>
                <dt>Quadros Ativos:</dt>
                <dd>
                  {boards}
                </dd>
              </div>
              <div>
                <dt>Arquivados:</dt>
                <dd>
                  {archived.length}
                </dd>
              </div>
            </dl>
            <div className="projects-pie" role="img" aria-label={`${owned} projetos próprios e ${member} como membro`} style={{ background: projects.length ? `conic-gradient(#2c7bd5 0% ${percent}%, #4ca84b ${percent}% 100%)` : '#d7dce2' }} />
            <p>
              <i className="legend-owner" /> Proprietário em {owned}
            </p>
            <p>
              <i className="legend-member" /> Membro em {member}
            </p>
          </div>
        </aside>
      </div>

      <footer className="projects-status">
        <span>
          <i className={error ? 'status-off' : 'status-on'} />
          {loading ? 'Carregando' : error ? 'Falha na API' : 'API conectada'}
        </span>
        <span>Usuário: {user?.username}
        </span>
        <span>
          {projects.length} projetos</span>
        <span>Dados: API (reais)</span>
      </footer>

      {(editor || confirmation) && <div className="projects-overlay" onKeyDown={e => {
        if (e.key === 'Escape' && !busy) {
          setEditor(null);
          setConfirmation(null);
          setActionError('');
        }
      }}>
        <section className="projects-dialog" role="dialog" aria-modal="true" aria-labelledby="project-dialog-title">
          <h2 id="project-dialog-title">
            {editor ? (editor.id ? 'Editar projeto' : 'Novo projeto') : 'Arquivar projeto'}
          </h2>
          {actionError && <p className="projects-error" role="alert">
            {actionError}
          </p>}
          {editor ? <form onSubmit={submit}>
            <label htmlFor="project-name">Nome do projeto</label>
            <input id="project-name" autoFocus required minLength={3} maxLength={100} value={editor.name} onChange={e => setEditor({ ...editor, name: e.target.value })} />
            <div className="dialog-actions">
              <button type="button" disabled={busy} onClick={() => {
                setEditor(null);
                setActionError('');
              }}>Cancelar</button>
              <button className="projects-primary" disabled={busy}>
                {busy ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </form> : <>
            <p>Arquivar “{confirmation?.name}”? Você poderá restaurá-lo depois.</p>
            <div className="dialog-actions">
              <button autoFocus disabled={busy} onClick={() => {
                setConfirmation(null);
                setActionError('');
              }}>Cancelar</button>
              <button className="projects-primary" disabled={busy} onClick={() => confirmation && void mutate(() => archiveProject(confirmation.id), 'Projeto arquivado.')}>
                {busy ? 'Arquivando...' : 'Arquivar'}
              </button>
            </div>
          </>}
        </section>
      </div>}
    </div>
  );
}
