"use client";
import { createNewChapter } from "@/lib/actions/chapter/newChapter";
import { useActionState } from "react";

import FormCredentials from "@/components/forms/FormCredentials";

const initialState = {
  message: "",
};

export default function NewChapterForm(
  { storyData }: { storyData: any },
) {
  const [state, formAction, pending] = useActionState(
    createNewChapter,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="story_id" value={storyData.story_id} />
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
          placeholder="Your chapter in 1-2 sentences."
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
          className="w-full border rounded px-3 py-2 whitespace-pre-wrap resize-none"
          placeholder="Write something!"
        />
      </div>

      {state?.message && <p aria-live="polite">{state.message}</p>}
      <button
        type="submit"
        disabled={pending}
        className="bg-accent1 text-white px-4 py-2 rounded hover:bg-accent1-hover"
      >
        Submit
      </button>
    </form>
  );
}
