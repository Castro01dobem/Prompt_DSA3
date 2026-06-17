import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { clearSession, getUser } from "./api";
import { AdminLayout } from "./layouts/AdminLayout";
import { ProfessorLayout } from "./layouts/ProfessorLayout";
import { PublicLayout } from "./layouts/PublicLayout";
import { LoginPage } from "./pages/auth/LoginPage";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminRelatorios } from "./pages/admin/AdminRelatorios";
import { AdminTurmas } from "./pages/admin/AdminTurmas";
import { AdminUsuarios } from "./pages/admin/AdminUsuarios";
import { ProfessorChamadas } from "./pages/professor/ProfessorChamadas";
import { ProfessorDashboard } from "./pages/professor/ProfessorDashboard";
import { ProfessorQrCode } from "./pages/professor/ProfessorQrCode";
import { WelcomePage } from "./pages/public/WelcomePage";
import { canAccess, isAdminRoute, isProfessorRoute, normalizePath, pathForRole } from "./routes/router";
import { useSchoolData } from "./services/useSchoolData";
import "./styles.css";

function useLocationPath() {
  const [path, setPath] = useState(() => normalizePath(window.location.pathname));

  useEffect(() => {
    function syncPath() {
      setPath(normalizePath(window.location.pathname));
    }

    window.addEventListener("popstate", syncPath);
    return () => window.removeEventListener("popstate", syncPath);
  }, []);

  function navigate(nextPath, replace = false) {
    const normalized = normalizePath(nextPath);
    if (replace) {
      window.history.replaceState({}, "", normalized);
    } else {
      window.history.pushState({}, "", normalized);
    }
    setPath(normalized);
  }

  return [path, navigate];
}

function ProfessorRoutes({ path, navigate, data }) {
  if (path === "/professor/qr-code") {
    return <ProfessorQrCode data={data} />;
  }

  if (path === "/professor/chamadas") {
    return <ProfessorChamadas data={data} />;
  }

  return <ProfessorDashboard data={data} navigate={navigate} />;
}

function AdminRoutes({ path, data }) {
  if (path === "/admin/turmas") {
    return <AdminTurmas data={data} />;
  }

  if (path === "/admin/usuarios") {
    return <AdminUsuarios data={data} />;
  }

  if (path === "/admin/relatorios") {
    return <AdminRelatorios data={data} />;
  }

  return <AdminDashboard data={data} />;
}

function App() {
  const [user, setUser] = useState(getUser());
  const [path, navigate] = useLocationPath();
  const data = useSchoolData(Boolean(user));

  useEffect(() => {
    if (!canAccess(path, user)) {
      navigate(user ? pathForRole(user.role) : "/welcome", true);
      return;
    }

    if (user && (path === "/login" || path === "/welcome")) {
      navigate(pathForRole(user.role), true);
    }
  }, [path, user]);

  function handleLogout() {
    clearSession();
    setUser(null);
    navigate("/welcome");
  }

  if (!user) {
    return (
      <PublicLayout navigate={navigate}>
        {path === "/login" ? (
          <LoginPage onLogin={setUser} navigate={navigate} />
        ) : (
          <WelcomePage navigate={navigate} />
        )}
      </PublicLayout>
    );
  }

  if (isAdminRoute(path)) {
    return (
      <AdminLayout currentPath={path} navigate={navigate} user={user} onLogout={handleLogout}>
        <AdminRoutes path={path} data={data} />
      </AdminLayout>
    );
  }

  if (isProfessorRoute(path)) {
    return (
      <ProfessorLayout currentPath={path} navigate={navigate} user={user} onLogout={handleLogout}>
        <ProfessorRoutes path={path} navigate={navigate} data={data} />
      </ProfessorLayout>
    );
  }

  return null;
}

createRoot(document.getElementById("root")).render(<App />);
