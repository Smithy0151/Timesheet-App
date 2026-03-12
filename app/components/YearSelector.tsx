"use client";

interface YearSelectorProps {
  selectedYear: number;
  onYearChange: (year: number) => void;
}

export default function YearSelector({
  selectedYear,
  onYearChange,
}: YearSelectorProps) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 7 }, (_, i) => currentYear - 3 + i);

  return (
    <div className="flex items-center gap-3 mb-8">
      <label htmlFor="year-select" className="font-semibold text-gray-900">
        Select Year:
      </label>
      <select
        id="year-select"
        value={selectedYear}
        onChange={(e) => onYearChange(Number(e.target.value))}
        className="border border-gray-300 rounded-lg px-4 py-2 text-gray-900 font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
}
