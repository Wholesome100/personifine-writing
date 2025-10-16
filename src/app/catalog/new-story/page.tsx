import NewStoryForm from "@/components/forms/story/NewStoryForm";

export default function NewStory() {
  return (
    <main className="flex-grow flex items-center">
      <div className="max-w-5xl mx-auto px-4 w-full">
        <section className="mb-8">
          <h1 className="font-serif text-4xl sm:text-5xl text-accent1 mb-4">
            Create a New Story
          </h1>
        </section>

        <NewStoryForm />
      </div>
    </main>
  );
}
