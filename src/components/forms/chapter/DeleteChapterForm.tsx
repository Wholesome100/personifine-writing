"use client";

import { deleteChapter } from "@/lib/actions/chapter/deleteChapter";
import { useActionState } from "react";

import FormCredentials from "@/components/forms/FormCredentials";

const initialState = {
  message: "",
};

export default function DeleteChapterForm(
  { chapterData }: { chapterData: any },
) {
  const [state, formAction, pending] = useActionState(
    deleteChapter,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="story_id" value={chapterData.story_id} />
      <input
        type="hidden"
        name="chapter_id"
        value={chapterData.chapter_id}
      />

      <div className="border border-accent3 rounded-md p-4 space-y-4">
        <h2 className="font-semibold text-accent3 mb-2">
          Confirm Credentials
        </h2>

        <FormCredentials />
      </div>

      {state?.message && <p aria-live="polite">{state.message}</p>}
      <button
        type="submit"
        disabled={pending}
        className="bg-accent3 text-page-bg px-4 py-2 rounded hover:bg-accent3-hover"
      >
        Yes, Delete Chapter
      </button>
    </form>
  );
}
