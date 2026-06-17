import React, { useState } from "react";
import { BarChart3, Loader2, QrCode, ShieldCheck } from "lucide-react";
import { apiFetch, getApiUrl, setApiUrl, setSession } from "../../api";
import { Alert, Button, Field } from "../../components/ui";
import { pathForRole } from "../../routes/router";

export function LoginPage({ onLogin, navigate }) {
  const [email, setEmail] = useState("prof@songschool.com");
  const [password, setPassword] = useState("123456");
  const [apiUrlValue, setApiUrlValue] = useState(getApiUrl());
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    setApiUrl(apiUrlValue);

    try {
      const session = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
      });
      setSession(session);
      onLogin(session.user);
      navigate(pathForRole(session.user.role));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="login-screen">
      <aside className="login-story">
        <span className="eyebrow">Portal SongSchool</span>
        <h1>Entre para gerenciar chamadas com QR Code.</h1>
        <p>Uma experiencia profissional para professores e administradores acompanharem frequencia sem planilhas soltas.</p>
        <div className="story-list">
          <div><ShieldCheck size={18} /> Sessao segura com token atual</div>
          <div><QrCode size={18} /> Geracao de QR Code por aula</div>
          <div><BarChart3 size={18} /> Indicadores por turma e aluno</div>
        </div>
      </aside>

      <div className="login-form-card">
        <div className="form-heading">
          <span className="eyebrow">Acesso</span>
          <h2>Entrar no sistema</h2>
          <p>Depois do login, cada perfil segue automaticamente para sua area.</p>
        </div>
        <form onSubmit={submit}>
          <Field label="URL da API">
            <input value={apiUrlValue} onChange={(event) => setApiUrlValue(event.target.value)} />
          </Field>
          <Field label="Email">
            <input value={email} onChange={(event) => setEmail(event.target.value)} />
          </Field>
          <Field label="Senha">
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
          </Field>
          {error && <Alert>{error}</Alert>}
          <Button type="submit" disabled={loading}>
            {loading ? <Loader2 className="spin" size={18} /> : <ShieldCheck size={18} />}
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </div>
    </section>
  );
}
