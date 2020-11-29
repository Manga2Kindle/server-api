import { PlatformMulterFile, Req } from "@tsed/common";
import { StorageEngine } from "multer";
import S3Storage from "./S3Storage";

export default class MulterS3Storage implements StorageEngine {
  private s3Utils = new S3Storage();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _handleFile = (req: Req, file: PlatformMulterFile, cb: (error: any, metadata?: any) => void): void => {
    file.path = req.params.id + "/" + req.params.page + this.getFileExtension(file.originalname);

    this.s3Utils.MulterFileToBuffer(file).then((bufferFile: Buffer) => {
      this.s3Utils.putFile(file.path, bufferFile, cb);
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _removeFile = (req: Req, file: PlatformMulterFile, cb: (error: any, metadata?: any) => void): void => {
    this.s3Utils.deleteFile(file.path, cb);
  };

  private getFileExtension(filename: string): string | undefined {
    let extension = filename.split(".").pop();
    if (extension) {
      extension = "." + extension;
    }
    return extension;
  }
}

export function storageEngine(): MulterS3Storage {
  return new MulterS3Storage();
}

export type ContentTypeFunction = (req: Request, file: Express.Multer.File) => string | undefined;
