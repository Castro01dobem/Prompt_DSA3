import React from "react";
import { Brand, Button } from "../components/ui";

export function PublicLayout({ children, navigate }) {
  return (
    <main className="public-shell">
      <header className="public-nav">
        <Brand compact />
        <div>
          <Button variant="ghost" onClick={() => navigate("/welcome")}>Inicio</Button>
          <Button variant="primary" onClick={() => navigate("/login")}>Entrar no Sistema</Button>
        </div>
      </header>
      {children}
    </main>
  );
}
