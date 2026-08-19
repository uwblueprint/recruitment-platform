import FirebaseFile from "../../models/firebaseFile.model";
import IFileStorageService from "../interfaces/fileStorageService";
import IFirebaseFileService from "../interfaces/IFirebaseFileService";
import { FirebaseFileDTO } from "../../types/firebaseFile";
import { toFirebaseFileDTO } from "../../utilities/dtoUtils";
import { getErrorMessage } from "../../utilities/errorUtils";
import logger from "../../utilities/logger";

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

  async getSignedUrl(
    storagePath: string,
    expirationMinutes = 60,
  ): Promise<string> {
    return this.fileStorageService.getFile(storagePath, expirationMinutes);
  }
}

export default FirebaseFileService;
