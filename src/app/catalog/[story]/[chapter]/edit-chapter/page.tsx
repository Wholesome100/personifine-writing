import { sql } from "@/db/context";
import { notFound } from "next/navigation";
import { editChapter } from "@/lib/actions/chapter/editChapter";

import FormCredentials from "@/components/FormCredentials";

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

export default async function EditChapter(
  { params }: { params: Promise<{ story: string; chapter: string }> },
) {
  const { story, chapter } = await params;

  const response = await getChapter(story, chapter);
  if (!response.length) notFound();

  const chapterData = response[0];

  return (
    <main className="flex-grow w-full max-w-3xl mx-auto px-4 py-8">
      <h1 className="font-serif text-3xl sm:text-4xl text-accent1 mb-6">
        Edit Chapter
      </h1>

      <form action={editChapter} className="space-y-6">
        <input type="hidden" name="story_id" value={chapterData.story_id} />
        <input
          type="hidden"
          name="chapter_id"
          value={chapterData.chapter_id}
        />

        <FormCredentials />

        {/* Chapter Fields */}
        <div>
          <label className="block mb-1 font-medium" htmlFor="title">
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            defaultValue={chapterData.title}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium" htmlFor="slug">
            Slug
          </label>
          <input
            id="slug"
            name="slug"
            type="text"
            defaultValue={chapterData.slug}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium" htmlFor="description">
            Description
          </label>
          <input
            id="description"
            name="description"
            type="text"
            defaultValue={chapterData.description}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium" htmlFor="corpus">
            Corpus
          </label>
          <textarea
            id="corpus"
            name="corpus"
            rows={6}
            defaultValue={chapterData.corpus}
            className="w-full border rounded px-3 py-2 whitespace-pre-wrap resize-none"
          />
        </div>

        <button
          type="submit"
          className="bg-accent1 text-page-bg px-4 py-2 rounded hover:bg-accent1-hover"
        >
          Save Changes
        </button>
      </form>
    </main>
  );
}
