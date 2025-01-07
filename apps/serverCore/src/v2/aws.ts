import { S3Client } from "@aws-sdk/client-s3";

const { AWS_REGION, AWS_ACCESS_KEY, AWS_SECRET_ACCESS_KEY } = process.env;

export const s3 = new S3Client({
  region: AWS_REGION!,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY!,
    secretAccessKey: AWS_SECRET_ACCESS_KEY!
  }
});
