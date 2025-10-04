import { sql } from "@/db/context";
import { notFound } from "next/navigation";
import { deleteStory } from "@/lib/actions/storyActions";

import FormCredentials from "@/components/FormCredentials";

export const dynamic = "force-dynamic";

// Helper to fetch story by slug
async function getStory(slug: string) {
  const response = await sql.query(
    "SELECT story_id, title FROM stories WHERE slug = $1",
    [slug],
  );
  return response;
}

export default async function DeleteStory(
  { params }: { params: Promise<{ story: string }> },
) {
  const { story } = await params;

  const response = await getStory(story);
  if (!response.length) notFound();

  const storyData = response[0];

  return (
    <main className="flex-grow w-full max-w-3xl mx-auto px-4 py-8">
      <h1 className="font-serif text-3xl sm:text-4xl text-accent3 mb-6">
        Delete Story
      </h1>

      <p className="mb-6 text-accent3">
        Are you sure you want to permanently delete{" "}
        <span className="font-semibold">"{storyData.title}"</span>? This action
        cannot be undone.
      </p>

      <form action={deleteStory} className="space-y-6">
        <input type="hidden" name="story_id" value={storyData.story_id} />

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
          Yes, Delete Story
        </button>
      </form>
    </main>
  );
}
