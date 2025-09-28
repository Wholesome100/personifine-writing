"use server";
// This file will contain the create, edit, and delete actions for all chapter related routes
import { sql } from "@/db/context";

import bcrypt from "bcrypt";
import { redirect } from "next/navigation";

// Server function to create a new chapter in an existing story
export async function createNewChapter(formData: FormData) {
  try {
    const username = formData.get("username") as string;
    const passCode = formData.get("passcode") as string;

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

    // Above flows are similar, but it needs to be checked:
    // 1. The story we're inserting into is owned by the user
    const story_id = formData.get("story_id") as string;

    const storyOwner = await sql.query(
      "SELECT user_id FROM stories WHERE story_id = $1",
      [story_id],
    );
    if (
      storyOwner.length !== 1 ||
      (storyOwner[0].user_id !== userData[0].user_id &&
        userData[0].role !== "admin")
    ) {
      throw new Error("Unauthorized Operation.");
    }

    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const description = formData.get("description") as string;
    const corpus = formData.get("corpus") as string;

    await sql.query(
      `INSERT INTO chapters (story_id, title, slug, description, corpus)
         VALUES ($1, $2, $3, $4, $5)`,
      [story_id, title, slug, description, corpus],
    );

    console.log("Chapter created successfully.");
    redirect(`/catalog/${storyOwner[0].slug}/${slug}`);
  } catch (err: any) {
    if (err?.digest?.startsWith("NEXT_REDIRECT")) {
      throw err;
    }
    console.error("Error when creating chapter:", err);
  }
}

// Server function to edit existing chapters
export async function editChapter(formData: FormData) {
  try {
    const username = formData.get("username") as string;
    const passCode = formData.get("passcode") as string;
    const storyId = formData.get("story_id") as string;
    const chapterId = formData.get("chapter_id") as string;

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
      "SELECT user_id, slug FROM stories WHERE story_id = $1",
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
    const corpus = formData.get("corpus") as string;

    // Update the chapter
    await sql.query(
      `UPDATE chapters
       SET title = $1,
           slug = $2,
           description = $3,
           corpus = $4,
           updated_at = now()
       WHERE chapter_id = $5
         AND story_id = $6`,
      [title, slug, description, corpus, chapterId, storyId],
    );

    console.log("Chapter updated successfully.");
    redirect(`/catalog/${storyOwner[0].slug}/${slug}`);
  } catch (err: any) {
    if (err?.digest?.startsWith("NEXT_REDIRECT")) {
      throw err;
    }
    console.error("Error when editing chapter:", err);
  }
}

// Server function for deleting a chapter
export async function deleteChapter(formData: FormData) {
  try {
    const username = formData.get("username") as string;
    const passCode = formData.get("passcode") as string;
    const storyId = formData.get("story_id") as string;
    const chapterId = formData.get("chapter_id") as string;

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
      "SELECT user_id, slug FROM stories WHERE story_id = $1",
      [storyId],
    );
    if (
      storyOwner.length !== 1 ||
      (storyOwner[0].user_id !== userData[0].user_id &&
        userData[0].role !== "admin")
    ) {
      throw new Error("Unauthorized Operation.");
    }

    // Delete the chapter
    await sql.query(
      "DELETE FROM chapters WHERE chapter_id = $1 AND story_id = $2",
      [chapterId, storyId],
    );

    // Redirect back to the story page
    redirect(`/catalog/${storyOwner[0].slug}`);
  } catch (err: any) {
    if (err?.digest?.startsWith("NEXT_REDIRECT")) throw err;
    console.error("Error when deleting chapter:", err);
  }
}
