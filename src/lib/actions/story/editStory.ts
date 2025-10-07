"use server";

import { sql } from "@/db/context";

import bcrypt from "bcrypt";
import { redirect } from "next/navigation";

// Server function to edit existing stories
export async function editStory(formData: FormData) {
  try {
    const username = formData.get("username") as string;
    const passCode = formData.get("passcode") as string;
    const storyId = formData.get("story_id") as string;

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

    // Collect updated fields
    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const description = formData.get("description") as string;
    const summary = formData.get("summary") as string;
    const featured = formData.get("featured") === "on";

    // Update the story
    await sql.query(
      `UPDATE stories
       SET title = $1,
           slug = $2,
           description = $3,
           summary = $4,
           featured = $5,
           updated_at = now()
       WHERE story_id = $6`,
      [title, slug, description, summary, featured, storyId],
    );

    // Redirect the user to the updated page
    console.log("Story updated successfully.");
    redirect(`/catalog/${slug}`);
  } catch (err: any) {
    // fyi, redirect throws an error that needs to be passed along so nextjs can reroute the user
    if (err?.digest?.startsWith("NEXT_REDIRECT")) {
      throw err;
    }
    console.error("Error when editing story:", err);
  }
}