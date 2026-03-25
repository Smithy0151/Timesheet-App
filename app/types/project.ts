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
  "Non-Project Timesheet sub category": string;
  Chargeable: string;
  Overhead: string;
  "Budget Category": string;
  "Support ticket reference": string;
  "Sprint Item name": string;
  "Ad-hoc notes": string;
  "Time Spent in Hours": number;
  "Time spent in days": number;
}

export interface TimesheetRecord {
  id?: number;
  created_at?: string;
  client: string;
  department: string;
  timesheet_user: string;
  timesheet_wc: number;
  month: string;
  year: string;
  project_manager: string;
  project_reference: string;
  project_title: string;
  category_of_time: string;
  non_project_timesheet_sub_category: string;
  chargeable: boolean;
  overhead: boolean;
  budget_category: string;
  support_ticket_reference: string;
  sprint_item_name: string;
  ad_hoc_notes: string;
  time_spent_hours: number;
  time_spent_days: number;
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
