"use server";

import { sql } from "@/db/context";
import bcrypt from "bcrypt";

export async function checkAuthor(username: string, passCode: string) {
  const dbHash = await sql.query(
    "SELECT pass_code FROM users WHERE user_name = $1",
    [username],
  );

  if (dbHash.length !== 1) {
    throw new Error("Invalid Credentials.");
  }

  const match = await bcrypt.compare(passCode, dbHash[0]?.pass_code);
  if (!match) {
    throw new Error("Invalid Credentials.");
  }

  const userData = await sql.query(
    "SELECT user_id, role FROM users WHERE user_name = $1",
    [username],
  );

  if (!["author", "admin"].includes(userData[0].role)) {
    throw new Error("Unauthorized Operation.");
  }
}
