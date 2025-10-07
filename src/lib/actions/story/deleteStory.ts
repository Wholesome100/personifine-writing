"use server";

import { sql } from "@/db/context";

import bcrypt from "bcrypt";
import { redirect } from "next/navigation";

// Server function for deleting a story
export async function deleteStory(formData: FormData) {
  try {
    const username = formData.get("username") as string;
    const passCode = formData.get("passcode") as string;
    const storyId = formData.get("story_id") as string;

    // Verify credentials
    const dbHash = await sql.query(
      "SELECT pass_code FROM users WHERE user_name = $1",
      [username],
    );
    if (dbHash.length !== 1) throw new Error("Invalid Credentials.");

    const match = await bcrypt.compare(passCode, dbHash[0]?.pass_code);
    if (!match) throw new Error("Invalid Credentials.");

    // Get user info
    const userData = await sql.query(
      "SELECT user_id, role FROM users WHERE user_name = $1",
      [username],
    );

    // Ensure user is owner or admin
    const storyOwner = await sql.query(
      "SELECT user_id FROM stories WHERE story_id = $1",
      [storyId],
    );
    if (
      storyOwner.length !== 1 ||
      (storyOwner[0].user_id !== userData[0].user_id &&
        userData[0].role !== "admin")
    ) {
      throw new Error("Unauthorized Operation.");
    }

    // Delete the story
    await sql.query("DELETE FROM stories WHERE story_id = $1", [storyId]);

    // Redirect back to catalog
    redirect("/catalog");
  } catch (err: any) {
    if (err?.digest?.startsWith("NEXT_REDIRECT")) throw err;
    console.error("Error when deleting story:", err);
  }
}
