interface EmptyStateProps { icon?: string; title: string; message?: string; action?: { label: string; onClick: () => void }; }
export function EmptyState({icon='📭', title, message, action}: EmptyStateProps) {
  return <div className="empty-state"><div className="empty-icon">{icon}</div><h3>{title}</h3>{message && <p>{message}</p>}{action && <button className="btn" onClick={action.onClick}>{action.label}</button>}</div>;
}
