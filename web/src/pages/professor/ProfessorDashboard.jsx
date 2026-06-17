import React, { useEffect, useMemo } from "react";
import { BarChart3, BookOpen, CalendarCheck, GraduationCap, Users } from "lucide-react";
import { Card, CardTitle, DataTable, EmptyState, LoadingState, PageHeader, StatCard } from "../../components/ui";

export function ProfessorDashboard({ data, navigate }) {
  const firstClassId = data.classes[0]?.id;

  useEffect(() => {
    if (firstClassId) {
      data.loadLessons(firstClassId);
    }
  }, [firstClassId]);

  const latestLessons = useMemo(() => {
    return Object.values(data.lessonsByClass)
      .flat()
      .sort((a, b) => new Date(b.startsAt) - new Date(a.startsAt))
      .slice(0, 5);
  }, [data.lessonsByClass]);

  if (data.loading) {
    return <LoadingState />;
  }

  return (
    <>
      <PageHeader
        eyebrow="Professor"
        title="Dashboard"
        description="Visao rapida das suas turmas, aulas e frequencia media."
      />

      <div className="stats-grid">
        <StatCard icon={GraduationCap} label="Turmas" value={data.stats.totalClasses} detail="vinculadas ao perfil" />
        <StatCard icon={Users} label="Alunos" value={data.stats.totalStudents} detail="matriculas acompanhadas" />
        <StatCard icon={BarChart3} label="Presenca media" value={`${data.stats.averagePresence.toFixed(0)}%`} detail="media geral" />
        <StatCard icon={BookOpen} label="Aulas" value={data.stats.totalLessons} detail="registradas no sistema" />
      </div>

      <div className="two-columns">
        <Card>
          <CardTitle icon={CalendarCheck} title="Ultimas aulas" description="Historico recente da primeira turma carregada." />
          <DataTable
            columns={[
              { key: "title", label: "Aula" },
              { key: "classGroupName", label: "Turma" },
              { key: "attendanceCount", label: "Presentes" },
              { key: "active", label: "Status", render: (row) => <span className={`pill ${row.active ? "success" : ""}`}>{row.active ? "Ativa" : "Encerrada"}</span> }
            ]}
            rows={latestLessons}
            emptyText="Carregue uma turma ou gere uma aula para ver o historico."
          />
        </Card>

        <Card>
          <CardTitle icon={BarChart3} title="Frequencia por turma" description="Resumo consolidado do relatorio atual." />
          <div className="summary-list">
            {(data.summary?.classes || []).map((item) => {
              const average = item.studentsFrequency?.length
                ? item.studentsFrequency.reduce((total, student) => total + student.percentage, 0) / item.studentsFrequency.length
                : 0;

              return (
                <button className="summary-row" key={item.classGroupId} onClick={() => navigate("/professor/chamadas")}>
                  <div>
                    <strong>{item.classGroupName}</strong>
                    <span>{item.students} alunos - {item.lessons} aulas</span>
                  </div>
                  <span>{average.toFixed(0)}%</span>
                </button>
              );
            })}
            {!data.summary?.classes?.length && (
              <EmptyState icon={BarChart3} title="Sem relatorio" text="Os dados aparecem depois que houver aulas e chamadas." />
            )}
          </div>
        </Card>
      </div>
    </>
  );
}
