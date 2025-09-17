import { sql } from "@/db/context";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { notFound } from "next/navigation";

async function getCorpus(slug: string) {
  const response = await sql.query(
    "SELECT chapter_id, sequence, corpus FROM chapters WHERE slug = $1",
    [slug],
  );
  return response;
}

export default async function Chapter(
  { params }: { params: Promise<{ chapter: string }> },
) {
  const { chapter } = await params;
  console.log(chapter);

  const response = await getCorpus(chapter);
  if (!response.length) {
    notFound();
  }
  // Unpack the returned corpus if valid
  const chapterData = response[0];
  console.log(chapterData);

  return (
    <div className="flex flex-col min-h-screen bg-page-bg text-page-text">
      <Header />

      <main className="flex-grow w-full max-w-3xl mx-auto px-4 py-8">
        <h1 className="font-serif text-3xl sm:text-4xl text-accent1 mb-6">
          Chapter {chapterData.sequence}
        </h1>

        <p className="leading-relaxed whitespace-pre-line text-lg">
          {chapterData.corpus}
        </p>
      </main>

      <Footer />
    </div>
  );
}
