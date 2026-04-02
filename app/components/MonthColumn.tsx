"use client";

import { AggregatedProject } from "@/app/types/project";
import ProjectCard from "./ProjectCard";

interface MonthColumnProps {
  month: string;
  projects: AggregatedProject[];
  onProjectClick: (project: AggregatedProject) => void;
}

export default function MonthColumn({ month, projects, onProjectClick }: MonthColumnProps) {
  return (
    <div className="flex flex-col flex-1 bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md">
      <div className="bg-gradient-to-r from-gray-800 dark:from-gray-700 to-gray-700 dark:to-gray-600 text-white p-3 sticky top-0 z-10">
        <h3 className="font-bold text-center text-sm">{month}</h3>
        <p className="text-xs text-gray-200 dark:text-gray-300 text-center mt-1">
          {projects.length} {projects.length !== 1 ? "items" : "item"}
        </p>
      </div>
      <div className="px-2 py-2 overflow-y-auto max-h-96">
        {projects.length > 0 ? (
          projects.map((project, idx) => (
            <ProjectCard
              key={`${project.reference}-${project.title}-${idx}`}
              project={project}
              onClick={onProjectClick}
            />
          ))
        ) : (
          <p className="text-gray-400 dark:text-gray-500 text-xs text-center py-4">
            —
          </p>
        )}
      </div>
    </div>
  );
}
