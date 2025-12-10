import Link from "next/link";
import { sql } from "@/db/context";

import StoryCard from "@/components/StoryCard";

// This is here to force the fetch to be dynamic for now. Revalidate functions will be added in the future
export const dynamic = "force-dynamic";

async function getFeatured() {
  const response =
    await sql`SELECT title, description, slug FROM stories WHERE featured=TRUE ORDER BY created_at DESC`;
  return response;
}

export default async function Home() {
  const stories = await getFeatured();

  return (
    <main className="flex flex-col grow">
      {/* Shared container for hero + stories */}
      <div className="grow max-w-5xl mx-auto px-4 w-full flex flex-col">
        {/* Hero / Logo */}
        <section className="py-6">
          <h1 className="font-serif text-4xl sm:text-5xl text-accent1">
            Personifine
          </h1>
          <p className="mt-2 text-page-text-muted max-w-prose">
            Bringing stories to life~
          </p>
        </section>

        {/* Featured Stories */}
        <section className="flex flex-col grow py-8 w-full">
          <h2 className="font-serif text-2xl text-accent2 mb-6">
            Featured Stories
          </h2>
          {stories.length > 0
            ? (
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr grow">
                {stories.map((story) => (
                  <StoryCard
                    key={story.slug}
                    title={story.title}
                    description={story.description}
                    slug={story.slug}
                  />
                ))}
              </div>
            )
            : (
              <p className="text-page-text-muted">
                No featured stories yet.
              </p>
            )}
        </section>
      </div>

      {/* Authorship CTA */}
      <section className="px-4 py-4 bg-accent3 text-page-bg text-center rounded-lg max-w-md mx-auto mb-8">
        <h2 className="font-serif text-lg mb-1">Authorship</h2>
        <p className="mb-3 max-w-prose mx-auto text-sm">
          Personifine is a small, personal project to showcase writing. If you
          have a story to tell, apply for authorship.
        </p>
        <Link
          href="/authorship"
          className="inline-block px-3 py-2 bg-page-bg text-accent3 font-semibold rounded hover:bg-page-text hover:text-page-bg transition-colors text-sm"
        >
          Apply Now
        </Link>
      </section>
    </main>
  );
}
