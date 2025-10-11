import DeleteStoryForm from "@/components/forms/story/DeleteStoryForm";
import { sql } from "@/db/context";
import { notFound } from "next/navigation";

// Workflow routes for delete will always fetch fresh data
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

      <DeleteStoryForm storyData={storyData} />
    </main>
  );
}
