import { sql } from "@/db/context";
import { notFound } from "next/navigation";

import EditChapterForm from "@/components/forms/chapter/EditChapterForm";

export const dynamic = "force-dynamic";

// Helper to fetch chapter by story + chapter slug
async function getChapter(storySlug: string, chapterSlug: string) {
  const response = await sql.query(
    `SELECT c.chapter_id, c.story_id, c.title, c.slug, c.description, c.corpus,
            s.slug AS story_slug
       FROM chapters c
       JOIN stories s ON c.story_id = s.story_id
      WHERE s.slug = $1 AND c.slug = $2`,
    [storySlug, chapterSlug],
  );
  return response;
}

export default async function EditChapter({
  params,
}: {
  params: Promise<{ story: string; chapter: string }>;
}) {
  const { story, chapter } = await params;

  const response = await getChapter(story, chapter);
  if (!response.length) notFound();

  const chapterData = response[0];

  return (
    <main className="flex-grow w-full max-w-3xl mx-auto px-4 py-8">
      <h1 className="font-serif text-3xl sm:text-4xl text-accent1 mb-6">
        Edit Chapter
      </h1>

      <EditChapterForm chapterData={chapterData} />
    </main>
  );
}
