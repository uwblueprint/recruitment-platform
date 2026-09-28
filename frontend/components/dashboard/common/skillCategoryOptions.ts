import { SkillCategory } from "@/graphql/typeUtils";

import type { DashboardStatusChipOption } from "./DashboardStatusChip";

/**
 * Shared option set for the skill-category chip used in the review dashboard
 * side panel. Every category uses the same style today; per-category styling
 * only needs a className tweak here.
 */
export const SKILL_CATEGORY_OPTIONS: readonly DashboardStatusChipOption<SkillCategory>[] =
  [
    {
      value: SkillCategory.Junior,
      label: "Junior",
      className: "bg-blue-100 text-black",
    },
    {
      value: SkillCategory.Intermediate,
      label: "Intermediate",
      className: "bg-blue-100 text-black",
    },
    {
      value: SkillCategory.Senior,
      label: "Senior",
      className: "bg-blue-100 text-black",
    },
  ];
