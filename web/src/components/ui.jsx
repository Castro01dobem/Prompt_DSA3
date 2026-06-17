import React from "react";
import {
  AlertCircle,
  ChevronRight,
  Loader2,
  Search,
  School,
  X
} from "lucide-react";

export function Brand({ compact = false }) {
  return (
    <div className={`brand ${compact ? "brand-compact" : ""}`}>
      <div className="brand-logo">
        <School size={compact ? 18 : 22} />
      </div>
      <div>
        <strong>Absence Manager</strong>
        {!compact && <span>SongSchool</span>}
      </div>
    </div>
  );
}

export function Button({ children, variant = "primary", className = "", ...props }) {
  return (
    <button className={`btn btn-${variant} ${className}`.trim()} {...props}>
      {children}
    </button>
  );
}

export function Field({ label, children, hint }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
      {hint && <small>{hint}</small>}
    </label>
  );
}

export function Alert({ children }) {
  return (
    <div className="alert" role="alert">
      <AlertCircle size={18} />
      <span>{children}</span>
    </div>
  );
}

export function PageHeader({ eyebrow, title, description, action }) {
  return (
    <div className="page-header">
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {action && <div className="page-actions">{action}</div>}
    </div>
  );
}

export function Card({ children, className = "" }) {
  return <section className={`card ${className}`.trim()}>{children}</section>;
}

export function CardTitle({ icon: Icon, eyebrow, title, description, action }) {
  return (
    <div className="card-title">
      <div className="title-cluster">
        {Icon && (
          <div className="title-icon">
            <Icon size={18} />
          </div>
        )}
        <div>
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          <h2>{title}</h2>
          {description && <p>{description}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}

export function StatCard({ icon: Icon, label, value, detail }) {
  return (
    <article className="stat-card">
      <div className="stat-icon">{Icon && <Icon size={20} />}</div>
      <span>{label}</span>
      <strong>{value}</strong>
      {detail && <small>{detail}</small>}
    </article>
  );
}

export function EmptyState({ icon: Icon, title, text, action }) {
  return (
    <div className="empty-state">
      {Icon && <Icon size={30} />}
      <strong>{title}</strong>
      {text && <span>{text}</span>}
      {action}
    </div>
  );
}

export function LoadingState({ label = "Carregando dados..." }) {
  return (
    <div className="loading-state">
      <Loader2 className="spin" size={18} />
      <span>{label}</span>
    </div>
  );
}

export function SearchBox({ value, onChange, placeholder = "Buscar" }) {
  return (
    <div className="search-box">
      <Search size={17} />
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
    </div>
  );
}

export function DataTable({ columns, rows, emptyText = "Nenhum registro encontrado." }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length ? (
            rows.map((row, index) => (
              <tr key={row.id || row.key || index}>
                {columns.map((column) => (
                  <td key={column.key}>{column.render ? column.render(row) : row[column.key]}</td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="table-empty">{emptyText}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export function Modal({ title, children, onClose, footer }) {
  return (
    <div className="modal-backdrop" role="presentation">
      <section className="modal" role="dialog" aria-modal="true" aria-label={title}>
        <header>
          <h2>{title}</h2>
          <button className="icon-button" onClick={onClose} title="Fechar">
            <X size={18} />
          </button>
        </header>
        <div className="modal-body">{children}</div>
        {footer && <footer>{footer}</footer>}
      </section>
    </div>
  );
}

export function Sidebar({ items, currentPath, navigate, footer }) {
  return (
    <aside className="sidebar">
      <Brand />
      <nav>
        {items.map((item) => {
          const active = currentPath === item.path;
          const Icon = item.icon;

          return (
            <button
              className={`nav-item ${active ? "active" : ""}`}
              key={item.path}
              onClick={() => navigate(item.path)}
            >
              <Icon size={18} />
              <span>{item.label}</span>
              {active && <ChevronRight size={16} />}
            </button>
          );
        })}
      </nav>
      {footer}
    </aside>
  );
}

export function AppHeader({ user, title, onLogout }) {
  return (
    <header className="app-header">
      <div>
        <span>SongSchool</span>
        <strong>{title}</strong>
      </div>
      <div className="user-menu">
        <div>
          <strong>{user.name}</strong>
          <span>{user.role}</span>
        </div>
        <Button variant="ghost" onClick={onLogout}>Sair</Button>
      </div>
    </header>
  );
}
