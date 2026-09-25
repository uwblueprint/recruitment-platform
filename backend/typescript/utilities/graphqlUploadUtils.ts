import fs from "fs";
import os from "os";
import path from "path";

import { FileUpload } from "graphql-upload";
/* eslint-disable-next-line import/no-extraneous-dependencies */
import { ReadStream } from "fs-capacitor";

/**
 * Metadata for an uploaded file after it's been drained to local disk.
 * Consumers receive this and can read `localFilePath` like any normal file.
 */
export type DrainedUpload = {
  localFilePath: string;
  originalFileName: string;
  sizeBytes: number;
  contentType: string;
};

/**
 * Drain a graphql-upload read stream to a file on disk and return the number
 * of bytes actually written. We track bytes ourselves (rather than trusting
 * a client-supplied Content-Length) so callers can enforce real size limits.
 */
const streamToFile = (
  readStream: ReadStream,
  filePath: string,
): Promise<number> => {
  return new Promise((resolve, reject) => {
    let bytesWritten = 0;
    const out = fs.createWriteStream(filePath);
    readStream.on("data", (chunk: Buffer) => {
      bytesWritten += chunk.length;
    });
    readStream.pipe(out);
    out.on("finish", () => resolve(bytesWritten));
    out.on("error", (err) => reject(err));
    readStream.on("error", (err) => reject(err));
  });
};

/**
 * Drain a graphql-upload `Upload` into a temporary file on disk, invoke
 * `callback` with the resulting `DrainedUpload`, and guarantee that the temp
 * file + scratch dir are cleaned up afterwards — even when the callback (or
 * deep service code it calls) throws.
 *
 * The `tempDirPrefix` is forwarded to `mkdtemp` so different call sites can
 * tag their scratch dirs for easier debugging (e.g. "interview-notes-").
 */
export const withUploadAsTempFile = async <T>(
  filePromise: Promise<FileUpload>,
  tempDirPrefix: string,
  callback: (upload: DrainedUpload) => Promise<T>,
): Promise<T> => {
  const { createReadStream, filename, mimetype } = await filePromise;
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), tempDirPrefix));
  const localFilePath = path.join(tempDir, filename);
  try {
    const sizeBytes = await streamToFile(createReadStream(), localFilePath);
    return await callback({
      localFilePath,
      originalFileName: filename,
      sizeBytes,
      contentType: mimetype,
    });
  } finally {
    // Best-effort cleanup: the OS will reap /tmp eventually if this fails,
    // and we don't want a cleanup error to mask the real error from `callback`.
    try {
      if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
      fs.rmdirSync(tempDir);
    } catch {
      // intentionally swallowed
    }
  }
};
