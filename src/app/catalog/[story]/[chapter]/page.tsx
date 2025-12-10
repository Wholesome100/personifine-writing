import { sql } from "@/db/context";
import { notFound } from "next/navigation";

// This is here to force the fetch to be dynamic for now. Revalidate functions will be added in the future
export const dynamic = "force-dynamic";

async function getCorpus(slug: string) {
  const response = await sql.query(
    "SELECT chapter_id, title, corpus FROM chapters WHERE slug = $1",
    [slug],
  );
  return response;
}

export default async function Chapter(
  { params }: { params: Promise<{ chapter: string }> },
) {
  const { chapter } = await params;

  const response = await getCorpus(chapter);
  if (!response.length) {
    notFound();
  }
  // Unpack the returned corpus if valid
  const chapterData = response[0];

  return (
    <main className="grow w-full max-w-3xl mx-auto px-4 py-8">
      <h1 className="font-serif text-3xl sm:text-4xl text-accent1 mb-6">
        {chapterData.title}
      </h1>

      <div className="text-lg leading-relaxed whitespace-pre-wrap">
        {chapterData.corpus}
      </div>
    </main>
  );
}
