import React, { useMemo, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Clock3, Loader2, Play, QrCode, RefreshCw } from "lucide-react";
import { Alert, Button, Card, CardTitle, EmptyState, Field, LoadingState, PageHeader } from "../../components/ui";
import { createLesson } from "../../services/schoolService";

function minutesLeft(expiresAt) {
  const diff = new Date(expiresAt).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / 60000));
}

export function ProfessorQrCode({ data }) {
  const [selectedClass, setSelectedClass] = useState("");
  const [lessonTitle, setLessonTitle] = useState("Aula de hoje");
  const [activeLesson, setActiveLesson] = useState(null);
  const [creating, setCreating] = useState(false);
  const [localError, setLocalError] = useState("");

  const classId = selectedClass || data.classes[0]?.id || "";
  const selectedClassName = useMemo(
    () => data.classes.find((item) => String(item.id) === String(classId))?.name || "Turma",
    [classId, data.classes]
  );

  async function handleCreateLesson() {
    if (!classId) {
      setLocalError("Selecione uma turma para gerar o QR Code.");
      return;
    }

    setLocalError("");
    setCreating(true);

    try {
      const lesson = await createLesson(classId, lessonTitle);
      setActiveLesson(lesson);
      await data.loadLessons(classId);
      await data.load();
    } catch (err) {
      setLocalError(err.message);
    } finally {
      setCreating(false);
    }
  }

  if (data.loading) {
    return <LoadingState />;
  }

  return (
    <>
      <PageHeader
        eyebrow="Professor"
        title="QR Code da aula"
        description="Selecione a turma, defina o titulo e gere a chamada ativa."
        action={<Button variant="soft" onClick={() => data.load()}><RefreshCw size={17} /> Atualizar</Button>}
      />

      {(data.error || localError) && <Alert>{data.error || localError}</Alert>}

      <div className="qr-page-grid">
        <Card>
          <CardTitle icon={Play} title="Criar chamada" description="A aula criada gera um token valido para check-in." />
          <Field label="Turma">
            <select value={classId} onChange={(event) => setSelectedClass(event.target.value)}>
              {data.classes.map((item) => (
                <option value={item.id} key={item.id}>{item.name}</option>
              ))}
            </select>
          </Field>
          <Field label="Titulo da aula">
            <input value={lessonTitle} onChange={(event) => setLessonTitle(event.target.value)} />
          </Field>
          <Button onClick={handleCreateLesson} disabled={creating || !classId}>
            {creating ? <Loader2 className="spin" size={18} /> : <QrCode size={18} />}
            {creating ? "Gerando..." : "Gerar QR Code"}
          </Button>
        </Card>

        <Card className="qr-stage">
          <CardTitle icon={QrCode} title="Aula ativa" description="Projete ou compartilhe este QR Code com a turma." />
          {activeLesson ? (
            <div className="qr-active">
              <div className="qr-frame">
                <QRCodeSVG value={activeLesson.qrToken} size={250} />
              </div>
              <div className="lesson-meta">
                <strong>{activeLesson.title}</strong>
                <span>{selectedClassName}</span>
                <div><Clock3 size={16} /> {minutesLeft(activeLesson.expiresAt)} min restantes</div>
                <span className={`pill ${activeLesson.active ? "success" : ""}`}>{activeLesson.active ? "Ativa" : "Encerrada"}</span>
              </div>
            </div>
          ) : (
            <EmptyState icon={QrCode} title="Nenhuma aula ativa" text="Gere uma aula para exibir o QR Code aqui." />
          )}
        </Card>
      </div>
    </>
  );
}
