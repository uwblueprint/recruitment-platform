import { ApplicationStatus, SkillCategory } from "@/graphql/typeUtils";
import type { FilterCategory } from "@/components/dashboard/filters";

export const REVIEW_FILTER_CATEGORY_KEYS = {
  POSITION: "position",
  APPLICATION_STATUS: "applicationStatus",
  SKILL_CATEGORY: "skillCategory",
  SCORE_RANGE: "scoreRange",
  YEAR: "year",
  BOOKMARKED: "bookmarked",
} as const;

// Placeholder until the backend exposes a dynamic, department-scoped positions
// query (see Support Dashboard Filtering ticket); mirrors the current seed data.
const PLACEHOLDER_POSITION_OPTIONS = [
  "Project Lead",
  "Developer",
  "VP Engineering",
  "Designer",
  "VP Design",
  "Product Manager",
  "VP Product",
  "President",
  "VP Scoping",
  "VP Talent",
  "VP Finance",
  "Director Lead",
  "Internal Director",
  "External Director",
  "Content Strategist",
  "Graphic Designer",
].map((title) => ({ value: title, label: title }));

const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  [ApplicationStatus.Applied]: "Applied",
  [ApplicationStatus.InReview]: "In Review",
  [ApplicationStatus.Reviewed]: "Reviewed",
  [ApplicationStatus.Selected]: "Selected",
  [ApplicationStatus.Interviewed]: "Interviewed",
  [ApplicationStatus.Offered]: "Offered",
  [ApplicationStatus.Rejected]: "Rejected",
};

const SKILL_CATEGORY_LABELS: Record<SkillCategory, string> = {
  [SkillCategory.Junior]: "Junior",
  [SkillCategory.Intermediate]: "Intermediate",
  [SkillCategory.Senior]: "Senior",
};

export const SCORE_RANGE_OPTIONS = [
  { value: "gte_25", label: "> 25" },
  { value: "20_25", label: "20 - 25" },
  { value: "15_20", label: "15 - 20" },
  { value: "lt_15", label: "< 15" },
];

// Standard year values; not yet backed by a distinct-values query.
const YEAR_OPTIONS = ["1st year", "2nd year", "3rd year", "4th+ year"].map((year) => ({
  value: year,
  label: year,
}));

const BOOKMARKED_OPTIONS = [{ value: "true", label: "Bookmarked" }];

export const REVIEW_FILTER_CATEGORIES: FilterCategory[] = [
  {
    key: REVIEW_FILTER_CATEGORY_KEYS.POSITION,
    label: "Role",
    options: PLACEHOLDER_POSITION_OPTIONS,
  },
  {
    key: REVIEW_FILTER_CATEGORY_KEYS.APPLICATION_STATUS,
    label: "Application Status",
    options: Object.values(ApplicationStatus).map((status) => ({
      value: status,
      label: APPLICATION_STATUS_LABELS[status],
    })),
  },
  {
    key: REVIEW_FILTER_CATEGORY_KEYS.SKILL_CATEGORY,
    label: "Skill Category",
    options: Object.values(SkillCategory).map((skillCategory) => ({
      value: skillCategory,
      label: SKILL_CATEGORY_LABELS[skillCategory],
    })),
  },
  {
    key: REVIEW_FILTER_CATEGORY_KEYS.SCORE_RANGE,
    label: "Score",
    options: SCORE_RANGE_OPTIONS,
  },
  {
    key: REVIEW_FILTER_CATEGORY_KEYS.YEAR,
    label: "Year",
    options: YEAR_OPTIONS,
  },
  {
    key: REVIEW_FILTER_CATEGORY_KEYS.BOOKMARKED,
    label: "Bookmarked",
    options: BOOKMARKED_OPTIONS,
  },
];
