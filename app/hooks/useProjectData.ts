"use client";

import { useEffect, useState } from "react";
import { ProjectRecord, GroupedProjects } from "@/app/types/project";
import { groupProjectsByQuarterAndMonth } from "@/app/utils/projectGrouping";

interface UseProjectDataResult {
  data: GroupedProjects | null;
  loading: boolean;
  error: string | null;
}

export function useProjectData(
  year: number,
  department: string = "Concerto"
): UseProjectDataResult {
  const [data, setData] = useState<GroupedProjects | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`/api/excel?department=${department}&year=${year}`)
      .then((res) => {
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        return res.json();
      })
      .then((projects: ProjectRecord[]) => {
        const grouped = groupProjectsByQuarterAndMonth(projects);
        setData(grouped);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [year, department]);

  return { data, loading, error };
}
