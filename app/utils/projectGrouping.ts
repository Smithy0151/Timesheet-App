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
        department: project.Department,
        assignees: [],
        weekCommencingDates: [],
        budgetCategory: project["Budget Category"] || undefined,
        supportTickets: [],
        sprintItems: [],
        adHocNotes: [],
        nonProjectCategory: project["Non-Project Timesheet sub category"] || undefined,
      };
    }

    // Aggregate hours and days
    monthlyProjects[month][key].hours += project["Time Spent in Hours"];
    monthlyProjects[month][key].days += project["Time spent in days"];

    // Collect unique assignees
    if (project["Timesheet of User"] && project["Timesheet of User"].trim()) {
      const assignees = monthlyProjects[month][key].assignees;
      if (!assignees.includes(project["Timesheet of User"])) {
        assignees.push(project["Timesheet of User"]);
      }
    }

    // Collect unique week commencing dates
    if (project["Timesheet W/C"] && project["Timesheet W/C"] > 0) {
      const dates = monthlyProjects[month][key].weekCommencingDates;
      if (!dates.includes(project["Timesheet W/C"])) {
        dates.push(project["Timesheet W/C"]);
      }
    }

    // Collect unique support tickets
    if (project["Support ticket reference"] && project["Support ticket reference"].trim()) {
      const tickets = monthlyProjects[month][key].supportTickets;
      if (!tickets.includes(project["Support ticket reference"])) {
        tickets.push(project["Support ticket reference"]);
      }
    }

    // Collect unique sprint items
    if (project["Sprint Item name"] && project["Sprint Item name"].trim()) {
      const sprints = monthlyProjects[month][key].sprintItems;
      if (!sprints.includes(project["Sprint Item name"])) {
        sprints.push(project["Sprint Item name"]);
      }
    }

    // Collect unique ad-hoc notes
    if (project["Ad-hoc notes"] && project["Ad-hoc notes"].trim()) {
      const notes = monthlyProjects[month][key].adHocNotes;
      if (!notes.includes(project["Ad-hoc notes"])) {
        notes.push(project["Ad-hoc notes"]);
      }
    }
  });

  // Populate the grouped structure
  Object.entries(monthlyProjects).forEach(([month, projectsMap]) => {
    const quarter = getQuarter(month);
    const projectArray = Object.values(projectsMap);
    grouped[quarter][month] = projectArray;
  });

  return grouped;
}
