import EditStoryForm from "@/components/forms/story/EditStoryForm";
import { sql } from "@/db/context";
import { notFound } from "next/navigation";

// Workflow routes for edit will always fetch fresh data
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

      <EditStoryForm storyData={storyData} />
    </main>
  );
}
