"use server";

import { sql } from "@/db/context";

type CheckOwnerResult = { ok: true } | {
  ok: false;
  error: string;
};

// This function authorizes the current user and checks if they are an author or admin
export async function checkOwner(
  storyId: string,
  userData: { ok: true; userId: string; role: string },
): Promise<CheckOwnerResult> {
  const storyOwner = await sql.query(
    "SELECT 1 FROM stories WHERE story_id = $1 AND (user_id = $2 OR $3 = 'admin')",
    [storyId, userData.userId, userData.role],
  );

  // Each story has only one owner
  // Admins can make whatever edits they like without ownership
  if (storyOwner.length === 1) {
    return { ok: true };
  }

  return { ok: false, error: "Not Story Owner or Admin." };
}
