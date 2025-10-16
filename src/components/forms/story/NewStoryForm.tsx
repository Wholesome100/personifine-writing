"use client";

import { createNewStory } from "@/lib/actions/story/newStory";
import { useActionState } from "react";

import FormCredentials from "@/components/forms/FormCredentials";

const initialState = {
  message: "",
};

export default function NewStoryForm() {
  const [state, formAction, pending] = useActionState(
    createNewStory,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-6">
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
