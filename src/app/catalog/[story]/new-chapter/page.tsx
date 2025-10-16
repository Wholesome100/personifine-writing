import { sql } from "@/db/context";

import { notFound } from "next/navigation";
import NewChapterForm from "@/components/forms/chapter/NewChapterForm";

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

        <NewChapterForm storyData={storyData} />
      </div>
    </main>
  );
}
