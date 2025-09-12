import { sql } from "@/db/context";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StoryCard from "@/components/StoryCard";

async function getCatalogStories() {
  const response =
    await sql`SELECT title, description, slug FROM stories ORDER BY created_at DESC`;
  return response;
}

export default async function Catalog() {
  const catalog = await getCatalogStories();

  return (
    <div className="flex flex-col min-h-screen bg-page-bg text-page-text">
      <Header />

      {/* Title & Intro */}
      <section className="py-6 border-b border-page-text-muted max-w-5xl mx-auto px-4 w-full">
        <h1 className="font-serif text-4xl sm:text-5xl text-accent1">
          All Stories
        </h1>
        <p className="mt-2 text-page-text-muted max-w-prose">
          Explore every story published on Personifine.
        </p>
      </section>

      {/* Story Grid */}
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

      <Footer />
    </div>
  );
}
