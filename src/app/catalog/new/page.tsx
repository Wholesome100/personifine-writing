import { sql } from "@/db/context";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import bcrypt from "bcrypt";

const saltRounds = 12;

async function createNewStory(formData: FormData) {
  "use server";

  const username = formData.get("username") as string;
  const contactEmail = formData.get("contact_email") as string;
  const pitch = formData.get("pitch") as string;
  const passCode = formData.get("passcode") as string;

  // await sql.query(
  //   "INSERT INTO stories (username, contact_email, pitch) VALUES ($1, $2, $3)",
  //   [username, contactEmail, pitch],
  // );
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
            <div>
              <label className="block mb-1 font-medium" htmlFor="passcode">
                Passcode
              </label>
              <input
                id="passcode"
                name="passcode"
                type="text"
                required
                className="w-full border rounded px-3 py-2"
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
