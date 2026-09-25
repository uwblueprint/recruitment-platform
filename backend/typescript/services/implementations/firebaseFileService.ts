import { sequelize } from "../../models";
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
    const transaction = await sequelize.transaction();
    try {
      // Create the DB row first so we can use its ID as the storage path.
      const row = await FirebaseFile.create(
        {
          original_file_name: input.originalFileName,
          uploaded_user_id: input.uploadedUserId,
          size_bytes: input.sizeBytes,
          // storage_path is set after we know the ID
          storage_path: "",
        },
        { transaction },
      );

      const storagePath = `${INTERVIEW_NOTES_STORAGE_PREFIX}/${row.id}`;

      await row.update({ storage_path: storagePath }, { transaction });

      await this.fileStorageService.createFile(
        storagePath,
        input.localFilePath,
        input.contentType,
      );

      await transaction.commit();
      return toFirebaseFileDTO(row);
    } catch (error: unknown) {
      await transaction.rollback();
      Logger.error(
        `Failed to create firebase file. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  async deleteFirebaseFileById(id: string): Promise<void> {
    const transaction = await sequelize.transaction();
    try {
      const row = await FirebaseFile.findByPk(id, { transaction });
      if (!row) {
        await transaction.rollback();
        Logger.warn(
          `deleteFirebaseFileById called on missing file id ${id}; ignoring.`,
        );
        return;
      }

      await row.destroy({ transaction });

      await this.fileStorageService.deleteFile(row.storage_path);

      await transaction.commit();
    } catch (error: unknown) {
      await transaction.rollback();
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
