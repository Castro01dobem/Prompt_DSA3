import { useCallback, useEffect, useMemo, useState } from "react";
import { listClasses, listLessonsByClass, listSummary } from "./schoolService";

export function useSchoolData(enabled = true) {
  const [classes, setClasses] = useState([]);
  const [summary, setSummary] = useState(null);
  const [lessonsByClass, setLessonsByClass] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    setError("");
    setLoading(true);

    try {
      const [classData, summaryData] = await Promise.all([listClasses(), listSummary()]);
      setClasses(classData || []);
      setSummary(summaryData || { classes: [] });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  const loadLessons = useCallback(async (classGroupId) => {
    if (!classGroupId) {
      return [];
    }

    try {
      const lessons = await listLessonsByClass(classGroupId);
      setLessonsByClass((current) => ({ ...current, [classGroupId]: lessons || [] }));
      return lessons || [];
    } catch (err) {
      setError(err.message);
      return [];
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const stats = useMemo(() => {
    const summaries = summary?.classes || [];
    const totalStudents = summaries.reduce((total, item) => total + item.students, 0);
    const totalLessons = summaries.reduce((total, item) => total + item.lessons, 0);
    const allFrequencies = summaries.flatMap((item) => item.studentsFrequency || []);
    const averagePresence = allFrequencies.length
      ? allFrequencies.reduce((total, item) => total + item.percentage, 0) / allFrequencies.length
      : 0;

    return {
      totalClasses: classes.length || summaries.length,
      totalStudents,
      totalLessons,
      averagePresence
    };
  }, [classes, summary]);

  return {
    classes,
    error,
    lessonsByClass,
    load,
    loadLessons,
    loading,
    setError,
    stats,
    summary
  };
}
