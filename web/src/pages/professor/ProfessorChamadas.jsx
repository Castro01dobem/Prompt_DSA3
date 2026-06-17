import React, { useMemo, useState } from "react";
import { CalendarCheck, Edit3, RefreshCw, Users } from "lucide-react";
import { Button, Card, CardTitle, DataTable, EmptyState, Field, Modal, PageHeader, SearchBox } from "../../components/ui";

export function ProfessorChamadas({ data }) {
  const [selectedClass, setSelectedClass] = useState("");
  const [search, setSearch] = useState("");
  const [editingLesson, setEditingLesson] = useState(null);

  const classId = selectedClass || data.classes[0]?.id || "";
  const lessons = data.lessonsByClass[classId] || [];
  const classSummary = (data.summary?.classes || []).find((item) => String(item.classGroupId) === String(classId));

  const filteredLessons = useMemo(() => {
    return lessons.filter((lesson) => lesson.title.toLowerCase().includes(search.toLowerCase()));
  }, [lessons, search]);

  async function refreshLessons() {
    await data.loadLessons(classId);
    await data.load();
  }

  return (
    <>
      <PageHeader
        eyebrow="Professor"
        title="Chamadas"
        description="Historico de aulas, presentes registrados e acompanhamento de ausencias por turma."
        action={<Button variant="soft" onClick={refreshLessons}><RefreshCw size={17} /> Atualizar</Button>}
      />

      <Card>
        <CardTitle icon={CalendarCheck} title="Historico de chamadas" description="Dados vindos de /lessons/class/{id}." />
        <div className="toolbar">
          <Field label="Turma">
            <select value={classId} onChange={(event) => setSelectedClass(event.target.value)}>
              {data.classes.map((item) => (
                <option value={item.id} key={item.id}>{item.name}</option>
              ))}
            </select>
          </Field>
          <SearchBox value={search} onChange={setSearch} placeholder="Buscar aula" />
        </div>
        <DataTable
          columns={[
            { key: "title", label: "Aula" },
            { key: "startsAt", label: "Inicio", render: (row) => new Date(row.startsAt).toLocaleString() },
            { key: "attendanceCount", label: "Presentes" },
            { key: "active", label: "Status", render: (row) => <span className={`pill ${row.active ? "success" : ""}`}>{row.active ? "Ativa" : "Encerrada"}</span> },
            { key: "actions", label: "Editar", render: (row) => <Button variant="ghost" onClick={() => setEditingLesson(row)}><Edit3 size={16} /> Abrir</Button> }
          ]}
          rows={filteredLessons}
          emptyText="Nenhuma chamada encontrada para esta turma."
        />
      </Card>

      <div className="two-columns">
        <Card>
          <CardTitle icon={Users} title="Presentes" description="Alunos com percentual de frequencia registrado." />
          <div className="student-list">
            {(classSummary?.studentsFrequency || []).filter((student) => student.presences > 0).map((student) => (
              <div className="student-row" key={student.studentName}>
                <span>{student.studentName}</span>
                <strong>{student.presences}/{student.totalLessons}</strong>
              </div>
            ))}
            {!classSummary?.studentsFrequency?.some((student) => student.presences > 0) && (
              <EmptyState icon={Users} title="Sem presentes" text="Os nomes aparecem conforme os check-ins forem registrados." />
            )}
          </div>
        </Card>

        <Card>
          <CardTitle icon={Users} title="Ausentes ou baixa frequencia" description="Alunos com presenca abaixo de 75%." />
          <div className="student-list">
            {(classSummary?.studentsFrequency || []).filter((student) => student.percentage < 75).map((student) => (
              <div className="student-row warning" key={student.studentName}>
                <span>{student.studentName}</span>
                <strong>{student.percentage.toFixed(0)}%</strong>
              </div>
            ))}
            {!classSummary?.studentsFrequency?.some((student) => student.percentage < 75) && (
              <EmptyState icon={Users} title="Sem alertas" text="Nenhum aluno abaixo do limite nesta turma." />
            )}
          </div>
        </Card>
      </div>

      {editingLesson && (
        <Modal
          title="Editar chamada"
          onClose={() => setEditingLesson(null)}
          footer={<Button onClick={() => setEditingLesson(null)}>Salvar visualizacao</Button>}
        >
          <Field label="Titulo da aula">
            <input defaultValue={editingLesson.title} />
          </Field>
          <Field label="Status">
            <select defaultValue={editingLesson.active ? "active" : "closed"}>
              <option value="active">Ativa</option>
              <option value="closed">Encerrada</option>
            </select>
          </Field>
          <p className="muted-copy">
            A API atual nao expoe endpoint de edicao de chamada. Este modal preserva a experiencia visual sem enviar uma chamada inexistente ao backend.
          </p>
        </Modal>
      )}
    </>
  );
}
