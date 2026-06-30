import { SkillCategory } from "@/graphql/typeUtils";

const SKILL_CATEGORY_LABELS: Record<SkillCategory, string> = {
  [SkillCategory.Junior]: "Junior",
  [SkillCategory.Intermediate]: "Intermediate",
  [SkillCategory.Senior]: "Senior",
};

type SidePanelSkillCategoryChipProps = {
  category: SkillCategory | null | undefined;
};

export const SidePanelSkillCategoryChip = ({
  category,
}: SidePanelSkillCategoryChipProps) => (
  <span className="inline-flex h-7 min-w-[112px] items-center justify-center rounded bg-blue-100 px-4 py-1 text-center font-source text-xs text-black">
    {category ? SKILL_CATEGORY_LABELS[category] : "Skill Category"}
  </span>
);
