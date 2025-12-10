import { sql } from "@/db/context";
import { notFound } from "next/navigation";

import DeleteChapterForm from "@/components/forms/chapter/DeleteChapterForm";

export const dynamic = "force-dynamic";

// Helper to fetch chapter by slugs
async function getChapter(storySlug: string, chapterSlug: string) {
  const response = await sql.query(
    `SELECT c.chapter_id, c.story_id, c.title, s.slug AS story_slug
       FROM chapters c
       JOIN stories s ON c.story_id = s.story_id
      WHERE s.slug = $1 AND c.slug = $2`,
    [storySlug, chapterSlug],
  );
  return response;
}

export default async function DeleteChapter(
  { params }: { params: Promise<{ story: string; chapter: string }> },
) {
  const { story, chapter } = await params;

  const response = await getChapter(story, chapter);
  if (!response.length) notFound();

  const chapterData = response[0];

  return (
    <main className="grow w-full max-w-3xl mx-auto px-4 py-8">
      <h1 className="font-serif text-3xl sm:text-4xl text-accent3 mb-6">
        Delete Chapter
      </h1>

      <p className="mb-6 text-accent3">
        Are you sure you want to permanently delete{" "}
        <span className="font-semibold">"{chapterData.title}"</span>? This
        action cannot be undone.
      </p>

      <DeleteChapterForm chapterData={chapterData} />
    </main>
  );
}
