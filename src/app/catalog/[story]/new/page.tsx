import { sql } from "@/db/context";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import bcrypt from "bcrypt";
import { notFound } from "next/navigation";

async function createNewChapter(formData: FormData) {
  "use server";

  try {
    const username = formData.get("username") as string;
    const passCode = formData.get("passcode") as string;

    const dbHash = await sql.query(
      "SELECT pass_code FROM users WHERE user_name = $1",
      [username],
    );

    if (dbHash.length !== 1) {
      throw new Error("Invalid Credentials.");
    }

    const match = await bcrypt.compare(passCode, dbHash[0]?.pass_code);
    if (!match) {
      throw new Error("Invalid Credentials.");
    }

    const userData = await sql.query(
      "SELECT user_id, role FROM users WHERE user_name = $1",
      [username],
    );

    if (!["author", "admin"].includes(userData[0].role)) {
      throw new Error("Unauthorized Operation.");
    }

    // Above flows are similar, but it needs to be checked:
    // 1. The story we're inserting into is owned by the user
    const story_id = formData.get("story_id") as string;

    const storyOwner = await sql.query(
      "SELECT user_id FROM stories WHERE story_id = $1",
      [story_id],
    );
    if (
      storyOwner.length !== 1 ||
      (storyOwner[0].user_id !== userData[0].user_id &&
        userData[0].role !== "admin")
    ) {
      throw new Error("Unauthorized Operation.");
    }

    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const description = formData.get("description") as string;
    const corpus = formData.get("corpus") as string;

    await sql.query(
      `INSERT INTO chapters (story_id, title, slug, description, corpus)
         VALUES ($1, $2, $3, $4, $5)`,
      [story_id, title, slug, description, corpus],
    );

    console.log("Chapter created successfully.");
  } catch (err: any) {
    console.error("Error when creating chapter:", err);
  }
}

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
    <div className="flex flex-col min-h-screen bg-page-bg text-page-text">
      <Header />

      <main className="flex-grow flex items-center">
        <div className="max-w-5xl mx-auto px-4 w-full">
          <section className="mb-8">
            <h1 className="font-serif text-4xl sm:text-5xl text-accent1 mb-4">
              Create a New Chapter
            </h1>
          </section>

          {/* Form */}
          <form action={createNewChapter} className="space-y-6">
            <input type="hidden" name="story_id" value={storyData.story_id} />
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

            {/* Title */}
            <div>
              <label className="block mb-1 font-medium" htmlFor="title">
                Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                className="w-full border rounded px-3 py-2"
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block mb-1 font-medium" htmlFor="slug">
                Slug
              </label>
              <input
                id="slug"
                name="slug"
                type="text"
                required
                className="w-full border rounded px-3 py-2"
              />
            </div>

            {/* Description (short tagline) */}
            <div>
              <label className="block mb-1 font-medium" htmlFor="description">
                Description
              </label>
              <input
                id="description"
                name="description"
                type="text"
                className="w-full border rounded px-3 py-2"
                placeholder="Your chapter in 1-2 sentences."
              />
            </div>

            {/* Summary (longer overview) */}
            <div>
              <label className="block mb-1 font-medium" htmlFor="corpus">
                Corpus
              </label>
              <textarea
                id="corpus"
                name="corpus"
                rows={6}
                className="w-full border rounded px-3 py-2"
                placeholder="Write something!"
              />
            </div>

            <button
              type="submit"
              className="bg-accent1 text-white px-4 py-2 rounded hover:bg-accent1-hover"
            >
              Submit
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
