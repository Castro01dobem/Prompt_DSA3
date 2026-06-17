import React from "react";
import { BarChart3, CheckCircle2, Clock3, QrCode, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "../../components/ui";

const benefits = [
  ["Presenca em segundos", "O professor abre a chamada, gera o QR Code e os alunos registram a presenca no celular."],
  ["Gestao por perfil", "Professores acompanham suas aulas enquanto administradores visualizam indicadores gerais."],
  ["Relatorios claros", "Frequencia por turma e aluno em uma interface limpa, pronta para acompanhamento academico."]
];

export function WelcomePage({ navigate }) {
  return (
    <div className="welcome-page">
      <section className="welcome-hero">
        <div>
          <span className="eyebrow">SongSchool apresenta</span>
          <h1>Absence Manager</h1>
          <p>
            Uma plataforma moderna para organizar chamadas, gerar QR Codes de aula e acompanhar frequencia com clareza.
          </p>
          <div className="hero-actions">
            <Button onClick={() => navigate("/login")}>
              Entrar no Sistema
            </Button>
            <Button variant="ghost" onClick={() => document.getElementById("como-funciona")?.scrollIntoView({ behavior: "smooth" })}>
              Como funciona
            </Button>
          </div>
        </div>
        <div className="product-preview">
          <div className="preview-top">
            <span />
            <span />
            <span />
          </div>
          <div className="preview-grid">
            <article>
              <QrCode size={26} />
              <strong>QR Code ativo</strong>
              <span>Aula de hoje</span>
            </article>
            <article>
              <BarChart3 size={26} />
              <strong>87%</strong>
              <span>Frequencia media</span>
            </article>
            <article className="wide">
              <Clock3 size={26} />
              <strong>Chamada em andamento</strong>
              <span>Expira em 14 minutos</span>
            </article>
          </div>
        </div>
      </section>

      <section className="section-band">
        <div className="section-heading">
          <span className="eyebrow">Beneficios</span>
          <h2>Controle academico com aparencia de produto real.</h2>
        </div>
        <div className="benefit-grid">
          {benefits.map(([title, text]) => (
            <article className="info-card" key={title}>
              <CheckCircle2 size={22} />
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="how-section" id="como-funciona">
        <div>
          <span className="eyebrow">Fluxo QR Code</span>
          <h2>Da aula criada ao relatorio final.</h2>
          <p>
            O Absence Manager reduz atrito: escolha a turma, crie a aula, projete o QR Code e acompanhe a frequencia.
          </p>
        </div>
        <div className="timeline">
          <div><Sparkles size={18} /><span>Professor inicia uma aula.</span></div>
          <div><QrCode size={18} /><span>Sistema gera um token em QR Code.</span></div>
          <div><ShieldCheck size={18} /><span>Presencas ficam vinculadas ao usuario autenticado.</span></div>
          <div><BarChart3 size={18} /><span>Relatorios consolidam turma, aluno e percentual.</span></div>
        </div>
      </section>
    </div>
  );
}
