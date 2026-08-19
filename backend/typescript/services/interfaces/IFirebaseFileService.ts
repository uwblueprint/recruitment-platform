import { FirebaseFileDTO } from "../../types/firebaseFile";

interface IFirebaseFileService {
  /**
   * Look up a FirebaseFile row by id.
   * @throws if no row exists.
   */
  getFirebaseFileById(id: string): Promise<FirebaseFileDTO>;

  /**
   * Generate a short-lived signed URL for the blob at the given storage path.
   */
  getSignedUrl(
    storagePath: string,
    expirationMinutes?: number,
  ): Promise<string>;
}

export default IFirebaseFileService;
