import React from "react";
import { BarChart3, CalendarCheck, QrCode } from "lucide-react";
import { AppHeader, Button, Sidebar } from "../components/ui";

const professorItems = [
  { path: "/professor/dashboard", label: "Dashboard", icon: BarChart3 },
  { path: "/professor/qr-code", label: "QR Code", icon: QrCode },
  { path: "/professor/chamadas", label: "Chamadas", icon: CalendarCheck }
];

export function ProfessorLayout({ children, currentPath, navigate, user, onLogout }) {
  return (
    <div className="workspace-shell">
      <Sidebar
        items={professorItems}
        currentPath={currentPath}
        navigate={navigate}
        footer={<Button variant="soft" onClick={() => navigate("/welcome")}>Ver institucional</Button>}
      />
      <div className="workspace-main">
        <AppHeader user={user} title="Area do Professor" onLogout={onLogout} />
        <div className="page-content">{children}</div>
      </div>
    </div>
  );
}
