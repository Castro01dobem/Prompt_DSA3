import React from "react";
import { BarChart3, BookOpen, ClipboardList, Users } from "lucide-react";
import { Card, CardTitle, DataTable, EmptyState, LoadingState, PageHeader, StatCard } from "../../components/ui";

export function AdminDashboard({ data }) {
  if (data.loading) {
    return <LoadingState />;
  }

  return (
    <>
      <PageHeader
        eyebrow="Admin"
        title="Dashboard administrativo"
        description="Indicadores gerais para acompanhar operacao, turmas e frequencia."
      />

      <div className="stats-grid">
        <StatCard icon={Users} label="Usuarios" value={data.stats.totalStudents + data.stats.totalClasses} detail="estimativa por dados disponiveis" />
        <StatCard icon={ClipboardList} label="Turmas" value={data.stats.totalClasses} detail="cadastradas" />
        <StatCard icon={BookOpen} label="Aulas" value={data.stats.totalLessons} detail="criadas" />
        <StatCard icon={BarChart3} label="Frequencia geral" value={`${data.stats.averagePresence.toFixed(0)}%`} detail="media consolidada" />
      </div>

      <div className="two-columns">
        <Card>
          <CardTitle icon={ClipboardList} title="Turmas em destaque" description="Resumo vindo do relatorio consolidado." />
          <DataTable
            columns={[
              { key: "classGroupName", label: "Turma" },
              { key: "students", label: "Alunos" },
              { key: "lessons", label: "Aulas" }
            ]}
            rows={(data.summary?.classes || []).map((item) => ({ ...item, id: item.classGroupId }))}
          />
        </Card>

        <Card>
          <CardTitle icon={BarChart3} title="Saude de frequencia" description="Media por turma." />
          <div className="summary-list">
            {(data.summary?.classes || []).map((item) => {
              const average = item.studentsFrequency?.length
                ? item.studentsFrequency.reduce((total, student) => total + student.percentage, 0) / item.studentsFrequency.length
                : 0;

              return (
                <div className="frequency" key={item.classGroupId}>
                  <div className="frequency-row">
                    <span>{item.classGroupName}</span>
                    <strong>{average.toFixed(0)}%</strong>
                  </div>
                  <div className="meter"><span style={{ width: `${Math.max(0, Math.min(100, average))}%` }} /></div>
                </div>
              );
            })}
            {!data.summary?.classes?.length && <EmptyState icon={BarChart3} title="Sem dados" text="O resumo aparece quando houver chamadas." />}
          </div>
        </Card>
      </div>
    </>
  );
}
