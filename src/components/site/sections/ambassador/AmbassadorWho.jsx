import Image from "next/image";
import { Eyebrow, Reveal } from "@/components/site/ui/Primitives";
import { assets } from "@/lib/assets";
import { ambassadorPage } from "@/lib/content";
import { platformColor, platformIcons } from "./creator-icons";

const { who } = ambassadorPage;

export function AmbassadorWho() {
  return (
    <section className="relative isolate py-[100px] min-[810px]:py-[160px] min-[1200px]:py-[200px]">
      <Image
        src={assets.featurePage.bg}
        alt=""
        fill
        sizes="100vw"
        className="-z-10 object-cover"
      />
      <span className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[100px] bg-[linear-gradient(0deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.7)_25%,#fff_50%)] min-[810px]:h-[160px] min-[1200px]:h-[200px]" />
      <span className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[100px] bg-[linear-gradient(rgba(255,255,255,0)_0%,rgba(255,255,255,0.7)_25%,#fff_50%)] min-[810px]:h-[160px] min-[1200px]:h-[200px]" />

      <div className="container-page">
        {/* one card floating on the meadow — body copy set straight on the photo
            is unreadable, and this route has no product shot to break it up */}
        <Reveal
          y={30}
          className="rounded-[30px] bg-white p-[26px] shadow-[0_24px_60px_rgba(29,29,29,0.10)] min-[810px]:p-10 min-[1200px]:p-[60px]"
        >
          <div className="grid gap-10 min-[1000px]:grid-cols-2 min-[1000px]:items-center min-[1000px]:gap-[60px]">
            <div className="flex flex-col items-start gap-5">
              <div className="flex flex-col items-start gap-2.5">
                <Eyebrow>{who.eyebrow}</Eyebrow>
                <h2 className="t-h2">{who.title}</h2>
                <p className="t-body-lg">{who.description}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {who.platforms.map((name) => {
                  const platform = name;
                  return (
                    <span
                      key={name}
                      className="flex items-center gap-2 rounded-full bg-surface px-3.5 py-2.5"
                    >
                      <span
                        className="block size-[16px]"
                        style={{ color: platformColor[platform] }}
                      >
                        {platformIcons[platform]}
                      </span>
                      <span className="text-[14px] leading-none font-semibold text-ink">
                        {name}
                      </span>
                    </span>
                  );
                })}
              </div>
            </div>

            <ul className="flex flex-col gap-2.5">
              {who.fits.map((fit) => (
                <li
                  key={fit}
                  className="flex items-center gap-3.5 rounded-[16px] bg-surface px-5 py-4"
                >
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-success-20">
                    <svg viewBox="0 0 24 24" aria-hidden className="size-3.5 text-success">
                      <path
                        d="M6 12.4l4 4L18 7.6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span className="text-[16px] leading-[1.3] font-semibold text-ink">{fit}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
