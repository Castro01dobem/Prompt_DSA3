import React, { useMemo, useState } from "react";
import { BarChart3, CalendarDays, Download } from "lucide-react";
import { Button, Card, CardTitle, DataTable, EmptyState, Field, PageHeader, StatCard } from "../../components/ui";

export function AdminRelatorios({ data }) {
  const [selectedClass, setSelectedClass] = useState("TODAS");
  const [period, setPeriod] = useState("30");

  const classSummaries = data.summary?.classes || [];
  const visibleClasses = selectedClass === "TODAS"
    ? classSummaries
    : classSummaries.filter((item) => String(item.classGroupId) === selectedClass);

  const students = useMemo(() => {
    return visibleClasses.flatMap((classItem) =>
      (classItem.studentsFrequency || []).map((student) => ({
        id: `${classItem.classGroupId}-${student.studentName}`,
        classGroupName: classItem.classGroupName,
        ...student
      }))
    );
  }, [visibleClasses]);

  const average = students.length
    ? students.reduce((total, student) => total + student.percentage, 0) / students.length
    : 0;

  return (
    <>
      <PageHeader
        eyebrow="Admin"
        title="Relatorios"
        description="Analise frequencia por turma, periodo e aluno com tabelas organizadas."
        action={<Button variant="soft"><Download size={17} /> Exportar</Button>}
      />

      <div className="stats-grid">
        <StatCard icon={BarChart3} label="Frequencia" value={`${average.toFixed(0)}%`} detail="media do filtro" />
        <StatCard icon={CalendarDays} label="Periodo" value={`${period}d`} detail="janela selecionada" />
        <StatCard icon={BarChart3} label="Turmas" value={visibleClasses.length} detail="no filtro" />
        <StatCard icon={BarChart3} label="Alunos" value={students.length} detail="com frequencia" />
      </div>

      <Card>
        <CardTitle icon={BarChart3} title="Filtros do relatorio" description="A API atual retorna o resumo consolidado; os filtros organizam a visualizacao." />
        <div className="toolbar">
          <Field label="Turma">
            <select value={selectedClass} onChange={(event) => setSelectedClass(event.target.value)}>
              <option value="TODAS">Todas</option>
              {classSummaries.map((item) => (
                <option value={item.classGroupId} key={item.classGroupId}>{item.classGroupName}</option>
              ))}
            </select>
          </Field>
          <Field label="Periodo">
            <select value={period} onChange={(event) => setPeriod(event.target.value)}>
              <option value="7">Ultimos 7 dias</option>
              <option value="30">Ultimos 30 dias</option>
              <option value="90">Ultimos 90 dias</option>
            </select>
          </Field>
        </div>
      </Card>

      <Card>
        <CardTitle icon={BarChart3} title="Frequencia por aluno" description="Percentual, presencas e aulas totais." />
        <DataTable
          columns={[
            { key: "studentName", label: "Aluno" },
            { key: "classGroupName", label: "Turma" },
            { key: "presences", label: "Presencas" },
            { key: "totalLessons", label: "Aulas" },
            { key: "percentage", label: "Frequencia", render: (row) => <strong>{row.percentage.toFixed(0)}%</strong> }
          ]}
          rows={students}
          emptyText="Nenhum dado de frequencia encontrado."
        />
        {!students.length && <EmptyState icon={BarChart3} title="Sem frequencia" text="Os dados aparecem apos aulas e check-ins." />}
      </Card>
    </>
  );
}
