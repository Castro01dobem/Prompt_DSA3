import { apiFetch } from "../api";

export function listClasses() {
  return apiFetch("/classes");
}

export function listSummary() {
  return apiFetch("/reports/summary");
}

export function createLesson(classGroupId, title) {
  return apiFetch("/lessons", {
    method: "POST",
    body: JSON.stringify({ classGroupId: Number(classGroupId), title })
  });
}

export function listLessonsByClass(classGroupId) {
  if (!classGroupId) {
    return Promise.resolve([]);
  }

  return apiFetch(`/lessons/class/${classGroupId}`);
}
