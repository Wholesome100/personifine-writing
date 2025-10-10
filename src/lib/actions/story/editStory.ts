"use server";

import { sql } from "@/db/context";

import { checkAuthor } from "@/lib/auth/checkAuthor";
import { checkOwner } from "@/lib/auth/checkOwner";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Server function to edit existing stories
export async function editStory(formData: FormData) {
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

  console.log("Story updated successfully.");

  // At a baseline, revalidate the caches for the front page, the catalog, and then the story
  revalidatePath("/");
  revalidatePath("/catalog");
  revalidatePath(`/catalog/${slug}`);

  // Redirect the user to the updated page
  redirect(`/catalog/${slug}`);
}
