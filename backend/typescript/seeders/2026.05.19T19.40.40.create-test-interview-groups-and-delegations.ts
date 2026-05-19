import { DataTypes, Op } from "sequelize";
import { v4 } from "uuid";
import type { Seeder } from "../umzug-seed";
import { generateApplicantSeedBundles } from "./factories/applicantSeedBundleFactory";
import { InterviewGroupStatusEnum } from "../types/interviewGroup";
import { InterviewStatusEnum } from "../types/interviewedApplicantRecord";

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

const SEED_EMAIL_PREFIX = "real-data-test-interview-group-delegation";
const SEED_SCHEDULING_LINK_PREFIX = `${SEED_EMAIL_PREFIX}-scheduling-`;

const INTERVIEWER_USER_IDS = [10000003, 10000004, 10000005, 10000006] as const;

const GROUP_STATUSES = [
  InterviewGroupStatusEnum.AVAILABILITY_PENDING,
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

type GroupAssignment = {
  groupId: string;
  interviewedApplicantRecordId: string;
  interviewerIds: number[];
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

/** Each group gets 1–2 delegations (solo or pair); never more than two per group. */
const buildGroupAssignments = (
  interviewedApplicantRecordIds: string[],
): GroupAssignment[] => {
  const pairings: number[][] = [
    [INTERVIEWER_USER_IDS[0], INTERVIEWER_USER_IDS[1]],
    [INTERVIEWER_USER_IDS[1], INTERVIEWER_USER_IDS[2]],
    [INTERVIEWER_USER_IDS[2]],
    [INTERVIEWER_USER_IDS[0], INTERVIEWER_USER_IDS[3]],
    [INTERVIEWER_USER_IDS[3]],
  ];

  return interviewedApplicantRecordIds
    .slice(0, pairings.length)
    .map((recordId, index) => ({
      groupId: v4(),
      interviewedApplicantRecordId: recordId,
      interviewerIds: pairings[index],
    }));
};

export const up: Seeder = async ({ context: sequelize }) => {
  const seedData = generateApplicantSeedBundles(SEED_EMAIL_PREFIX, 5);

  const applicants = seedData.map((s) => s.applicant);
  const firstChoiceApplicantRecords = seedData.map(
    (s) => s.firstChoiceApplicantRecord,
  );
  const secondChoiceApplicantRecords = seedData.flatMap((s) =>
    s.secondChoiceApplicantRecord ? [s.secondChoiceApplicantRecord] : [],
  );

  const applicantRecordIds = [
    ...firstChoiceApplicantRecords.map((s) => s.id),
    ...secondChoiceApplicantRecords.map((s) => s.id),
  ];

  const reviewedApplicantRecords = applicantRecordIds.map((id) => ({
    applicant_record_id: id,
    reviewer_id:
      INTERVIEWER_USER_IDS[
        Math.floor(Math.random() * INTERVIEWER_USER_IDS.length)
      ],
    review: JSON.stringify(getReviewDTO()),
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  const interviewedApplicantRecords = firstChoiceApplicantRecords.map(
    (record) => ({
      id: v4(),
      applicant_record_id: record.id,
      score: null,
      interview_json: null,
      status: InterviewStatusEnum.NEEDS_REVIEW,
      interview_date: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
  );

  const groupAssignments = buildGroupAssignments(
    interviewedApplicantRecords.map((record) => record.id),
  );

  const interviewGroups = groupAssignments.map((assignment, index) => ({
    id: assignment.groupId,
    scheduling_link: `${SEED_SCHEDULING_LINK_PREFIX}${index + 1}`,
    status: GROUP_STATUSES[index % GROUP_STATUSES.length],
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  const interviewDelegations = groupAssignments.flatMap((assignment) =>
    assignment.interviewerIds.map((interviewerId) => ({
      interviewed_applicant_record_id: assignment.interviewedApplicantRecordId,
      interviewer_id: interviewerId,
      group_id: assignment.groupId,
      createdAt: new Date(),
      updatedAt: new Date(),
    })),
  );

  const t = await sequelize.transaction();
  try {
    await sequelize.getQueryInterface().bulkInsert(
      "users",
      INTERVIEWER_USER_IDS.map((id, index) => ({
        id,
        first_name: `Interviewer ${index + 1}`,
        last_name: `Interviewer ${index + 1}`,
        auth_id: `${SEED_EMAIL_PREFIX}${index + 1}@example.com`,
        role: "User",
        email: `${SEED_EMAIL_PREFIX}${index + 1}@example.com`,
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
      { transaction: t },
    );

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
        {
          transaction: t,
        },
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
    // Cascade deletes applicant_records, reviewed/interviewed records, and delegations.
    await sequelize.getQueryInterface().bulkDelete(
      "applicants",
      {
        email: {
          [Op.like]: `${SEED_EMAIL_PREFIX}%`,
        },
      },
      { transaction: t },
    );

    await sequelize.getQueryInterface().bulkDelete(
      "interview_groups",
      {
        scheduling_link: {
          [Op.like]: `${SEED_SCHEDULING_LINK_PREFIX}%`,
        },
      },
      { transaction: t },
    );

    await sequelize.getQueryInterface().bulkDelete(
      "users",
      {
        auth_id: {
          [Op.like]: `${SEED_EMAIL_PREFIX}%`,
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
