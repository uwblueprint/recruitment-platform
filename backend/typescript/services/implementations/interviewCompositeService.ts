import { Op } from "sequelize";
import User from "../../models/user.model";
import InterviewedApplicantRecord from "../../models/interviewedApplicantRecord.model";
import {
  CreateInterviewDelegationDTO,
  ApplicationStatusEnum,
  InterviewDashboardRowDTO,
  InterviewDelegationDTO,
  InterviewInviteDTO,
  InterviewInviteeDTO,
  InterviewedApplicantsDTO,
  InterviewGroupStatusEnum,
  InterviewPairingsDTO,
  UserDTO,
} from "../../types";
import {
  toInterviewDashboardRowDTO,
  toInterviewedApplicantDTO,
  toUserDTO,
} from "../../utilities/dtoUtils";
import { getErrorMessage } from "../../utilities/errorUtils";
import logger from "../../utilities/logger";
import IInterviewCompositeService from "../interfaces/IInterviewCompositeService";
import InterviewDelegationService from "./interviewDelegationService";
import InterviewGroupService from "./interviewGroupService";
import IInterviewDelegationService from "../interfaces/IInterviewDelegationService";
import IInterviewGroupService from "../interfaces/IInterviewGroupService";
import InterviewDelegation from "../../models/interviewDelegation.model";
import ApplicantRecord from "../../models/applicantRecord.model";
import Applicant from "../../models/applicant.model";
import InterviewGroup from "../../models/interviewGroup.model";

const Logger = logger(__filename);

const interviewDelegationsService: IInterviewDelegationService = new InterviewDelegationService();

const interviewGroupService: IInterviewGroupService = new InterviewGroupService();

type InterviewerAssignment = {
  interviewedApplicantRecordId: string;
  interviewer1?: number;
  interviewer2?: number;
};

/** Assign a unique key to each interviewer group - this should be indifferent to ordering of the interviewers. */
function interviewerTeamKey(a: InterviewerAssignment): string {
  const ids = [a.interviewer1, a.interviewer2].filter(
    (x): x is number => x !== undefined,
  );
  if (ids.length === 0) {
    throw new Error(
      "No interviewers assigned to this interviewed applicant record.",
    );
  }
  if (ids.length === 1) {
    return `solo:${ids[0]}`;
  }

  // Order the interviewers so that the smaller ID is first.
  const [x, y] = ids[0] <= ids[1] ? [ids[0], ids[1]] : [ids[1], ids[0]];
  return `pair:${x}|${y}`;
}

function dedupeUsersById(users: User[]): User[] {
  const seen = new Set<number>();
  return users.filter((user) => {
    if (seen.has(user.id)) {
      return false;
    }
    seen.add(user.id);
    return true;
  });
}

