import FormCredentials from "@/components/FormCredentials";

import { createNewStory } from "@/lib/actions/storyActions";

export default async function NewStory() {
  return (
    <main className="flex-grow flex items-center">
      <div className="max-w-5xl mx-auto px-4 w-full">
        <section className="mb-8">
          <h1 className="font-serif text-4xl sm:text-5xl text-accent1 mb-4">
            Create a New Story
          </h1>
        </section>

        <form action={createNewStory} className="space-y-6">
          <FormCredentials />

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

          <div>
            <label className="block mb-1 font-medium" htmlFor="summary">
              Summary
            </label>
            <textarea
              id="summary"
              name="summary"
              rows={6}
              className="w-full border rounded px-3 py-2 whitespace-pre-wrap resize-none"
              placeholder="Introduce your story to readers."
            />
          </div>
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
  );
}
