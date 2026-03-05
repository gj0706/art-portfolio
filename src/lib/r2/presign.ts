import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2Client } from "./client";

export async function generatePresignedUploadUrl(params: {
  key: string;
  contentType: string;
}) {
  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME!,
    Key: params.key,
    ContentType: params.contentType,
  });

  const uploadUrl = await getSignedUrl(r2Client, command, {
    expiresIn: 300, // 5 minutes
  });

  const cdnUrl = `${process.env.R2_PUBLIC_URL}/${params.key}`;

  return { uploadUrl, cdnUrl, key: params.key };
}
