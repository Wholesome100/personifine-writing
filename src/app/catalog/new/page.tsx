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

    // Error if we return no users with the given username
    if (dbHash.length != 1) {
      throw new Error("Invalid Credentials.");
    }

    const match = await bcrypt.compare(passCode, dbHash[0]?.pass_code);

    // Error if we have a mismatch between the given and hashed passcode
    if (!match) {
      throw new Error("Invalid Credentials.");
    }

    const userData = await sql.query(
      "SELECT user_id, role FROM users WHERE user_name = $1",
      [username],
    );
    
    // Error if the user doesn't have the proper role
    if (!["author", "admin"].includes(userData[0].role)){
      throw new Error("Unauthorized Operation.")
    }

    // Down here we need to insert the user id alongisde the form data into our stories
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
