import { sql } from "@/db/context";

import StoryCard from "@/components/StoryCard";

// This is here to force the fetch to be dynamic for now. Revalidate functions will be added in the future
export const dynamic = "force-dynamic";

async function getCatalogStories() {
  const response =
    await sql`SELECT title, description, slug FROM stories ORDER BY created_at DESC`;
  return response;
}

export default async function Catalog() {
  const catalog = await getCatalogStories();

  return (
    <>
      <section className="py-6 border-b border-page-text-muted max-w-5xl mx-auto px-4 w-full">
        <h1 className="font-serif text-4xl sm:text-5xl text-accent1">
          All Stories
        </h1>
        <p className="mt-2 text-page-text-muted max-w-prose">
          Explore every story published on Personifine.
        </p>
      </section>
      <section className="flex flex-col flex-grow py-8 w-full max-w-5xl mx-auto px-4">
        {catalog.length > 0
          ? (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
              {catalog.map((story) => (
                <StoryCard
                  key={story.slug}
                  title={story.title}
                  description={story.description}
                  slug={story.slug}
                />
              ))}
            </div>
          )
          : <p className="text-page-text-muted">No stories found.</p>}
      </section>
    </>
  );
}
