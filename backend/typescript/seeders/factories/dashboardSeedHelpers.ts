import { DataTypes } from "sequelize";
import { SkillCategory, SkillCategoryEnum } from "../../types/applicantRecord";
import { Interview } from "../../types/interviewedApplicantRecord";

/** Tell Sequelize how to escape jsonb[] columns when using queryInterface.bulkInsert.
 * (Runtime accepts this map; Sequelize 6.5 typings only list string|string[] for the 4th argument.)
 */
export const APPLICANT_BULK_INSERT_FIELD_TYPES = {
  short_answer_questions: {
    type: new DataTypes.ARRAY(DataTypes.JSONB),
  },
};

export const APPLICANT_RECORD_BULK_INSERT_FIELD_TYPES = {
  role_specific_questions: {
    type: new DataTypes.ARRAY(DataTypes.JSONB),
  },
};

/**
 * Split an interview total (4-20) into four rubric fields each in [1,5], so the
 * stored interview_json is consistent with how the app derives the score
 * (passionFSG + teamPlayer + desireToLearn + skill).
 *
 * A completed interview always records a skill category (the assessment form
 * requires one), so it defaults to INTERMEDIATE when the applicant record has none.
 */
export const interviewFromScore = (
  score: number,
  comments: string,
  skillCategory: SkillCategory = SkillCategoryEnum.INTERMEDIATE,
): Interview => {
  const base = Math.floor(score / 4);
  const remainder = score - base * 4;
  const fields = [0, 1, 2, 3].map((i) => base + (i < remainder ? 1 : 0));
  const [passionFSG, teamPlayer, desireToLearn, skill] = fields;
  return {
    passionFSG,
    teamPlayer,
    desireToLearn,
    skill,
    skillCategory,
    comments,
  };
};
