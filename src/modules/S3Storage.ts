import { PlatformMulterFile } from "@tsed/common";
import { Exception } from "@tsed/exceptions";
import { AWSError, Request as S3Request, S3 } from "aws-sdk";
import s3 from "../config/s3";

export default class S3Storage {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public getFileList(path: string, cb: (error: any, metadata?: any) => void): void {
    const params: S3.Types.ListObjectsRequest = {
      Bucket: process.env.S3_BUCKET as string,
      Prefix: path
    };

    s3.listObjects(params, (err: AWSError, data: S3.ListObjectsOutput) => {
      if (err) return cb(err);
      else cb(null, data);
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public putFile(path: string, file: Buffer | string, cb: (error: any, metadata?: any) => void): void {
    const params: S3.Types.PutObjectRequest = {
      Bucket: process.env.S3_BUCKET as string,
      Key: path,
      Body: file
    };

    if (file instanceof Buffer) {
      if (file.byteLength > 10485760) {
        // 10MB
        return cb(new Exception(400, "File too big"));
      }
    }

    s3.putObject(params)
      .on("build", (req: S3Request<S3.PutObjectOutput, AWSError>) => {
        req.httpRequest.headers["X-Delete-After"] = process.env.S3_TIME_TO_LIVE || "3600";
      })
      .send((err: AWSError, data: S3.PutObjectOutput) => {
        if (err) return cb(err);
        else cb(null, data);
      });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public deleteFile(path: string, cb: (error: any, metadata?: any) => void): void {
    const params: S3.Types.PutObjectRequest = {
      Bucket: process.env.S3_BUCKET as string,
      Key: path
    };

    s3.deleteObject(params, (err: AWSError, data: S3.DeleteObjectOutput) => {
      if (err) return cb(err);
      else cb(null, data);
    });
  }

  public MulterFileToBuffer(file: PlatformMulterFile): Promise<Buffer> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const bufs: any[] = [];

    return new Promise<Buffer>((resolve, reject) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      file.stream.on("data", function (chunk: any) {
        bufs.push(chunk);
      });
      file.stream.on("end", function () {
        resolve(Buffer.concat(bufs));
      });
      file.stream.on("error", function (err: Error) {
        reject(err);
      });
    });
  }
}
