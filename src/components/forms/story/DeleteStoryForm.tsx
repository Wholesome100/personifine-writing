"use client";

import { deleteStory } from "@/lib/actions/story/deleteStory";
import { useActionState } from "react";

import FormCredentials from "@/components/forms/FormCredentials";

const initialState = {
  message: "",
};

export default function DeleteStoryForm({ storyData }: { storyData: any }) {
  const [state, formAction, pending] = useActionState(
    deleteStory,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="story_id" value={storyData.story_id} />

      <div className="border border-accent3 rounded-md p-4 space-y-4">
        <h2 className="font-semibold text-accent3 mb-2">Confirm Credentials</h2>

        <FormCredentials />
      </div>

      {state?.message && <p aria-live="polite">{state.message}</p>}
      <button
        type="submit"
        disabled={pending}
        className="bg-accent3 text-page-bg px-4 py-2 rounded hover:bg-accent3-hover"
      >
        Yes, Delete Story
      </button>
    </form>
  );
}
