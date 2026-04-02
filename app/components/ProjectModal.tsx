"use client";

import { useState } from "react";
import { AggregatedProject } from "@/app/types/project";

interface ProjectModalProps {
  project: AggregatedProject | null;
  isOpen: boolean;
  onClose: () => void;
}

const formatDate = (timestamp: number): string => {
  if (!timestamp) return "N/A";
  try {
    return new Date(timestamp * 1000).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "N/A";
  }
};

export default function ProjectModal({
  project,
  isOpen,
  onClose,
}: ProjectModalProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "details" | "notes">(
    "overview"
  );

  if (!isOpen || !project) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-40 z-40 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-300">
          {/* Header */}
          <div className="relative bg-gradient-to-br from-indigo-600 via-indigo-600 to-purple-600 text-white p-8">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all"
              aria-label="Close modal"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="pr-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-3xl font-bold mb-2">{project.title}</h2>
                  <p className="text-indigo-100 text-lg">{project.client}</p>
                </div>
                <div className="flex gap-2">
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      project.chargeable
                        ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
                        : "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300"
                    }`}
                  >
                    {project.chargeable ? "Chargeable" : "Non-Chargeable"}
                  </span>
                  {project.overhead && (
                    <span className="px-4 py-2 rounded-full text-sm font-semibold bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300">
                      Overhead
                    </span>
                  )}
                </div>
              </div>

              {/* Project Reference */}
              <div className="flex items-center gap-2 text-indigo-100">
                <span className="opacity-75">REF:</span>
                <code className="text-sm bg-white bg-opacity-20 px-3 py-1 rounded font-mono">
                  {project.reference}
                </code>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-gradient-to-br from-blue-50 dark:from-blue-950 to-indigo-50 dark:to-indigo-900 rounded-xl p-5 border border-blue-100 dark:border-blue-800">
                <p className="text-blue-600 dark:text-blue-400 text-sm font-semibold mb-1">
                  Total Hours
                </p>
                <p className="text-3xl font-bold text-blue-900 dark:text-blue-300">
                  {Number(project.hours).toFixed(1)}
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">hours</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 dark:from-purple-950 to-pink-50 dark:to-pink-900 rounded-xl p-5 border border-purple-100 dark:border-purple-800">
                <p className="text-purple-600 dark:text-purple-400 text-sm font-semibold mb-1">
                  Days Allocated
                </p>
                <p className="text-3xl font-bold text-purple-900 dark:text-purple-300">
                  {Number(project.days).toFixed(2)}
                </p>
                <p className="text-xs text-purple-600 dark:text-purple-400 mt-2">days</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 dark:from-green-950 to-emerald-50 dark:to-emerald-900 rounded-xl p-5 border border-green-100 dark:border-green-800">
                <p className="text-green-600 dark:text-green-400 text-sm font-semibold mb-1">
                  Team Members
                </p>
                <p className="text-3xl font-bold text-green-900 dark:text-green-300">
                  {project.assignees.length}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-2">assigned</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
              <div className="flex gap-1">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`px-4 py-3 font-semibold text-sm border-b-2 transition-all ${
                    activeTab === "overview"
                      ? "border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400"
                      : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab("details")}
                  className={`px-4 py-3 font-semibold text-sm border-b-2 transition-all ${
                    activeTab === "details"
                      ? "border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400"
                      : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
                  }`}
                >
                  Details
                </button>
                {(project.sprintItems.length > 0 ||
                  project.supportTickets.length > 0 ||
                  project.adHocNotes.length > 0) && (
                  <button
                    onClick={() => setActiveTab("notes")}
                    className={`px-4 py-3 font-semibold text-sm border-b-2 transition-all ${
                      activeTab === "notes"
                        ? "border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400"
                        : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
                    }`}
                  >
                    Work & Notes
                  </button>
                )}
              </div>
            </div>

            {/* Tab Content */}
            <div className="overflow-y-auto max-h-80">
              {/* Overview Tab */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                        Project Manager
                      </label>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {project.projectManager}
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                        Department
                      </label>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {project.department}
                      </p>
                    </div>
                  </div>

                  {/* Assignees */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                      Team Members ({project.assignees.length})
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {project.assignees.length > 0 ? (
                        project.assignees.map((assignee, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-gradient-to-r from-indigo-100 dark:from-indigo-900 to-purple-100 dark:to-purple-900 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium border border-indigo-200 dark:border-indigo-700"
                          >
                            {assignee}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400 text-sm">
                          No assignees
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Timeline */}
                  {project.weekCommencingDates.length > 0 && (
                    <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                      Work Weeks
                    </label>
                      <div className="flex flex-wrap gap-2">
                        {project.weekCommencingDates.map((date, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs font-mono border border-gray-200 dark:border-gray-600"
                          >
                            {formatDate(date)}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Details Tab */}
              {activeTab === "details" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                        Category
                      </label>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {project.category}
                      </p>
                    </div>
                    {project.budgetCategory && (
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                          Budget Category
                        </label>
                        <p className="text-gray-900 dark:text-white font-medium">
                          {project.budgetCategory}
                        </p>
                      </div>
                    )}
                  </div>

                  {project.nonProjectCategory && (
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                        Non-Project Category
                      </label>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {project.nonProjectCategory}
                      </p>
                    </div>
                  )}

                  {project.supportTickets.length > 0 && (
                    <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                      Support Tickets ({project.supportTickets.length})
                    </label>
                      <div className="flex flex-wrap gap-2">
                        {project.supportTickets.map((ticket, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-mono border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
                          >
                            {ticket}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Notes Tab */}
              {activeTab === "notes" && (
                <div className="space-y-6">
                  {project.sprintItems.length > 0 && (
                    <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                      Sprint Items ({project.sprintItems.length})
                    </label>
                      <div className="space-y-2">
                        {project.sprintItems.map((sprint, idx) => (
                          <div
                            key={idx}
                            className="p-3 bg-gradient-to-r from-amber-50 dark:from-amber-950 to-orange-50 dark:to-orange-950 rounded-lg border border-amber-200 dark:border-amber-800 flex items-start gap-3"
                          >
                            <span className="text-amber-600 dark:text-amber-400 font-bold flex-shrink-0">
                              ✓
                            </span>
                            <span className="text-gray-700 dark:text-gray-300 text-sm">
                              {sprint}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {project.adHocNotes.length > 0 && (
                    <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                      Notes ({project.adHocNotes.length})
                    </label>
                      <div className="space-y-2">
                        {project.adHocNotes.map((note, idx) => (
                          <div
                            key={idx}
                            className="p-3 bg-gradient-to-r from-slate-50 dark:from-slate-900 to-gray-50 dark:to-gray-900 rounded-lg border border-slate-200 dark:border-slate-700 italic text-gray-700 dark:text-gray-300 text-sm"
                          >
                            "{note}"
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 dark:from-gray-900 to-gray-100 dark:to-gray-800 p-6 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-all font-semibold border border-gray-300 dark:border-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
