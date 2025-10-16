"use server";

import { sql } from "@/db/context";

import { checkAuthor } from "@/lib/auth/checkAuthor";
import { checkOwner } from "@/lib/auth/checkOwner";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Server function for deleting a chapter
export async function deleteChapter(_pending: any, formData: FormData) {
  const username = formData.get("username") as string;
  const passCode = formData.get("passcode") as string;
  const chapterId = formData.get("chapter_id") as string;

  // Verify credentials
  const userData = await checkAuthor(username, passCode);

  if (!userData.ok) {
    return { message: userData.error };
  }

  const storyId = formData.get("story_id") as string;
  // Ensure user is owner or admin
  const isOwner = await checkOwner(storyId, userData);

  if (!isOwner.ok) {
    return { message: isOwner.error };
  }

  // Delete the chapter
  await sql.query(
    "DELETE FROM chapters WHERE chapter_id = $1 AND story_id = $2",
    [chapterId, storyId],
  );

  revalidatePath(`/catalog/${isOwner.slug}`);
  // Redirect back to the story page
  redirect(`/catalog/${isOwner.slug}`);
}
