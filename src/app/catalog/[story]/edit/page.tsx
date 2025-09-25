import { sql } from "@/db/context";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { notFound } from "next/navigation";
import bcrypt from "bcrypt";

async function editStory(formData: FormData) {
  "use server";

  try {
    const username = formData.get("username") as string;
    const passCode = formData.get("passcode") as string;
    const storyId = formData.get("story_id") as string;

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

    // Get user info
    const userData = await sql.query(
      "SELECT user_id, role FROM users WHERE user_name = $1",
      [username],
    );

    // Ensure user is owner or admin
    const storyOwner = await sql.query(
      "SELECT user_id FROM stories WHERE story_id = $1",
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
    const summary = formData.get("summary") as string;
    const featured = formData.get("featured") === "on";

    // Update the story
    await sql.query(
      `UPDATE stories
       SET title = $1,
           slug = $2,
           description = $3,
           summary = $4,
           featured = $5,
           updated_at = now()
       WHERE story_id = $6`,
      [title, slug, description, summary, featured, storyId],
    );

    console.log("Story updated successfully.");
  } catch (err) {
    console.error("Error when editing story:", err);
  }
}

// Helper to fetch story by slug
async function getStory(slug: string) {
  const response = await sql.query(
    "SELECT story_id, title, slug, description, summary, featured FROM stories WHERE slug = $1",
    [slug],
  );
  return response;
}


export default async function EditStory(
  { params }: { params: Promise<{ story: string }> },
) {
  const { story } = await params;

  const response = await getStory(story);
  if (!response.length) {
    notFound();
  }

  const storyData = response[0];

  return (
    <div className="flex flex-col min-h-screen bg-page-bg text-page-text">
      <Header />

      <main className="flex-grow w-full max-w-3xl mx-auto px-4 py-8">
        <h1 className="font-serif text-3xl sm:text-4xl text-accent1 mb-6">
          Edit Story
        </h1>

        <form action={editStory} className="space-y-6">
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

          <div>
            <label className="block mb-1 font-medium" htmlFor="title">
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              defaultValue={storyData.title}
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
              defaultValue={storyData.slug}
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
              defaultValue={storyData.description}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium" htmlFor="summary">
              Summary
            </label>
            <textarea
              id="summary"
              name="summary"
              rows={6}
              defaultValue={storyData.summary}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div className="flex items-center">
            <input
              id="featured"
              name="featured"
              type="checkbox"
              defaultChecked={storyData.featured}
              className="mr-2"
            />
            <label htmlFor="featured" className="font-medium">
              Featured
            </label>
          </div>

          <button
            type="submit"
            className="bg-accent1 text-white px-4 py-2 rounded hover:bg-accent1-hover"
          >
            Save Changes
          </button>
        </form>
      </main>

      <Footer />
    </div>
  );
}
