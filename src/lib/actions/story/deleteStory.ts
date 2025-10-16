"use server";

import { sql } from "@/db/context";

import { checkAuthor } from "@/lib/auth/checkAuthor";
import { checkOwner } from "@/lib/auth/checkOwner";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Server function for deleting a story
export async function deleteStory(_pending: any, formData: FormData) {
  const username = formData.get("username") as string;
  const passCode = formData.get("passcode") as string;

  const userData = await checkAuthor(username, passCode);

  if (!userData.ok) {
    return { message: userData.error };
  }

  const storyId = formData.get("story_id") as string;

  // Ensure user is the owner of the story OR an admin
  const isOwner = await checkOwner(storyId, userData);

  if (!isOwner.ok) {
    return { message: isOwner.error };
  }

  // Delete the story
  await sql.query("DELETE FROM stories WHERE story_id = $1", [storyId]);

  // Revalidate the front page and the catalog
  // The story doesn't exist in the DB when deleted, so its page will be a 404
  revalidatePath("/");
  revalidatePath("/catalog");

  // Redirect back to catalog
  redirect("/catalog");
}
