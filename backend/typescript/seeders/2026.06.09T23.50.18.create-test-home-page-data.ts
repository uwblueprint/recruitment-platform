import { DataTypes, Op } from "sequelize";
import { v4 } from "uuid";
import type { Seeder } from "../umzug-seed";
import { generateApplicantSeedBundles } from "./factories/applicantSeedBundleFactory";
import { ReviewStatusEnum } from "../types/reviewedApplicantRecord";
import { InterviewStatusEnum } from "../types/interviewedApplicantRecord";
import { InterviewGroupStatusEnum } from "../types/interviewGroup";

/** Tell Sequelize how to escape jsonb[] / jsonb columns when using queryInterface.bulkInsert.
 * (Runtime accepts this map; Sequelize 6.5 typings only list string|string[] for the 4th argument.)
 */
const APPLICANT_BULK_INSERT_FIELD_TYPES = {
  short_answer_questions: {
    type: new DataTypes.ARRAY(DataTypes.JSONB),
  },
};

const APPLICANT_RECORD_BULK_INSERT_FIELD_TYPES = {
  role_specific_questions: {
    type: new DataTypes.ARRAY(DataTypes.JSONB),
  },
};

const SEED_EMAIL_PREFIX = "real-data-test-home-page";
const SEED_SCHEDULING_LINK_PREFIX = `${SEED_EMAIL_PREFIX}-scheduling-`;

/** First user created via Google OAuth in a fresh dev environment. Lets the
 * /home page show data for whichever Blueprint member logs in locally. */
const HOME_USER_ID = 1;

/** Existing "Reviewer 1" test user (seeded by create-test-reviewed-applicant-records),
 * reused here as the second interviewer in a paired interview group. */
const PARTNER_USER_ID = 9999995;

const REVIEW_STATUSES = [
  ReviewStatusEnum.TODO,
  ReviewStatusEnum.IN_PROGRESS,
  ReviewStatusEnum.DONE,
] as const;

const INTERVIEW_STATUSES = [
  InterviewStatusEnum.NEEDS_REVIEW,
  InterviewStatusEnum.IN_PROGRESS,
  InterviewStatusEnum.COMPLETE,
] as const;

const GROUP_STATUSES = [
  InterviewGroupStatusEnum.INVITES_SENT,
  InterviewGroupStatusEnum.READY_TO_INTERVIEW,
] as const;

type ReviewDTO = {
  passionFSG: number;
  teamPlayer: number;
  desireToLearn: number;
  skill: number;
  skillCategory: string;
  comments: string;
};

const getReviewDTO = (): ReviewDTO => {
  return {
    passionFSG: Math.floor(Math.random() * 5) + 1,
    teamPlayer: Math.floor(Math.random() * 5) + 1,
    desireToLearn: Math.floor(Math.random() * 5) + 1,
    skill: Math.floor(Math.random() * 5) + 1,
    skillCategory: ["JUNIOR", "INTERMEDIATE", "SENIOR"][
      Math.floor(Math.random() * 3)
    ],
    comments: [
      "Great applicant!",
      "Good applicant!",
      "Average applicant!",
      "Bad applicant!",
    ][Math.floor(Math.random() * 4)],
  };
};

