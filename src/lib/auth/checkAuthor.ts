"use server";

import { sql } from "@/db/context";
import bcrypt from "bcrypt";

// Union type, one on success with ok == true, and one on fail with ok == false
type checkAuthorResult = { ok: true; userId: string; role: string } | {
  ok: false;
  error: string;
};

export async function checkAuthor(
  username: string,
  passCode: string,
): Promise<checkAuthorResult> {
  const dbHash = await sql.query(
    "SELECT pass_code FROM users WHERE user_name = $1",
    [username],
  );

  // Valid because we only want 1 and only 1 user returned from the query
  if (dbHash.length !== 1) {
    return { ok: false, error: "Invalid credentials." };
  }

  // Check if the hashes match
  const match = await bcrypt.compare(passCode, dbHash[0]?.pass_code);
  if (!match) {
    return { ok: false, error: "Invalid credentials." };
  }

  // After confirming the hashes match, fetch user data and check if they have the appropriate role
  const userData = await sql.query(
    "SELECT user_id, role FROM users WHERE user_name = $1 AND role IN ('author', 'admin')",
    [username],
  );

  // If userData comes back empty, then the user didn't have the author or admin role
  if (userData.length !== 1) {
    return { ok: false, error: "Unauthorized Operation." };
  }

  return { ok: true, userId: userData[0].user_id, role: userData[0].role };
}
