"use client";

import { AggregatedProject } from "@/app/types/project";

interface ProjectCardProps {
  project: AggregatedProject;
  onClick: (project: AggregatedProject) => void;
}

export default function ProjectCard({ project, onClick }: ProjectCardProps) {
  return (
    <button
      onClick={() => onClick(project)}
      className="w-full border-l-4 border-l-blue-500 dark:border-l-blue-400 bg-white dark:bg-gray-700 rounded-lg p-3 mb-2 shadow-sm hover:shadow-lg hover:border-l-blue-600 dark:hover:border-l-blue-300 hover:bg-indigo-50 dark:hover:bg-gray-600 transition-all cursor-pointer text-left"
    >
      <h3 className="font-semibold text-gray-800 dark:text-white text-xs mb-1 truncate">
        {project.title}
      </h3>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 truncate">{project.client}</p>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-blue-600">
          {Number(project.hours).toFixed(1)}h
        </span>
        <span
          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            project.chargeable
              ? "bg-emerald-100 text-emerald-700"
              : "bg-amber-100 text-amber-700"
          }`}
        >
          {project.chargeable ? "Charge" : "Non-ch"}
        </span>
      </div>
      <p className="text-xs text-gray-400 dark:text-gray-500 truncate">ID: {project.reference}</p>
    </button>
  );
}
