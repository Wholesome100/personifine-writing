"use server";

import { sql } from "@/db/context";

import { checkAuthor } from "@/lib/auth/checkAuthor";
import { checkOwner } from "@/lib/auth/checkOwner";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Server function to create a new chapter in an existing story
export async function createNewChapter(_pending: any, formData: FormData) {
  const username = formData.get("username") as string;
  const passCode = formData.get("passcode") as string;

  const userData = await checkAuthor(username, passCode);

  if (!userData.ok) {
    return { message: userData.error };
  }

  // Similar flows to stories, but it needs to be checked that the story we're inserting into is owned by the user
  const storyId = formData.get("story_id") as string;

  const isOwner = await checkOwner(storyId, userData);

  if (!isOwner.ok) {
    return { message: isOwner.error };
  }

  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;
  const corpus = formData.get("corpus") as string;

  await sql.query(
    `INSERT INTO chapters (story_id, title, slug, description, corpus)
         VALUES ($1, $2, $3, $4, $5)`,
    [storyId, title, slug, description, corpus],
  );

  console.log("Chapter created successfully.");

  //Revalidate the story container for the chapter and redirect to the new chapter
  revalidatePath(`/catalog/${isOwner.slug}`);
  redirect(`/catalog/${isOwner.slug}/${slug}`);
}
