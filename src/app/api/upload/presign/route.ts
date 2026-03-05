import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generatePresignedUploadUrl } from "@/lib/r2/presign";
import { generateR2Key, isAllowedContentType } from "@/lib/r2/utils";
import { uploadPresignSchema } from "@/lib/validations";

export async function POST(request: Request) {
  // Verify authenticated
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Parse and validate body
  const body = await request.json();
  const parsed = uploadPresignSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { filename, contentType, folder } = parsed.data;

  // Validate content type
  if (!isAllowedContentType(contentType)) {
    return NextResponse.json(
      { error: "File type not allowed" },
      { status: 400 }
    );
  }

  // Generate key and presigned URL
  const key = generateR2Key(folder, filename);
  const { uploadUrl, cdnUrl } = await generatePresignedUploadUrl({
    key,
    contentType,
  });

  return NextResponse.json({ uploadUrl, cdnUrl, key });
}
