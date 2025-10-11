import { sql } from "@/db/context";
import { notFound } from "next/navigation";
import { createNewChapter } from "@/lib/actions/chapter/newChapter";

import FormCredentials from "@/components/forms/FormCredentials";

export const dynamic = "force-dynamic";

async function getStoryId(slug: string) {
  const response = await sql.query(
    "SELECT story_id FROM stories WHERE slug = $1",
    [slug],
  );
  return response;
}

export default async function NewChapter(
  { params }: { params: Promise<{ story: string }> },
) {
  const { story } = await params;

  const response = await getStoryId(story);
  if (!response.length) notFound();

  const storyData = response[0];
  return (
    <main className="flex-grow flex items-center">
      <div className="max-w-5xl mx-auto px-4 w-full">
        <section className="mb-8">
          <h1 className="font-serif text-4xl sm:text-5xl text-accent1 mb-4">
            Create a New Chapter
          </h1>
        </section>

        <form action={createNewChapter} className="space-y-6">
          <input type="hidden" name="story_id" value={storyData.story_id} />
          <FormCredentials />

          <div>
            <label className="block mb-1 font-medium" htmlFor="title">
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
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
              className="w-full border rounded px-3 py-2"
              placeholder="Your chapter in 1-2 sentences."
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
              className="w-full border rounded px-3 py-2 whitespace-pre-wrap resize-none"
              placeholder="Write something!"
            />
          </div>

          <button
            type="submit"
            className="bg-accent1 text-white px-4 py-2 rounded hover:bg-accent1-hover"
          >
            Submit
          </button>
        </form>
      </div>
    </main>
  );
}
