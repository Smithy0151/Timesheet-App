"use client";

interface DepartmentSelectorProps {
  selectedDepartment: string;
  onDepartmentChange: (department: string) => void;
}

export default function DepartmentSelector({
  selectedDepartment,
  onDepartmentChange,
}: DepartmentSelectorProps) {
  const departments = ["Concerto", "Mobiess"];

  return (
    <div className="flex items-center gap-3 mb-8">
      <label htmlFor="department-select" className="font-semibold text-gray-900">
        Select Department:
      </label>
      <select
        id="department-select"
        value={selectedDepartment}
        onChange={(e) => onDepartmentChange(e.target.value)}
        className="border border-gray-300 rounded-lg px-4 py-2 text-gray-900 font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        {departments.map((dept) => (
          <option key={dept} value={dept}>
            {dept}
          </option>
        ))}
      </select>
    </div>
  );
}
