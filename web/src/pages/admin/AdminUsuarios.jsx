import React, { useMemo, useState } from "react";
import { Edit3, Plus, UserRound, Users } from "lucide-react";
import { Button, Card, CardTitle, DataTable, Field, Modal, PageHeader, SearchBox } from "../../components/ui";

export function AdminUsuarios({ data }) {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("TODOS");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const users = useMemo(() => {
    const professors = data.classes.map((item) => ({
      id: `prof-${item.professorId}`,
      name: item.professorName,
      role: "PROFESSOR",
      email: "professor@songschool.com",
      source: item.name
    }));
    const students = (data.summary?.classes || []).flatMap((classItem) =>
      (classItem.studentsFrequency || []).map((student, index) => ({
        id: `student-${classItem.classGroupId}-${index}`,
        name: student.studentName,
        role: "ALUNO",
        email: "aluno@songschool.com",
        source: classItem.classGroupName
      }))
    );
    const unique = [...professors, ...students].filter((item, index, list) =>
      index === list.findIndex((other) => other.name === item.name && other.role === item.role)
    );

    return unique.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
      const matchesRole = roleFilter === "TODOS" || item.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [data.classes, data.summary, roleFilter, search]);

  function openModal(row) {
    setEditing(row || null);
    setModalOpen(true);
  }

  return (
    <>
      <PageHeader
        eyebrow="Admin"
        title="Usuarios"
        description="Busca, filtro por perfil e tabela pronta para gestao de usuarios."
        action={<Button onClick={() => openModal(null)}><Plus size={17} /> Novo usuario</Button>}
      />

      <Card>
        <CardTitle icon={Users} title="Cadastro de usuarios" description="Lista composta a partir dos dados disponiveis na API atual." />
        <div className="toolbar">
          <SearchBox value={search} onChange={setSearch} placeholder="Buscar usuario" />
          <Field label="Perfil">
            <select value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)}>
              <option value="TODOS">Todos</option>
              <option value="PROFESSOR">Professor</option>
              <option value="ALUNO">Aluno</option>
              <option value="ADMIN">Admin</option>
            </select>
          </Field>
        </div>
        <DataTable
          columns={[
            { key: "name", label: "Nome" },
            { key: "email", label: "Email" },
            { key: "role", label: "Perfil", render: (row) => <span className="pill">{row.role}</span> },
            { key: "source", label: "Origem" },
            { key: "actions", label: "Acoes", render: (row) => <Button variant="ghost" onClick={() => openModal(row)}><Edit3 size={16} /> Editar</Button> }
          ]}
          rows={users}
          emptyText="Nenhum usuario encontrado."
        />
      </Card>

      {modalOpen && (
        <Modal
          title={editing ? "Editar usuario" : "Novo usuario"}
          onClose={() => setModalOpen(false)}
          footer={<Button onClick={() => setModalOpen(false)}>Salvar visualizacao</Button>}
        >
          <Field label="Nome">
            <input defaultValue={editing?.name || ""} />
          </Field>
          <Field label="Email">
            <input defaultValue={editing?.email || ""} />
          </Field>
          <Field label="Perfil">
            <select defaultValue={editing?.role || "PROFESSOR"}>
              <option value="ADMIN">Admin</option>
              <option value="PROFESSOR">Professor</option>
              <option value="ALUNO">Aluno</option>
            </select>
          </Field>
          <p className="muted-copy"><UserRound size={15} /> CRUD visual preparado. O backend atual nao expoe endpoints administrativos de usuarios.</p>
        </Modal>
      )}
    </>
  );
}
