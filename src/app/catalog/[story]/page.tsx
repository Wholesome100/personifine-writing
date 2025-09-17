import { sql } from "@/db/context";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

async function getStoryDetails(slug: string) {
  const response =
    await sql.query("SELECT story_id, title, summary FROM stories WHERE slug = $1", [slug]);
  return response;
}

async function getChapterDetails(story_id: string) {
  const response =
    await sql.query("SELECT chapter_id, title, description FROM chapters WHERE story_ID = $1 ORDER BY sequence ASC",
      [story_id]
    );
  return response;
}

export default async function Story(
  { params }: { params: Promise<{ story: string }> },
) {
  const { story } = await params;
  console.log(story)
  const metadata = await getStoryDetails(story)
  const chapters = await getChapterDetails(metadata[0]?.story_id)
  console.log(metadata)
  console.log(chapters)

  return (
    
    <div>
      <Header />
      <span>This is the page with an overview of the current story.</span>;
      <span>{story}</span>
      <Footer />
    </div>
  );
}
