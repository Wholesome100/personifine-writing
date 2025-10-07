"use server";

import { sql } from "@/db/context";

import { checkAuthor } from "@/lib/auth/checkAuthor";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Server function to create a new story under /catalog
export async function createNewStory(formData: FormData) {
  const username = formData.get("username") as string;
  const passCode = formData.get("passcode") as string;

  const userData = await checkAuthor(username, passCode);

  // Needs to return an error to the client side, workflows will need to be 'use client'
  if (!userData.ok) {
    console.error(userData.error);
    return;
  }

  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;
  const summary = formData.get("summary") as string;
  const featured = formData.get("featured") === "on";

  await sql.query(
    `INSERT INTO stories (user_id, title, slug, description, summary, featured)
       VALUES ($1, $2, $3, $4, $5, $6)`,
    [userData.userId, title, slug, description, summary, featured],
  );

  console.log("Story created successfully.");

  revalidatePath("/catalog");
  redirect(`/catalog/${slug}`);
}