export const up: Seeder = async ({ context: sequelize }) => {
  const seedData = generateApplicantSeedBundles(SEED_EMAIL_PREFIX, 3);

  const applicants = seedData.map((s) => s.applicant);
  const firstChoiceApplicantRecords = seedData.map(
    (s) => s.firstChoiceApplicantRecord,
  );
  const secondChoiceApplicantRecords = seedData.flatMap((s) =>
    s.secondChoiceApplicantRecord ? [s.secondChoiceApplicantRecord] : [],
  );

  // "Application Review" tab: HOME_USER_ID is the reviewer for each first-choice record.
  const reviewedApplicantRecords = firstChoiceApplicantRecords.map(
    (record, index) => ({
      applicant_record_id: record.id,
      reviewer_id: HOME_USER_ID,
      review: JSON.stringify(getReviewDTO()),
      status: REVIEW_STATUSES[index % REVIEW_STATUSES.length],
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
  );

  // "Interview Review" tab: one interviewed_applicant_record per first-choice record.
  const interviewedApplicantRecords = firstChoiceApplicantRecords.map(
    (record, index) => ({
      id: v4(),
      applicant_record_id: record.id,
      score: null,
      interview_json: null,
      status: INTERVIEW_STATUSES[index % INTERVIEW_STATUSES.length],
      interview_date: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
  );

  // "Interview Pairing" tab: one paired group, one solo group, both including HOME_USER_ID.
  const interviewGroups = GROUP_STATUSES.map((status, index) => ({
    id: v4(),
    scheduling_link: `${SEED_SCHEDULING_LINK_PREFIX}${index + 1}`,
    status,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  const interviewDelegations = [
    {
      interviewed_applicant_record_id: interviewedApplicantRecords[0].id,
      interviewer_id: HOME_USER_ID,
      group_id: interviewGroups[0].id,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      interviewed_applicant_record_id: interviewedApplicantRecords[0].id,
      interviewer_id: PARTNER_USER_ID,
      group_id: interviewGroups[0].id,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      interviewed_applicant_record_id: interviewedApplicantRecords[1].id,
      interviewer_id: HOME_USER_ID,
      group_id: interviewGroups[0].id,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      interviewed_applicant_record_id: interviewedApplicantRecords[1].id,
      interviewer_id: PARTNER_USER_ID,
      group_id: interviewGroups[0].id,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      interviewed_applicant_record_id: interviewedApplicantRecords[2].id,
      interviewer_id: HOME_USER_ID,
      group_id: interviewGroups[1].id,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const t = await sequelize.transaction();
  try {
    await sequelize
      .getQueryInterface()
      .bulkInsert(
        "applicants",
        applicants,
        { transaction: t },
        APPLICANT_BULK_INSERT_FIELD_TYPES as never,
      );
    await sequelize
      .getQueryInterface()
      .bulkInsert(
        "applicant_records",
        firstChoiceApplicantRecords,
        { transaction: t },
        APPLICANT_RECORD_BULK_INSERT_FIELD_TYPES as never,
      );
    await sequelize
      .getQueryInterface()
      .bulkInsert(
        "applicant_records",
        secondChoiceApplicantRecords,
        { transaction: t },
        APPLICANT_RECORD_BULK_INSERT_FIELD_TYPES as never,
      );

    await sequelize
      .getQueryInterface()
      .bulkInsert("reviewed_applicant_records", reviewedApplicantRecords, {
        transaction: t,
      });

    await sequelize
      .getQueryInterface()
      .bulkInsert(
        "interviewed_applicant_records",
        interviewedApplicantRecords,
        { transaction: t },
      );

    await sequelize
      .getQueryInterface()
      .bulkInsert("interview_groups", interviewGroups, { transaction: t });

    await sequelize
      .getQueryInterface()
      .bulkInsert("interview_delegations", interviewDelegations, {
        transaction: t,
      });

    await t.commit();
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

export const down: Seeder = async ({ context: sequelize }) => {
  const t = await sequelize.transaction();
  try {
    // Cascade deletes applicant_records, reviewed/interviewed records.
    await sequelize.getQueryInterface().bulkDelete(
      "applicants",
      {
        email: {
          [Op.like]: `${SEED_EMAIL_PREFIX}%`,
        },
      },
      { transaction: t },
    );

    // Cascade deletes interview_delegations.
    await sequelize.getQueryInterface().bulkDelete(
      "interview_groups",
      {
        scheduling_link: {
          [Op.like]: `${SEED_SCHEDULING_LINK_PREFIX}%`,
        },
      },
      { transaction: t },
    );

    await t.commit();
  } catch (e) {
    await t.rollback();
    throw e;
  }
};
