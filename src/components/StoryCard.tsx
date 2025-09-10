import Link from "next/link";

interface StoryCardProps {
  title: string;
  description: string;
  slug: string;
}

export default function StoryCard(
  { title, description, slug }: StoryCardProps,
) {
  return (
    <Link
      href={`/catalog/${slug}`}
      className="h-full p-4 sm:p-6 rounded-lg border border-page-text-muted/20 hover:border-accent2-hover transition-colors flex flex-col"
    >
      <h3 className="font-serif text-lg sm:text-xl text-accent1 mb-2">
        {title}
      </h3>
      <p className="text-page-text-muted flex-grow text-sm sm:text-base">
        {description}
      </p>
      <span className="mt-4 text-accent2 text-sm font-medium">
        Read more →
      </span>
    </Link>
  );
}
