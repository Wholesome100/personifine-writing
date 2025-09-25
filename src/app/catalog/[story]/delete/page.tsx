import { sql } from "@/db/context";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { notFound, redirect } from "next/navigation";
import bcrypt from "bcrypt";

// Inline server action for deleting a story
async function deleteStory(formData: FormData) {
  "use server";

  try {
    const username = formData.get("username") as string;
    const passCode = formData.get("passcode") as string;
    const storyId = formData.get("story_id") as string;

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

    // Delete the story
    await sql.query("DELETE FROM stories WHERE story_id = $1", [storyId]);

    // Redirect back to catalog
    redirect("/catalog");
  } catch (err: any) {
    if (err?.digest?.startsWith("NEXT_REDIRECT")) throw err;
    console.error("Error when deleting story:", err);
  }
}

// Helper to fetch story by slug
async function getStory(slug: string) {
  const response = await sql.query(
    "SELECT story_id, title FROM stories WHERE slug = $1",
    [slug],
  );
  return response;
}

export default async function DeleteStory(
  { params }: { params: Promise<{ story: string }> },
) {
  const { story } = await params;

  const response = await getStory(story);
  if (!response.length) notFound();

  const storyData = response[0];

  return (
    <div className="flex flex-col min-h-screen bg-page-bg text-page-text">
      <Header />

      <main className="flex-grow w-full max-w-3xl mx-auto px-4 py-8">
        <h1 className="font-serif text-3xl sm:text-4xl text-accent3 mb-6">
          Delete Story
        </h1>

        <p className="mb-6 text-accent3">
          Are you sure you want to permanently delete{" "}
          <span className="font-semibold">"{storyData.title}"</span>? This
          action cannot be undone.
        </p>

        <form action={deleteStory} className="space-y-6">
          <input type="hidden" name="story_id" value={storyData.story_id} />

          <div className="border border-accent3 rounded-md p-4 space-y-4">
            <h2 className="font-semibold text-accent3 mb-2">
              Confirm Credentials
            </h2>

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

          <button
            type="submit"
            className="bg-accent3 text-page-bg px-4 py-2 rounded hover:bg-accent3-hover"
          >
            Yes, Delete Story
          </button>
        </form>
      </main>

      <Footer />
    </div>
  );
}
