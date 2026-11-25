import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getProjectById, listBoards, listMembers } from '../services/projectService';
import type { Project, ProjectBoard, ProjectMember } from '../types/project';
import '../styles/projects.css';

export function ProjectDetails() {
  const { projectId } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [boards, setBoards] = useState<ProjectBoard[]>([]);
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    setProject(null);
    if (!projectId) {
      setError('Projeto inválido.');
      setLoading(false);
      return;
    }
    Promise.all([getProjectById(projectId), listBoards(projectId), listMembers(projectId)]).then(([p, b, m]) => {
      if (active) {
        setProject(p);
        setBoards(b);
        setMembers(m);
      }
    }).catch(e => {
      if (active)
        setError(e instanceof Error ? e.message : 'Erro ao carregar projeto.');
    }).finally(() => {
      if (active)
        setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [projectId]);
  return (
    <div className="projects-page">
      <Link to="/app/projetos">← Meus Projetos</Link>
      {loading && <p role="status">Carregando projeto...</p>}
      {error && <p className="projects-error" role="alert">
        {error}
      </p>}
      {project && <>
        <section className="projects-hero">
          <span className="projects-folder">📁</span>
          <div>
            <h1>
              {project.name}
            </h1>
            <p>
              {project.archivedAt ? 'Projeto arquivado' : 'Projeto ativo'}
            </p>
          </div>
        </section>
        <section className="projects-archive">
          <h2>Quadros ({boards.length})</h2>
          {boards.map(b => <div className="archive-row" key={b.id}>
            <strong>
              {b.name}
            </strong>
            <span>
              {b.isArchived ? 'Arquivado' : 'Ativo'}
            </span>
          </div>)}
          {!boards.length && <div className="archive-row">Nenhum quadro cadastrado.</div>}
        </section>
        <section className="projects-archive">
          <h2>Membros ({members.length})</h2>
          {members.map(m => <div className="archive-row" key={m.userId}>
            <div>
              <strong>
                {m.username}
              </strong>
              <small>
                {m.email}
              </small>
            </div>
            <span>
              {({ OWNER: 'Proprietário', ADMIN: 'Administrador', MEMBER: 'Membro', VIEWER: 'Visitante' })[m.role]}
            </span>
          </div>)}
        </section>
      </>}
    </div>
  );
}
