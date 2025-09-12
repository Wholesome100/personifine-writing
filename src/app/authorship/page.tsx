import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { sql } from "@/db/context";

export default function Authorship() {
  async function createApplicant(formData: FormData) {
    "use server";

    const username = formData.get("username") as string;
    const contactEmail = formData.get("contact_email") as string;
    const pitch = formData.get("pitch") as string;

    await sql.query(
      "INSERT INTO applicants (username, contact_email, pitch) VALUES ($1, $2, $3)",
      [username, contactEmail, pitch],
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-page-bg text-page-text">
      <Header />

      {/* Centered main content */}
      <main className="flex-grow flex items-center">
        <div className="max-w-5xl mx-auto px-4 w-full">
          {/* Intro */}
          <section className="mb-8">
            <h1 className="font-serif text-4xl sm:text-5xl text-accent1 mb-4">
              Apply for Authorship
            </h1>
            <p className="text-page-text-muted max-w-prose">
              Thank you for your interest! If you would like to contribute a
              story to Personifine, please provide a username, a contact email
              where you can be reached, and a brief pitch for what you plan to
              write.
            </p>
          </section>

          {/* Form */}
          <form action={createApplicant} className="space-y-6">
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
              <label className="block mb-1 font-medium" htmlFor="contact_email">
                Contact Email
              </label>
              <input
                id="contact_email"
                name="contact_email"
                type="email"
                required
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium" htmlFor="pitch">
                What do you want to write?
              </label>
              <textarea
                id="pitch"
                name="pitch"
                required
                rows={4}
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
