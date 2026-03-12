import {
  ProjectRecord,
  AggregatedProject,
  GroupedProjects,
} from "@/app/types/project";

const MONTH_ORDER = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const QUARTERS = {
  Q1: ["January", "February", "March"],
  Q2: ["April", "May", "June"],
  Q3: ["July", "August", "September"],
  Q4: ["October", "November", "December"],
};

export function getQuarter(month: string): string {
  for (const [quarter, months] of Object.entries(QUARTERS)) {
    if (months.includes(month)) {
      return quarter;
    }
  }
  return "Q1";
}

export function groupProjectsByQuarterAndMonth(
  projects: ProjectRecord[]
): GroupedProjects {
  const grouped: GroupedProjects = {
    Q1: { January: [], February: [], March: [] },
    Q2: { April: [], May: [], June: [] },
    Q3: { July: [], August: [], September: [] },
    Q4: { October: [], November: [], December: [] },
  };

  // Create a map to aggregate projects by month and reference
  const monthlyProjects: {
    [key: string]: { [reference: string]: AggregatedProject };
  } = {};

  projects.forEach((project) => {
    const month = project.Month;
    if (!monthlyProjects[month]) {
      monthlyProjects[month] = {};
    }

    const ref = project["Project Reference"];
    const key = `${ref}-${project["Project Title"]}`;

    if (!monthlyProjects[month][key]) {
      monthlyProjects[month][key] = {
        title: project["Project Title"],
        client: project.Client,
        reference: project["Project Reference"],
        hours: 0,
        days: 0,
        chargeable: project.Chargeable === "Yes",
        overhead: project.Overhead === "Yes",
        category: project["Category of Time"],
        projectManager: project["Project Manager"],
      };
    }

    // Aggregate hours and days
    monthlyProjects[month][key].hours += project["Time Spent in Hours"];
    monthlyProjects[month][key].days += project["Time Spent in Days"];
  });

  // Populate the grouped structure
  Object.entries(monthlyProjects).forEach(([month, projectsMap]) => {
    const quarter = getQuarter(month);
    const projectArray = Object.values(projectsMap);
    grouped[quarter][month] = projectArray;
  });

  return grouped;
}
