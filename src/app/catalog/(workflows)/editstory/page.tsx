import { sql } from "@/db/context";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { notFound } from "next/navigation";

async function getStoryDetails(slug: string) {
  const response = await sql.query(
    "SELECT story_id, title, summary FROM stories WHERE slug = $1",
    [slug],
  );
  return response;
}

async function getChapterDetails(story_id: string) {
  const response = await sql.query(
    "SELECT chapter_id, title, description, slug FROM chapters WHERE story_ID = $1 ORDER BY sequence ASC",
    [story_id],
  );
  return response;
}

export default async function EditStory() {
    return <span>This is where users will make changes to existing stories</span>
}