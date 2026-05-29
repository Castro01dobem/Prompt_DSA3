import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { QRCodeSVG } from "qrcode.react";
import { LogOut, Play, RefreshCw } from "lucide-react";
import { apiFetch, clearSession, getApiUrl, getUser, setApiUrl, setSession } from "./api";
import "./styles.css";

function Login({ onLogin }) {
  const [email, setEmail] = useState("prof@songschool.com");
  const [password, setPassword] = useState("123456");
  const [apiUrlValue, setApiUrlValue] = useState(getApiUrl());
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    setError("");
    setApiUrl(apiUrlValue);
    try {
      const session = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
      });
      setSession(session);
      onLogin(session.user);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="login-page">
      <section className="login-panel">
        <h1>Absence Manager</h1>
        <p>SongSchool</p>
        <form onSubmit={submit}>
          <label>
            URL da API
            <input value={apiUrlValue} onChange={(e) => setApiUrlValue(e.target.value)} />
          </label>
          <label>
            Email
            <input value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label>
            Senha
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
          {error && <div className="error">{error}</div>}
          <button type="submit">Entrar</button>
        </form>
      </section>
    </main>
  );
}

function Dashboard({ user, onLogout }) {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [lessonTitle, setLessonTitle] = useState("Aula de hoje");
  const [lesson, setLesson] = useState(null);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");

  async function loadData() {
    setError("");
    try {
      const classData = await apiFetch("/classes");
      setClasses(classData);
      if (!selectedClass && classData[0]) {
        setSelectedClass(String(classData[0].id));
      }
      if (user.role !== "ALUNO") {
        setSummary(await apiFetch("/reports/summary"));
      }
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function createLesson() {
    setError("");
    try {
      const created = await apiFetch("/lessons", {
        method: "POST",
        body: JSON.stringify({ classGroupId: Number(selectedClass), title: lessonTitle })
      });
      setLesson(created);
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  function logout() {
    clearSession();
    onLogout();
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <strong>Absence Manager</strong>
          <span>{user.name} - {user.role}</span>
        </div>
        <button className="icon-button" onClick={logout} title="Sair">
          <LogOut size={18} />
        </button>
      </header>

      {error && <div className="banner">{error}</div>}

      <section className="grid">
        <div className="panel">
          <h2>Iniciar aula</h2>
          <label>
            Turma
            <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
              {classes.map((item) => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </select>
          </label>
          <label>
            Titulo da aula
            <input value={lessonTitle} onChange={(e) => setLessonTitle(e.target.value)} />
          </label>
          <button onClick={createLesson} disabled={!selectedClass}>
            <Play size={18} />
            Gerar QR Code
          </button>
        </div>

        <div className="panel qr-panel">
          <h2>QR Code da aula</h2>
          {lesson ? (
            <>
              <QRCodeSVG value={lesson.qrToken} size={240} />
              <strong>{lesson.title}</strong>
              <span>Expira em: {new Date(lesson.expiresAt).toLocaleTimeString()}</span>
            </>
          ) : (
            <div className="empty-state">Gere uma aula para exibir o QR Code.</div>
          )}
        </div>
      </section>

      <section className="panel">
        <div className="section-title">
          <h2>Relatorio</h2>
          <button className="icon-button" onClick={loadData} title="Atualizar">
            <RefreshCw size={18} />
          </button>
        </div>
        <div className="report-grid">
          {summary?.classes?.map((classSummary) => (
            <article className="report-card" key={classSummary.classGroupId}>
              <h3>{classSummary.classGroupName}</h3>
              <p>{classSummary.students} alunos - {classSummary.lessons} aulas</p>
              {classSummary.studentsFrequency.map((student) => (
                <div className="frequency" key={student.studentName}>
                  <span>{student.studentName}</span>
                  <strong>{student.percentage.toFixed(0)}%</strong>
                </div>
              ))}
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

function App() {
  const [user, setUser] = useState(getUser());

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return <Dashboard user={user} onLogout={() => setUser(null)} />;
}

createRoot(document.getElementById("root")).render(<App />);

