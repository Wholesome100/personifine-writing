import { sql } from "@/db/context";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { notFound, redirect } from "next/navigation";
import bcrypt from "bcrypt";

async function editChapter(formData: FormData) {
  "use server";

  try {
    const username = formData.get("username") as string;
    const passCode = formData.get("passcode") as string;
    const storyId = formData.get("story_id") as string;
    const chapterId = formData.get("chapter_id") as string;

    // Verify credentials
    const dbHash = await sql.query(
      "SELECT pass_code FROM users WHERE user_name = $1",
      [username],
    );
    if (dbHash.length !== 1) throw new Error("Invalid Credentials.");

    const match = await bcrypt.compare(passCode, dbHash[0]?.pass_code);
    if (!match) throw new Error("Invalid Credentials.");

    // Get user info
    const userData = await sql.query(
      "SELECT user_id, role FROM users WHERE user_name = $1",
      [username],
    );

    // Ensure user is owner or admin
    const storyOwner = await sql.query(
      "SELECT user_id, slug FROM stories WHERE story_id = $1",
      [storyId],
    );
    if (
      storyOwner.length !== 1 ||
      (storyOwner[0].user_id !== userData[0].user_id &&
        userData[0].role !== "admin")
    ) {
      throw new Error("Unauthorized Operation.");
    }

    // Collect updated fields
    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const description = formData.get("description") as string;
    const corpus = formData.get("corpus") as string;

    // Update the chapter
    await sql.query(
      `UPDATE chapters
       SET title = $1,
           slug = $2,
           description = $3,
           corpus = $4,
           updated_at = now()
       WHERE chapter_id = $5
         AND story_id = $6`,
      [title, slug, description, corpus, chapterId, storyId],
    );

    console.log("Chapter updated successfully.");
    redirect(`/catalog/${storyOwner[0].slug}/${slug}`);
  } catch (err: any) {
    if (err?.digest?.startsWith("NEXT_REDIRECT")) {
      throw err;
    }
    console.error("Error when editing chapter:", err);
  }
}

// Helper to fetch chapter by story + chapter slug
async function getChapter(storySlug: string, chapterSlug: string) {
  const response = await sql.query(
    `SELECT c.chapter_id, c.story_id, c.title, c.slug, c.description, c.corpus,
            s.slug AS story_slug
       FROM chapters c
       JOIN stories s ON c.story_id = s.story_id
      WHERE s.slug = $1 AND c.slug = $2`,
    [storySlug, chapterSlug],
  );
  return response;
}

export default async function EditChapter(
  { params }: { params: Promise<{ story: string; chapter: string }> },
) {
  const { story, chapter } = await params;

  const response = await getChapter(story, chapter);
  if (!response.length) notFound();

  const chapterData = response[0];

  return (
    <div className="flex flex-col min-h-screen bg-page-bg text-page-text">
      <Header />

      <main className="flex-grow w-full max-w-3xl mx-auto px-4 py-8">
        <h1 className="font-serif text-3xl sm:text-4xl text-accent1 mb-6">
          Edit Chapter
        </h1>

        <form action={editChapter} className="space-y-6">
          <input type="hidden" name="story_id" value={chapterData.story_id} />
          <input type="hidden" name="chapter_id" value={chapterData.chapter_id} />

          {/* Credentials Section */}
          <div className="border border-accent1 rounded-md p-4 space-y-4">
            <h2 className="font-semibold text-accent1 mb-2">Credentials</h2>

            <div>
              <label className="block mb-1 font-medium" htmlFor="username">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium" htmlFor="passcode">
                Passcode
              </label>
              <input
                id="passcode"
                name="passcode"
                type="password"
                required
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>

          {/* Chapter Fields */}
          <div>
            <label className="block mb-1 font-medium" htmlFor="title">
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              defaultValue={chapterData.title}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium" htmlFor="slug">
              Slug
            </label>
            <input
              id="slug"
              name="slug"
              type="text"
              defaultValue={chapterData.slug}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium" htmlFor="description">
              Description
            </label>
            <input
              id="description"
              name="description"
              type="text"
              defaultValue={chapterData.description}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium" htmlFor="corpus">
              Corpus
            </label>
            <textarea
              id="corpus"
              name="corpus"
              rows={6}
              defaultValue={chapterData.corpus}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <button
            type="submit"
            className="bg-accent1 text-page-bg px-4 py-2 rounded hover:bg-accent1-hover"
          >
            Save Changes
          </button>
        </form>
      </main>

      <Footer />
    </div>
  );
}
