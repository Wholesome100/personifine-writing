"use client";

import { editStory } from "@/lib/actions/story/editStory";
import { useActionState } from "react";

import FormCredentials from "@/components/forms/FormCredentials";

const initialState = {
  message: "",
};

export default function EditStoryForm({ storyData }: { storyData: any }) {
  const [state, formAction, pending] = useActionState(
    editStory,
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
          defaultValue={storyData.title}
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
          defaultValue={storyData.slug}
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
          defaultValue={storyData.description}
          className="w-full border rounded px-3 py-2"
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
          defaultValue={storyData.summary}
          className="w-full border rounded px-3 py-2 whitespace-pre-wrap resize-none"
        />
      </div>

      <div className="flex items-center">
        <input
          id="featured"
          name="featured"
          type="checkbox"
          defaultChecked={storyData.featured}
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
        className="bg-accent1 text-page-bg px-4 py-2 rounded hover:bg-accent1-hover"
      >
        Save Changes
      </button>
    </form>
  );
}
