"use client";

import { MonthData, AggregatedProject } from "@/app/types/project";
import MonthColumn from "./MonthColumn";

interface QuarterSectionProps {
  quarter: string;
  months: MonthData;
  onProjectClick: (project: AggregatedProject) => void;
}

export default function QuarterSection({
  quarter,
  months,
  onProjectClick,
}: QuarterSectionProps) {
  const monthNames = Object.keys(months);

  return (
    <div className="flex flex-col gap-0 w-full">
      <div className="bg-gradient-to-r from-indigo-600 dark:from-indigo-700 to-indigo-700 dark:to-indigo-800 text-white p-3 mb-2 rounded-lg shadow-lg text-center">
        <h2 className="text-xl font-bold tracking-wide">{quarter}</h2>
      </div>
      <div className="flex gap-3 p-2 w-full">
        {monthNames.map((month) => (
          <MonthColumn
            key={month}
            month={month}
            projects={months[month]}
            onProjectClick={onProjectClick}
          />
        ))}
      </div>
    </div>
  );
}
