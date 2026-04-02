"use client";

import { useState, useRef } from "react";
import { useProjectData } from "@/app/hooks/useProjectData";
import { AggregatedProject } from "@/app/types/project";
import YearSelector from "./YearSelector";
import DepartmentSelector from "./DepartmentSelector";
import QuarterSection from "./QuarterSection";
import ProjectModal from "./ProjectModal";

export default function ProjectDashboard() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedDepartment, setSelectedDepartment] = useState("Concerto");
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [selectedProject, setSelectedProject] = useState<AggregatedProject | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data, loading, error, refetch } = useProjectData(selectedYear, selectedDepartment);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/excel", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Upload failed");
      }

      setUploadMessage({
        type: "success",
        text: "File uploaded successfully! Refreshing data...",
      });

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Refresh the data
      setTimeout(() => {
        refetch();
        setUploadMessage(null);
      }, 1500);
    } catch (err) {
      setUploadMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Upload failed",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleProjectClick = (project: AggregatedProject) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

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

        <div className="flex gap-8 mb-6">
          <YearSelector selectedYear={selectedYear} onYearChange={setSelectedYear} />
          <DepartmentSelector
            selectedDepartment={selectedDepartment}
            onDepartmentChange={setSelectedDepartment}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Excel File
            </label>
            <div className="flex gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {uploading ? "Uploading..." : "Upload Excel"}
              </button>
            </div>
          </div>
        </div>

        {uploadMessage && (
          <div
            className={`rounded-lg p-4 mb-4 ${
              uploadMessage.type === "success"
                ? "bg-green-50 border border-green-200"
                : "bg-red-50 border border-red-200"
            }`}
          >
            <p
              className={`font-semibold ${
                uploadMessage.type === "success"
                  ? "text-green-800"
                  : "text-red-800"
              }`}
            >
              {uploadMessage.text}
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
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
              <QuarterSection
                key={quarter}
                quarter={quarter}
                months={months}
                onProjectClick={handleProjectClick}
              />
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

      <ProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
