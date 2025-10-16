"use server";

import { sql } from "@/db/context";

import { checkAuthor } from "@/lib/auth/checkAuthor";
import { checkOwner } from "@/lib/auth/checkOwner";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Server function to edit existing chapters
export async function editChapter(_pending: any, formData: FormData) {
  const username = formData.get("username") as string;
  const passCode = formData.get("passcode") as string;
  const chapterId = formData.get("chapter_id") as string;

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
  revalidatePath(`/catalog/${isOwner.slug}`);
  revalidatePath(`/catalog/${isOwner.slug}/${slug}`);
  redirect(`/catalog/${isOwner.slug}/${slug}`);
}
