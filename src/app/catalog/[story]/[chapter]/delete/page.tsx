import { sql } from "@/db/context";
import { notFound } from "next/navigation";
import { deleteChapter } from "@/lib/actions/chapterActions";

import FormCredentials from "@/components/FormCredentials";

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
    <main className="flex-grow w-full max-w-3xl mx-auto px-4 py-8">
      <h1 className="font-serif text-3xl sm:text-4xl text-accent3 mb-6">
        Delete Chapter
      </h1>

      <p className="mb-6 text-accent3">
        Are you sure you want to permanently delete{" "}
        <span className="font-semibold">"{chapterData.title}"</span>? This
        action cannot be undone.
      </p>

      <form action={deleteChapter} className="space-y-6">
        <input type="hidden" name="story_id" value={chapterData.story_id} />
        <input
          type="hidden"
          name="chapter_id"
          value={chapterData.chapter_id}
        />

        <div className="border border-accent3 rounded-md p-4 space-y-4">
          <h2 className="font-semibold text-accent3 mb-2">
            Confirm Credentials
          </h2>

          <FormCredentials />
        </div>

        <button
          type="submit"
          className="bg-accent3 text-page-bg px-4 py-2 rounded hover:bg-accent3-hover"
        >
          Yes, Delete Chapter
        </button>
      </form>
    </main>
  );
}
