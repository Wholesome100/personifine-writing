import { sql } from "@/db/context";
import { notFound } from "next/navigation";
import { editStory } from "@/lib/actions/story/editStory";

import FormCredentials from "@/components/FormCredentials";

export const dynamic = "force-dynamic";

// Helper to fetch story by slug
async function getStory(slug: string) {
  const response = await sql.query(
    "SELECT story_id, title, slug, description, summary, featured FROM stories WHERE slug = $1",
    [slug],
  );
  return response;
}

export default async function EditStory(
  { params }: { params: Promise<{ story: string }> },
) {
  const { story } = await params;

  const response = await getStory(story);
  if (!response.length) notFound();

  const storyData = response[0];

  return (
    <main className="flex-grow w-full max-w-3xl mx-auto px-4 py-8">
      <h1 className="font-serif text-3xl sm:text-4xl text-accent1 mb-6">
        Edit Story
      </h1>

      <form action={editStory} className="space-y-6">
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
            defaultValue={storyData.title}
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
            defaultValue={storyData.slug}
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
            defaultValue={storyData.description}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium" htmlFor="summary">
            Summary
          </label>
          <textarea
            id="summary"
            name="summary"
            rows={6}
            defaultValue={storyData.summary}
            className="w-full border rounded px-3 py-2 whitespace-pre-wrap resize-none"
          />
        </div>

        <div className="flex items-center">
          <input
            id="featured"
            name="featured"
            type="checkbox"
            defaultChecked={storyData.featured}
            className="mr-2"
          />
          <label htmlFor="featured" className="font-medium">
            Featured
          </label>
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
