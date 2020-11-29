import { Credentials, Endpoint, S3 } from "aws-sdk";

const s3 = new S3();
s3.config.credentials = new Credentials(process.env.S3_ACCESS_KEY_ID as string, process.env.S3_SECRET_ACCESS_KEY as string);
s3.endpoint = new Endpoint(process.env.S3_ENDPOINT as string);
s3.config.endpoint = process.env.S3_ENDPOINT;
s3.config.region = process.env.S3_REGION;

export default s3;
