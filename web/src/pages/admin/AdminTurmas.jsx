import React, { useMemo, useState } from "react";
import { ClipboardList, Edit3, Plus, Search } from "lucide-react";
import { Button, Card, CardTitle, DataTable, Field, Modal, PageHeader, SearchBox } from "../../components/ui";

export function AdminTurmas({ data }) {
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const rows = useMemo(() => {
    return data.classes
      .filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))
      .map((item) => {
        const summary = (data.summary?.classes || []).find((summaryItem) => summaryItem.classGroupId === item.id);
        return {
          ...item,
          students: summary?.students || 0,
          lessons: summary?.lessons || 0
        };
      });
  }, [data.classes, data.summary, search]);

  function openModal(row) {
    setEditing(row || null);
    setModalOpen(true);
  }

  return (
    <>
      <PageHeader
        eyebrow="Admin"
        title="Turmas"
        description="Tabela moderna com busca, filtros e modal de criacao/edicao."
        action={<Button onClick={() => openModal(null)}><Plus size={17} /> Nova turma</Button>}
      />

      <Card>
        <CardTitle icon={ClipboardList} title="Cadastro de turmas" description="A API atual fornece listagem de turmas. O CRUD visual esta preparado para os endpoints futuros." />
        <div className="toolbar">
          <SearchBox value={search} onChange={setSearch} placeholder="Buscar turma" />
          <Button variant="soft"><Search size={17} /> Filtrar</Button>
        </div>
        <DataTable
          columns={[
            { key: "name", label: "Turma" },
            { key: "professorName", label: "Professor" },
            { key: "students", label: "Alunos" },
            { key: "lessons", label: "Aulas" },
            { key: "actions", label: "Acoes", render: (row) => <Button variant="ghost" onClick={() => openModal(row)}><Edit3 size={16} /> Editar</Button> }
          ]}
          rows={rows}
          emptyText="Nenhuma turma encontrada."
        />
      </Card>

      {modalOpen && (
        <Modal
          title={editing ? "Editar turma" : "Nova turma"}
          onClose={() => setModalOpen(false)}
          footer={<Button onClick={() => setModalOpen(false)}>Salvar visualizacao</Button>}
        >
          <Field label="Nome da turma">
            <input defaultValue={editing?.name || ""} placeholder="Ex: Teclado iniciante" />
          </Field>
          <Field label="Professor">
            <input defaultValue={editing?.professorName || ""} placeholder="Nome do professor" />
          </Field>
          <p className="muted-copy">CRUD visual preparado. O backend atual ainda nao expoe POST/PUT/DELETE para turmas.</p>
        </Modal>
      )}
    </>
  );
}
