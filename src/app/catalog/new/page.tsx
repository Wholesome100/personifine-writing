import { sql } from "@/db/context";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import bcrypt from "bcrypt";

async function createNewStory(formData: FormData) {
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

    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const description = formData.get("description") as string;
    const summary = formData.get("summary") as string;
    const featured = formData.get("featured") === "on";

    await sql.query(
      `INSERT INTO stories (user_id, title, slug, description, summary, featured)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [userData[0].user_id, title, slug, description, summary, featured],
    );

    console.log("Story created successfully.");
  } catch (err) {
    console.error("Error when creating new story:", err);
  }
}

export default async function NewStory() {
  return (
    <div className="flex flex-col min-h-screen bg-page-bg text-page-text">
      <Header />

      <main className="flex-grow flex items-center">
        <div className="max-w-5xl mx-auto px-4 w-full">
          <section className="mb-8">
            <h1 className="font-serif text-4xl sm:text-5xl text-accent1 mb-4">
              Create a New Story
            </h1>
          </section>

          {/* Form */}
          <form action={createNewStory} className="space-y-6">
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
                placeholder="Your story in 1-2 sentences."
              />
            </div>

            {/* Summary (longer overview) */}
            <div>
              <label className="block mb-1 font-medium" htmlFor="summary">
                Summary
              </label>
              <textarea
                id="summary"
                name="summary"
                rows={6}
                className="w-full border rounded px-3 py-2"
                placeholder="Introduce your story to readers."
              />
            </div>

            {/* Featured */}
            <div className="flex items-center">
              <input
                id="featured"
                name="featured"
                type="checkbox"
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
              Submit
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
