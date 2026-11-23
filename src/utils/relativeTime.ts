const DAY_MS = 24 * 60 * 60 * 1000;

function plural(value: number, singular: string, pluralForm: string) {
  return `${value} ${value === 1 ? singular : pluralForm}`;
}

/** Converte uma data ISO em texto relativo: "hoje", "há 2 dias", "há 1 semana", "há 1 mês". */
export function formatRelative(iso: string, now: number = Date.now()): string {
  const time = Date.parse(iso);
  if (Number.isNaN(time)) return 'data desconhecida';

  const days = Math.max(0, Math.floor((now - time) / DAY_MS));
  if (days === 0) return 'hoje';
  if (days === 1) return 'ontem';
  if (days < 7) return `há ${plural(days, 'dia', 'dias')}`;
  if (days < 30) return `há ${plural(Math.floor(days / 7), 'semana', 'semanas')}`;
  if (days < 365) return `há ${plural(Math.floor(days / 30), 'mês', 'meses')}`;
  return `há ${plural(Math.floor(days / 365), 'ano', 'anos')}`;
}
