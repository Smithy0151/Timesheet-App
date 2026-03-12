"use client";

import { useState } from "react";
import { useProjectData } from "@/app/hooks/useProjectData";
import YearSelector from "./YearSelector";
import DepartmentSelector from "./DepartmentSelector";
import QuarterSection from "./QuarterSection";

export default function ProjectDashboard() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedDepartment, setSelectedDepartment] = useState("Concerto");

  const { data, loading, error } = useProjectData(selectedYear, selectedDepartment);

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <div className="bg-white border-b border-gray-200 p-6 shadow-sm">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-1">
            Project Dashboard
          </h1>
          <p className="text-gray-600">
            View projects grouped by quarter and month
          </p>
        </div>

        <div className="flex gap-8">
          <YearSelector selectedYear={selectedYear} onYearChange={setSelectedYear} />
          <DepartmentSelector
            selectedDepartment={selectedDepartment}
            onDepartmentChange={setSelectedDepartment}
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
            <p className="text-red-800 font-semibold">Error loading projects</p>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-auto bg-gray-100">
        {loading && (
          <div className="flex justify-center items-center h-full">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600"></div>
              <p className="mt-4 text-gray-600 font-medium">Loading projects...</p>
            </div>
          </div>
        )}

        {data && !loading && (
          <div className="flex flex-col gap-6 p-6">
            {Object.entries(data).map(([quarter, months]) => (
              <QuarterSection key={quarter} quarter={quarter} months={months} />
            ))}
          </div>
        )}

        {data &&
          !loading &&
          Object.values(data).every(
            (quarter) =>
              Object.values(quarter).every((projects) => projects.length === 0)
          ) && (
            <div className="flex justify-center items-center h-full">
              <p className="text-gray-500 text-lg">
                No projects found for {selectedYear}
              </p>
            </div>
          )}
      </div>
    </div>
  );
}
