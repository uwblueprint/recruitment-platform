import { Op, WhereOptions, col, fn, where as whereFn } from "sequelize";
import { ReviewDashboardFilters } from "../types";

// Where clauses shared by the review and interview dashboards. Interview
// dashboard filters are a subset of the review ones, so both accept this type.

export function buildApplicantRecordWhere(
  filters?: ReviewDashboardFilters,
): WhereOptions {
  const where: WhereOptions = {};

  if (filters?.positions?.length) {
    where.position = { [Op.in]: filters.positions };
  }
  if (filters?.applicationStatuses?.length) {
    where.status = { [Op.in]: filters.applicationStatuses };
  }
  if (filters?.skillCategories?.length) {
    where.skill_category = { [Op.in]: filters.skillCategories };
  }
  if (filters?.bookmarked !== undefined) {
    where.is_applicant_flagged = filters.bookmarked;
  }
  if (filters?.scoreRanges?.length) {
    const scoreConditions = filters.scoreRanges.map((range) => {
      if (range === "gt_25") return { combined_review_score: { [Op.gt]: 25 } };
      if (range === "20_25")
        return { combined_review_score: { [Op.between]: [20, 25] } };
      if (range === "15_20")
        return { combined_review_score: { [Op.between]: [15, 20] } };
      if (range === "lt_15") return { combined_review_score: { [Op.lt]: 15 } };
      return {};
    });
    where[(Op.or as unknown) as string] = scoreConditions;
  }

  return where;
}

/** Escapes the LIKE wildcards so a searched "%" matches a literal percent sign. */
function escapeLikeWildcards(term: string): string {
  return term.replace(/[\\%_]/g, (character) => `\\${character}`);
}

export function buildApplicantWhere(
  filters?: ReviewDashboardFilters,
): WhereOptions {
  const where: WhereOptions = {};
  if (filters?.years?.length) {
    where.academic_year = { [Op.in]: filters.years };
  }

  // First and last names are separate columns, so the term is matched against
  // them joined, letting "jane doe" hit as readily as "jane" or "doe".
  const search = filters?.search?.trim().replace(/\s+/g, " ");
  if (search) {
    where[(Op.and as unknown) as string] = whereFn(
      // Qualified because "users" also has first_name/last_name; leaving these
      // bare would go ambiguous the moment the reviewer join stops being separate.
      fn(
        "concat_ws",
        " ",
        col("applicant.first_name"),
        col("applicant.last_name"),
      ),
      { [Op.iLike]: `%${escapeLikeWildcards(search)}%` },
    );
  }

  return where;
}
