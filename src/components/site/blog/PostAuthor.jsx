import Image from "next/image";

/** Byline under an article's title: avatar, name, and role. */
export function PostAuthor({ author }) {
  const name = author.linkedInUrl ? (
    <a
      href={author.linkedInUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="transition-colors duration-300 hover:text-brand"
    >
      {author.name}
    </a>
  ) : (
    author.name
  );

  return (
    <div className="flex items-center gap-3">
      {author.image && (
        <Image
          src={author.image}
          alt={author.imageAlt ?? author.name}
          width={48}
          height={48}
          className="size-12 rounded-full object-cover"
        />
      )}
      <div className="flex flex-col text-left">
        <span className="text-[16px] leading-[1.3] font-semibold text-ink">
          {name}
        </span>
        {author.role && <span className="t-body-sm">{author.role}</span>}
      </div>
    </div>
  );
}
