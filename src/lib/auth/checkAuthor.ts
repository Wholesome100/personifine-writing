"use server";

import { sql } from "@/db/context";
import bcrypt from "bcrypt";

// Union type, one on success with ok == true, and one on fail with ok == false
export type CheckAuthorResult = { ok: true; userId: string; role: string } | {
  ok: false;
  error: string;
};

// This function authorizes the current user and checks if they are an author or admin
export async function checkAuthor(
  username: string,
  passCode: string,
): Promise<CheckAuthorResult> {
  const dbHash = await sql.query(
    "SELECT pass_code FROM users WHERE user_name = $1",
    [username],
  );

  // We only want 1 and only 1 user returned from the query
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

  if (userData.length === 1) {
    return { ok: true, userId: userData[0].user_id, role: userData[0].role };
  }

  // If userData comes back empty, then the user didn't have the author or admin role
  return { ok: false, error: "Unauthorized Operation." };
}
