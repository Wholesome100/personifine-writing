"use server";

// This file will contain the create, edit, and delete actions for all story related routes
import { sql } from "@/db/context";

import bcrypt from "bcrypt";
import { redirect } from "next/navigation";

// Server function to create a new story under /catalog
export async function createNewStory(formData: FormData) {
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

    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const description = formData.get("description") as string;
    const summary = formData.get("summary") as string;
    const featured = formData.get("featured") === "on";

    await sql.query(
      `INSERT INTO stories (user_id, title, slug, description, summary, featured)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [userData[0].user_id, title, slug, description, summary, featured],
    );

    console.log("Story created successfully.");
    redirect(`/catalog/${slug}`);
  } catch (err: any) {
    // fyi, redirect throws an error that needs to be passed along so nextjs can reroute the user
    if (err?.digest?.startsWith("NEXT_REDIRECT")) {
      throw err;
    }
    console.error("Error when creating story:", err);
  }
}

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

// Server action for deleting a story
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
