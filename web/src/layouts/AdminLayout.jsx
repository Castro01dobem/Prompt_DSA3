import React from "react";
import { BarChart3, ClipboardList, LayoutDashboard, Users } from "lucide-react";
import { AppHeader, Button, Sidebar } from "../components/ui";

const adminItems = [
  { path: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/admin/turmas", label: "Turmas", icon: ClipboardList },
  { path: "/admin/usuarios", label: "Usuarios", icon: Users },
  { path: "/admin/relatorios", label: "Relatorios", icon: BarChart3 }
];

export function AdminLayout({ children, currentPath, navigate, user, onLogout }) {
  return (
    <div className="workspace-shell admin-shell">
      <Sidebar
        items={adminItems}
        currentPath={currentPath}
        navigate={navigate}
        footer={<Button variant="soft" onClick={() => navigate("/welcome")}>Ver institucional</Button>}
      />
      <div className="workspace-main">
        <AppHeader user={user} title="Area Administrativa" onLogout={onLogout} />
        <div className="page-content">{children}</div>
      </div>
    </div>
  );
}