class InterviewCompositeService implements IInterviewCompositeService {
  /* eslint-disable class-methods-use-this */
  async getInterviewDashboard(
    pageNumber: number,
    resultsPerPage: number,
  ): Promise<InterviewDashboardRowDTO[]> {
    try {
      if (
        !Number.isInteger(pageNumber) ||
        pageNumber < 1 ||
        !Number.isInteger(resultsPerPage) ||
        resultsPerPage < 1
      ) {
        throw new Error(
          "pageNumber and resultsPerPage must be positive integers",
        );
      }

      const applicantRecords = await ApplicantRecord.findAll({
        attributes: ["id", "position", "status"],
        where: {
          status: {
            [Op.in]: [
              ApplicationStatusEnum.INTERVIEWED,
              ApplicationStatusEnum.SELECTED,
            ],
          },
        },
        include: [
          {
            attributes: ["first_name", "last_name"],
            model: Applicant,
            required: true,
          },
          {
            attributes: ["id", "applicant_record_id", "score"],
            model: InterviewedApplicantRecord,
            as: "interviewed_applicant_record",
            include: [
              {
                attributes: [
                  "interviewed_applicant_record_id",
                  "interviewer_id",
                ],
                model: InterviewDelegation,
                as: "interview_delegations",
                include: [
                  {
                    attributes: [
                      "id",
                      "first_name",
                      "last_name",
                      "email",
                      "position",
                      "role",
                      "is_archived",
                    ],
                    model: User,
                    as: "interviewer",
                  },
                ],
              },
            ],
          },
        ],
        order: [
          ["id", "ASC"],
          [
            {
              model: InterviewedApplicantRecord,
              as: "interviewed_applicant_record",
            },
            { model: InterviewDelegation, as: "interview_delegations" },
            "createdAt",
            "ASC",
          ],
          [
            {
              model: InterviewedApplicantRecord,
              as: "interviewed_applicant_record",
            },
            { model: InterviewDelegation, as: "interview_delegations" },
            "interviewer_id",
            "ASC",
          ],
        ],
        limit: resultsPerPage,
        offset: (pageNumber - 1) * resultsPerPage,
      });

      return applicantRecords.map(toInterviewDashboardRowDTO);
    } catch (error: unknown) {
      Logger.error(
        `Failed to get interview dashboard. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  async getInterviewedApplicantsByUserId(
    userId: string,
  ): Promise<InterviewedApplicantsDTO[]> {
    try {
      const interviewedRecords = await InterviewedApplicantRecord.findAll({
        attributes: ["applicant_record_id", "status"],
        include: [
          {
            model: InterviewDelegation,
            as: "interview_delegations",
            required: true,
            where: { interviewer_id: Number(userId) },
            attributes: [],
          },
          {
            model: ApplicantRecord,
            required: true,
            include: [
              {
                model: Applicant,
                required: true,
                attributes: ["first_name", "last_name"],
              },
            ],
          },
        ],
      });

      return interviewedRecords.map(toInterviewedApplicantDTO);
    } catch (error: unknown) {
      Logger.error(`Failed to fetch. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async getInterviewedPairingsByUserId(
    userId: string,
  ): Promise<InterviewPairingsDTO[]> {
    try {
      const userGroupRows = await InterviewDelegation.findAll({
        where: { interviewer_id: Number(userId) },
        attributes: ["group_id"],
      });

      if (userGroupRows.length === 0) {
        return [];
      }

      // dedupe groupIds, although each groupId should have a unique set of interviewers, the database design does not guarantee this.
      const groupIds = [...new Set(userGroupRows.map((row) => row.group_id))];

      const interviewGroups = await InterviewGroup.findAll({
        where: { id: { [Op.in]: groupIds } },
        attributes: ["id", "status"],
        include: [
          {
            model: InterviewDelegation,
            as: "interview_delegations",
            required: true,
            include: [{ model: User, as: "interviewer" }],
          },
        ],
      });

      return interviewGroups.map((group) => ({
        interviewedGroupId: group.id,
        interviewGroupStatus: group.status,
        groupMembers: dedupeUsersById(
          (group.interview_delegations ?? []).map((d) => d.interviewer),
        ).map((user) => toUserDTO(user)),
      }));
    } catch (error: unknown) {
      Logger.error(`Failed to fetch. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async getInterviewersByGroupId(groupId: string): Promise<UserDTO[]> {
    try {
      const delegations = await InterviewDelegation.findAll({
        where: { group_id: groupId },
        include: {
          model: User,
          as: "interviewer",
        },
      });

      const interviewers = delegations.map(
        (delegation) => delegation.interviewer,
      );
      if (interviewers.length === 0) {
        return [];
      }

      return dedupeUsersById(interviewers).map((user) => toUserDTO(user));
    } catch (error: unknown) {
      Logger.error(
        `Failed to get interview delegations by groupId. Reason = ${getErrorMessage(
          error,
        )}`,
      );
      throw error;
    }
  }

  /**
   * Assignment logic matches {@link ReviewCompositeService.delegateReviewers}:
   * per position, circular user list with `undefined` sentinel when count is odd;
   * each record consumes two consecutive FSM slots for its two interviewers.
   * Interview groups are deduped by interviewer team so identical pairs share `groupId`.
   */
  async delegateInterviewers(
    positions: string[],
  ): Promise<InterviewDelegationDTO[]> {
    try {
      // Get all users by position.
      const groups = (
        await User.findAll({
          attributes: { exclude: ["createdAt", "updatedAt"] },
          where: { position: { [Op.in]: positions } },
        })
      ).reduce((map, user) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const pos = user.position!;
        const arr = map.get(pos) ?? [];
        arr.push(user.id);
        map.set(pos, arr);
        return map;
      }, new Map<string, number[]>());

      // Build the FSM.
      const FSM = new Map<string, [number, (number | undefined)[]]>(
        positions.map((title) => [title, [0, groups.get(title) ?? []]]),
      );

      Array.from(FSM.entries()).forEach(([title, [, userIds]]) => {
        if (userIds.length === 0) {
          throw new Error(`Invalid amount of users with position ${title}.`);
        }
        if (userIds.length % 2 !== 0) {
          userIds.push(undefined);
        }
      });

      // Get all interviewer assignments for the given positions.
      const interviewedApplicantRecords = await InterviewedApplicantRecord.findAll(
        {
          attributes: ["id"],
          include: [
            {
              model: ApplicantRecord,
              attributes: ["position"],
              where: { position: { [Op.in]: positions } },
            },
          ],
        },
      );

      // Round robin the interviewers for each interviewed applicant record.
      const assignments: InterviewerAssignment[] = [];

      interviewedApplicantRecords.forEach((record) => {
        const position = record.applicant_record?.position;
        if (!position || !FSM.has(position)) {
          return;
        }

        /* eslint-disable @typescript-eslint/no-non-null-assertion */
        const [count, userIds] = FSM.get(position)!;
        let newCount = count;
        const assigned1 = FSM.get(position)![1][newCount];
        newCount += 1;
        newCount %= FSM.get(position)![1].length;
        const assigned2 = FSM.get(position)![1][newCount];
        newCount += 1;
        newCount %= FSM.get(position)![1].length;
        FSM.set(position, [newCount, userIds]);

        if (assigned1 === undefined && assigned2 === undefined) {
          return;
        }

        assignments.push({
          interviewedApplicantRecordId: record.id,
          interviewer1: assigned1,
          interviewer2: assigned2,
        });
      });

      if (assignments.length === 0) {
        return [];
      }

      // Dedupe the team keys to avoid creating duplicate interview groups.
      const dedupedTeamKeys = [...new Set(assignments.map(interviewerTeamKey))];

      // Create the interview groups.
      const createdGroups = await interviewGroupService.bulkCreateInterviewGroups(
        dedupedTeamKeys.map(() => ({
          status: InterviewGroupStatusEnum.AVAILABILITY_PENDING,
        })),
      );

      // Map delegated assignments to a singular group ID.
      const groupIdByTeamKey = dedupedTeamKeys.reduce<Record<string, string>>(
        (acc, teamKey, i) => {
          acc[teamKey] = createdGroups[i].id;
          return acc;
        },
        {},
      );

      // Create the interview delegations.
      const delegations: CreateInterviewDelegationDTO[] = assignments.flatMap(
        (a) => {
          const groupId = groupIdByTeamKey[interviewerTeamKey(a)];
          const row: CreateInterviewDelegationDTO[] = [];
          if (a.interviewer1 !== undefined) {
            row.push({
              interviewedApplicantRecordId: a.interviewedApplicantRecordId,
              interviewerId: String(a.interviewer1),
              groupId,
            });
          }
          if (a.interviewer2 !== undefined) {
            row.push({
              interviewedApplicantRecordId: a.interviewedApplicantRecordId,
              interviewerId: String(a.interviewer2),
              groupId,
            });
          }
          return row;
        },
      );

      return await interviewDelegationsService.bulkCreateInterviewDelegations(
        delegations,
      );
    } catch (error: unknown) {
      Logger.error(
        `Failed to delegate interviewers. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  async getInterviewInvites(): Promise<InterviewInviteDTO[]> {
    try {
      // Query 1: groups with interviewers only (avoids deep join collision)
      const groups = await InterviewGroup.findAll({
        include: [
          {
            model: InterviewDelegation,
            as: "interview_delegations",
            required: false,
            separate: true,
            include: [{ model: User, as: "interviewer" }],
          },
        ],
      });

      // Collect all interviewed_applicant_record_ids across all delegations
      const allIarIds = [
        ...new Set(
          groups.flatMap((g) =>
            (g.interview_delegations ?? []).map(
              (d) => d.interviewed_applicant_record_id,
            ),
          ),
        ),
      ];

      // Query 2: load interviewee data for those records
      const iarByRecordId = new Map<string, InterviewedApplicantRecord>();
      if (allIarIds.length > 0) {
        const iars = await InterviewedApplicantRecord.findAll({
          where: { id: { [Op.in]: allIarIds } },
          include: [
            {
              model: ApplicantRecord,
              include: [{ model: Applicant }],
            },
          ],
        });
        iars.forEach((iar) => iarByRecordId.set(iar.id, iar));
      }

      return groups.map((group) => {
        const delegations = group.interview_delegations ?? [];

        const interviewers = dedupeUsersById(
          delegations.map((d) => d.interviewer).filter((u): u is User => !!u),
        ).map((user) => toUserDTO(user));

        const seenApplicantRecordIds = new Set<string>();
        const interviewees: InterviewInviteeDTO[] = delegations
          .map((d) => iarByRecordId.get(d.interviewed_applicant_record_id))
          .filter(
            (iar): iar is InterviewedApplicantRecord =>
              !!iar?.applicant_record?.applicant,
          )
          .filter((iar) => {
            if (seenApplicantRecordIds.has(iar.applicant_record_id))
              return false;
            seenApplicantRecordIds.add(iar.applicant_record_id);
            return true;
          })
          .map((iar) => ({
            firstName: iar.applicant_record.applicant.first_name,
            lastName: iar.applicant_record.applicant.last_name,
            position: iar.applicant_record.position,
          }));

        const position = interviewees[0]?.position ?? "";

        return {
          id: group.id,
          interviewers,
          interviewees,
          position,
          schedulingLink: group.scheduling_link,
          status: group.status,
        };
      });
    } catch (error: unknown) {
      Logger.error(
        `Failed to fetch interview invites. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }
}

export default InterviewCompositeService;
