import { v4 as uuidv4 } from "uuid";

import FirebaseFile from "../../models/firebaseFile.model";
import IFileStorageService from "../interfaces/fileStorageService";
import IFirebaseFileService from "../interfaces/IFirebaseFileService";
import {
  CreateFirebaseFileDTO,
  FirebaseFileDTO,
} from "../../types/firebaseFile";
import { toFirebaseFileDTO } from "../../utilities/dtoUtils";
import { getErrorMessage } from "../../utilities/errorUtils";
import logger from "../../utilities/logger";
import { INTERVIEW_NOTES_STORAGE_PREFIX } from "../../constants/interviewNotes";

const Logger = logger(__filename);

class FirebaseFileService implements IFirebaseFileService {
  /* eslint-disable class-methods-use-this */
  private readonly fileStorageService: IFileStorageService;

  constructor(fileStorageService: IFileStorageService) {
    this.fileStorageService = fileStorageService;
  }

  async getFirebaseFileById(id: string): Promise<FirebaseFileDTO> {
    try {
      const row = await FirebaseFile.findByPk(id);
      if (!row) {
        throw new Error(`No firebase file with id ${id} found.`);
      }
      return toFirebaseFileDTO(row);
    } catch (error: unknown) {
      Logger.error(
        `Failed to fetch firebase file ${id}. Reason = ${getErrorMessage(
          error,
        )}`,
      );
      throw error;
    }
  }

  async createFirebaseFile(
    input: CreateFirebaseFileDTO,
  ): Promise<FirebaseFileDTO> {
    // Generate a unique storage path. The uuid prefix prevents collisions
    // across files that happen to share an original filename.
    const storagePath = `${INTERVIEW_NOTES_STORAGE_PREFIX}/${uuidv4()}-${
      input.originalFileName
    }`;

    let storageUploaded = false;
    try {
      await this.fileStorageService.createFile(
        storagePath,
        input.localFilePath,
        input.contentType,
      );
      storageUploaded = true;

      const row = await FirebaseFile.create({
        storage_path: storagePath,
        original_file_name: input.originalFileName,
        uploaded_user_id: input.uploadedUserId,
        size_bytes: input.sizeBytes,
      });
      return toFirebaseFileDTO(row);
    } catch (error: unknown) {
      Logger.error(
        `Failed to create firebase file at ${storagePath}. Reason = ${getErrorMessage(
          error,
        )}`,
      );
      // If we uploaded to storage but failed to persist the DB row, roll back
      // the blob so we don't leak orphaned files in the bucket.
      if (storageUploaded) {
        try {
          await this.fileStorageService.deleteFile(storagePath);
        } catch (cleanupError: unknown) {
          Logger.error(
            `Failed to roll back storage blob ${storagePath} after DB error. Reason = ${getErrorMessage(
              cleanupError,
            )}`,
          );
        }
      }
      throw error;
    }
  }

  async deleteFirebaseFileById(id: string): Promise<void> {
    try {
      const row = await FirebaseFile.findByPk(id);
      if (!row) {
        Logger.warn(
          `deleteFirebaseFileById called on missing file id ${id}; ignoring.`,
        );
        return;
      }
      // Best-effort storage delete: if the blob is missing or storage errors,
      // we still drop the DB row so we don't leak orphan rows pointing at
      // nothing. The composite caller treats cleanup failures as non-fatal.
      try {
        await this.fileStorageService.deleteFile(row.storage_path);
      } catch (storageError: unknown) {
        Logger.error(
          `Failed to delete storage blob ${
            row.storage_path
          } for file ${id}; deleting DB row anyway. Reason = ${getErrorMessage(
            storageError,
          )}`,
        );
      }
      await row.destroy();
    } catch (error: unknown) {
      Logger.error(
        `Failed to delete firebase file ${id}. Reason = ${getErrorMessage(
          error,
        )}`,
      );
      throw error;
    }
  }

  async getSignedUrl(
    storagePath: string,
    expirationMinutes = 60,
  ): Promise<string> {
    return this.fileStorageService.getFile(storagePath, expirationMinutes);
  }
}

export default FirebaseFileService;
