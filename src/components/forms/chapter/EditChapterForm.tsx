"use client";
import { editChapter } from "@/lib/actions/chapter/editChapter";
import { useActionState } from "react";

import FormCredentials from "@/components/forms/FormCredentials";

const initialState = {
  message: "",
};

export default function EditChapterForm({ chapterData }: { chapterData: any }) {
  const [state, formAction, pending] = useActionState(
    editChapter,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="story_id" value={chapterData.story_id} />
      <input type="hidden" name="chapter_id" value={chapterData.chapter_id} />

      <FormCredentials />

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
          className="w-full border rounded px-3 py-2 whitespace-pre-wrap resize-none"
        />
      </div>

      {state?.message && <p aria-live="polite">{state.message}</p>}
      <button
        type="submit"
        disabled={pending}
        className="bg-accent1 text-page-bg px-4 py-2 rounded hover:bg-accent1-hover"
      >
        Save Changes
      </button>
    </form>
  );
}
