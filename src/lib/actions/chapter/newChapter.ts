"use server";

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
      "SELECT user_id, slug FROM stories WHERE story_id = $1",
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
