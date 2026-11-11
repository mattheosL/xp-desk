interface BrandProps {
  compact?: boolean;
}

export function Brand({ compact = false }: BrandProps) {
  return (
    <div className={`brand ${compact ? 'brand--compact' : ''}`}>
      <div className="brand-mark" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>
      <div className="brand-copy">
        <strong>Xp Desk</strong>
        {!compact && <small>Gerenciador de Projetos</small>}
      </div>
    </div>
  );
}
