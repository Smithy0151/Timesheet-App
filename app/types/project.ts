export interface ProjectRecord {
  Client: string;
  Department: string;
  "Timesheet of User": string;
  "Timesheet W/C": number;
  Month: string;
  Year: string;
  "Project Manager": string;
  "Project Reference": string;
  "Project Title": string;
  "Category of Time": string;
  Chargeable: string;
  Overhead: string;
  "Budget Category": string;
  "Ad-hoc notes": string;
  "Time Spent in Hours": number;
  "Time Spent in Days": number;
}

export interface AggregatedProject {
  title: string;
  client: string;
  reference: string;
  hours: number;
  days: number;
  chargeable: boolean;
  overhead: boolean;
  category: string;
  projectManager: string;
}

export interface MonthData {
  [monthName: string]: AggregatedProject[];
}

export interface QuarterData {
  [quarter: string]: MonthData;
}

export interface GroupedProjects {
  [quarter: string]: {
    [month: string]: AggregatedProject[];
  };
}
