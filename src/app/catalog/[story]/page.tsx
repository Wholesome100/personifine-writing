import { sql } from "@/db/context";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { notFound } from "next/navigation";

// This is here to force the fetch to be dynamic for now. Revalidate functions will be added in the future
export const dynamic = "force-dynamic";

async function getStoryDetails(slug: string) {
  const response = await sql.query(
    "SELECT story_id, title, summary FROM stories WHERE slug = $1",
    [slug],
  );
  return response;
}

async function getChapterDetails(story_id: string) {
  const response = await sql.query(
    "SELECT chapter_id, title, description, slug FROM chapters WHERE story_ID = $1 ORDER BY created_at ASC",
    [story_id],
  );
  return response;
}

export default async function Story(
  { params }: { params: Promise<{ story: string }> },
) {
  const { story } = await params;

  const metadata = await getStoryDetails(story);
  if (!metadata.length) {
    notFound();
  }
  // Unpack the returned metadata if valid
  const storyData = metadata[0];

  const chapters = await getChapterDetails(storyData.story_id);
  return (
    <div className="flex flex-col min-h-screen bg-page-bg text-page-text">
      <Header />

      <main className="flex-grow max-w-5xl mx-auto px-4 py-8">
        {/* Story Header */}
        <header className="mb-8">
          <h1 className="font-serif text-4xl sm:text-5xl text-accent1 mb-2">
            {storyData.title}
          </h1>
          <p className="text-page-text-muted max-w-prose">
            {storyData.summary}
          </p>
        </header>

        {/* Chapters: Will be refactored into client components later */}
        <section>
          <h2 className="font-serif text-2xl text-accent2 mb-4">Chapters</h2>
          {chapters.length > 0
            ? (
              <ul className="space-y-4">
                {chapters.map((ch) => (
                  <li
                    key={ch.chapter_id}
                    className="p-4 border border-accent1 rounded-lg hover:bg-accent1-hover hover:text-page-bg transition-colors"
                  >
                    <Link href={`/catalog/${story}/${ch.slug}`}>
                      <h3 className="font-serif text-xl">{ch.title}</h3>
                      <p className="text-sm text-page-text-muted">
                        {ch.description}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            )
            : <p className="text-page-text-muted">No chapters yet.</p>}
        </section>
      </main>

      <Footer />
    </div>
  );
}
