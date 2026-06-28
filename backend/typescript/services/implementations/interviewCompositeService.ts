import { Op } from "sequelize";
import User from "../../models/user.model";
import InterviewedApplicantRecord from "../../models/interviewedApplicantRecord.model";
import {
  CreateInterviewDelegationDTO,
  Interview,
  InterviewDelegationDTO,
  InterviewedApplicantRecordDTO,
  InterviewedApplicantsDTO,
  InterviewGroupStatusEnum,
  InterviewNotesDTO,
  InterviewPairingsDTO,
  UserDTO,
} from "../../types";
import InterviewedApplicantRecordsService from "./interviewedApplicantRecordService";
import { toInterviewedApplicantDTO, toUserDTO } from "../../utilities/dtoUtils";
import { getErrorMessage } from "../../utilities/errorUtils";
import logger from "../../utilities/logger";
import IInterviewCompositeService from "../interfaces/IInterviewCompositeService";
import FileStorageService from "./fileStorageService";
import FirebaseFileService from "./firebaseFileService";
import InterviewDelegationService from "./interviewDelegationService";
import InterviewGroupService from "./interviewGroupService";
import IFirebaseFileService from "../interfaces/IFirebaseFileService";
import IInterviewDelegationService from "../interfaces/IInterviewDelegationService";
import {
  INTERVIEW_NOTES_ACCEPTED_EXTENSION,
  INTERVIEW_NOTES_ACCEPTED_MIME_TYPE,
} from "../../constants/interviewNotes";
import IInterviewGroupService from "../interfaces/IInterviewGroupService";
import IInterviewedApplicantRecordsService from "../interfaces/IInterviewedApplicantRecordService";
import InterviewDelegation from "../../models/interviewDelegation.model";
import ApplicantRecord from "../../models/applicantRecord.model";
import Applicant from "../../models/applicant.model";
import InterviewGroup from "../../models/interviewGroup.model";

const Logger = logger(__filename);

const interviewDelegationsService: IInterviewDelegationService = new InterviewDelegationService();

const interviewGroupService: IInterviewGroupService = new InterviewGroupService();

// Inline-initialized so this class's constructor stays parameter-less. Other
// devs working on this same composite service can append methods without
// having to reconcile constructor signatures.
// TODO(workstream B follow-up / firebase sync): the bucket name is read from
// `FIREBASE_STORAGE_DEFAULT_BUCKET`. Until the real interview-notes bucket is
// wired up, this points at whatever bucket the rest of the app uses (see
// `entityResolvers.ts`). The upload code path will hit firebase at runtime;
// confirm with partner before merging.
const interviewNotesBucket = process.env.FIREBASE_STORAGE_DEFAULT_BUCKET || "";
const firebaseFileService: IFirebaseFileService = new FirebaseFileService(
  new FileStorageService(interviewNotesBucket),
);
const interviewedApplicantRecordsService: IInterviewedApplicantRecordsService = new InterviewedApplicantRecordsService();

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
  private interviewedApplicantRecordsService = new InterviewedApplicantRecordsService();

  /* eslint-disable class-methods-use-this */
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

  async submitInterviewScores(
    interviewedApplicantRecordId: string,
    scores: Interview,
  ): Promise<InterviewedApplicantRecordDTO> {
    try {
      return await this.interviewedApplicantRecordsService.updateInterviewedApplicantRecord(
        interviewedApplicantRecordId,
        { interviewJson: scores },
      );
    } catch (error: unknown) {
      Logger.error(
        `Failed to submit interview scores. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  async getInterviewNotesByInterviewedApplicantRecordId(
    interviewedApplicantRecordId: string,
  ): Promise<InterviewNotesDTO | null> {
    try {
      const record = await interviewedApplicantRecordsService.getInterviewedApplicantRecordById(
        interviewedApplicantRecordId,
      );
      if (!record.interviewNotesId) {
        return null;
      }
      const file = await firebaseFileService.getFirebaseFileById(
        record.interviewNotesId,
      );
      const signedUrl = await firebaseFileService.getSignedUrl(
        file.storagePath,
      );
      return {
        fileId: file.id,
        fileName: file.originalFileName,
        signedUrl,
      };
    } catch (error: unknown) {
      Logger.error(
        `Failed to get interview notes for record ${interviewedApplicantRecordId}. Reason = ${getErrorMessage(
          error,
        )}`,
      );
      throw error;
    }
  }

  async uploadInterviewNotes(
    interviewedApplicantRecordId: string,
    uploadedUserId: number,
    upload: {
      localFilePath: string;
      originalFileName: string;
      sizeBytes: number;
      contentType: string;
    },
  ): Promise<InterviewNotesDTO> {
    try {
      // Defense in depth: validate both mimetype and extension. The frontend
      // dropzone enforces this too, but the resolver is the trust boundary.
      if (
        upload.contentType !== INTERVIEW_NOTES_ACCEPTED_MIME_TYPE ||
        !upload.originalFileName
          .toLowerCase()
          .endsWith(INTERVIEW_NOTES_ACCEPTED_EXTENSION)
      ) {
        throw new Error("Only PDF files are accepted for interview notes.");
      }

      // Load the record up front. This both validates existence and captures
      // the previous notes id so we can clean it up after a successful swap.
      const record = await interviewedApplicantRecordsService.getInterviewedApplicantRecordById(
        interviewedApplicantRecordId,
      );
      const previousNotesId = record.interviewNotesId;

      // 1) Persist the new file (storage + DB row) before touching the FK.
      const newFile = await firebaseFileService.createFirebaseFile({
        originalFileName: upload.originalFileName,
        uploadedUserId,
        sizeBytes: upload.sizeBytes,
        localFilePath: upload.localFilePath,
        contentType: INTERVIEW_NOTES_ACCEPTED_MIME_TYPE,
      });

      // 2) Point the interviewed-applicant record at the new file via the
      // GENERIC update service (per ticket: the FK update must go through the
      // shared update path so any future side-effects there fire uniformly).
      try {
        await interviewedApplicantRecordsService.updateInterviewedApplicantRecord(
          interviewedApplicantRecordId,
          { interviewNotesId: newFile.id },
        );
      } catch (updateError: unknown) {
        // FK update failed — roll back the just-created file so we don't leak
        // an orphan blob + row.
        try {
          await firebaseFileService.deleteFirebaseFileById(newFile.id);
        } catch (rollbackError: unknown) {
          Logger.error(
            `Failed to roll back orphan firebase file ${
              newFile.id
            } after FK update failure. Reason = ${getErrorMessage(
              rollbackError,
            )}`,
          );
        }
        throw updateError;
      }

      // 3) Best-effort delete of the previous file. Failures here are logged
      // and swallowed: the user's new file is already attached and visible,
      // and we'd rather leak a blob than fail an otherwise-successful upload.
      if (previousNotesId) {
        try {
          await firebaseFileService.deleteFirebaseFileById(previousNotesId);
        } catch (cleanupError: unknown) {
          Logger.error(
            `Failed to delete previous interview notes file ${previousNotesId} for record ${interviewedApplicantRecordId}. Reason = ${getErrorMessage(
              cleanupError,
            )}`,
          );
        }
      }

      const signedUrl = await firebaseFileService.getSignedUrl(
        newFile.storagePath,
      );
      return {
        fileId: newFile.id,
        fileName: newFile.originalFileName,
        signedUrl,
      };
    } catch (error: unknown) {
      Logger.error(
        `Failed to upload interview notes for record ${interviewedApplicantRecordId}. Reason = ${getErrorMessage(
          error,
        )}`,
      );
      throw error;
    }
  }
}

export default InterviewCompositeService;
