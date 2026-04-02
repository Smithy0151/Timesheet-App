"use client";

import { AggregatedProject } from "@/app/types/project";

interface ProjectModalProps {
  project: AggregatedProject | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectModal({
  project,
  isOpen,
  onClose,
}: ProjectModalProps) {
  if (!isOpen || !project) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-y-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white p-6 flex justify-between items-start">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">{project.title}</h2>
              <p className="text-indigo-100">{project.client}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-indigo-100 transition-colors text-2xl leading-none"
              aria-label="Close modal"
            >
              ×
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="grid grid-cols-2 gap-6 mb-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Reference
                  </label>
                  <p className="text-gray-900 font-mono">{project.reference}</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Project Manager
                  </label>
                  <p className="text-gray-900">{project.projectManager}</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Category
                  </label>
                  <p className="text-gray-900">{project.category}</p>
                </div>

                {project.budgetCategory && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Budget Category
                    </label>
                    <p className="text-gray-900">{project.budgetCategory}</p>
                  </div>
                )}

                {project.nonProjectCategory && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Non-Project Category
                    </label>
                    <p className="text-gray-900">{project.nonProjectCategory}</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Type
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        project.chargeable
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {project.chargeable ? "Chargeable" : "Non-Chargeable"}
                    </span>
                    {project.overhead && (
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700">
                        Overhead
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Total Hours
                  </label>
                  <p className="text-3xl font-bold text-indigo-600">
                    {Number(project.hours).toFixed(1)}h
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Days
                  </label>
                  <p className="text-gray-900">{Number(project.days).toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* Support Tickets */}
            {project.supportTickets.length > 0 && (
              <div className="mb-6 pb-6 border-b border-gray-200">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Support Tickets
                </label>
                <div className="flex flex-wrap gap-2">
                  {project.supportTickets.map((ticket, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-blue-50 border border-blue-200 text-blue-700 rounded-full text-sm font-mono"
                    >
                      {ticket}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Sprint Items */}
            {project.sprintItems.length > 0 && (
              <div className="mb-6 pb-6 border-b border-gray-200">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Sprint Items
                </label>
                <ul className="space-y-1">
                  {project.sprintItems.map((sprint, idx) => (
                    <li key={idx} className="text-gray-700 text-sm flex items-start">
                      <span className="mr-2">•</span>
                      <span>{sprint}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Ad-hoc Notes */}
            {project.adHocNotes.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Notes
                </label>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 space-y-2">
                  {project.adHocNotes.map((note, idx) => (
                    <p key={idx} className="text-gray-700 text-sm italic">
                      "{note}"
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 border-t border-gray-200 p-4 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
