import { Eyebrow, Reveal, RevealGroup, RevealItem } from "@/components/site/ui/Primitives";
import { ambassadorPage } from "@/lib/content";
import { perkIcons } from "./creator-icons";

const { perks } = ambassadorPage;

export function AmbassadorPerks() {
  return (
    <section className="relative pb-[100px] min-[810px]:pb-[160px] min-[1200px]:pb-[200px]">
      <div className="container-page">
        <div className="flex flex-col gap-[30px] min-[810px]:gap-10 min-[1200px]:gap-[50px]">
          <Reveal className="flex max-w-[720px] flex-col items-start gap-2.5">
            <Eyebrow>{perks.eyebrow}</Eyebrow>
            <h2 className="t-h2">{perks.title}</h2>
            <p className="t-body-lg">{perks.description}</p>
          </Reveal>

          <RevealGroup step={0.08} className="grid gap-5 min-[810px]:grid-cols-2 min-[810px]:gap-[30px]">
            {perks.cards.map((card) => (
              <RevealItem
                key={card.title}
                className="group flex flex-col gap-5 rounded-[30px] bg-surface p-[26px] transition-colors duration-300 hover:bg-[linear-gradient(160deg,#e2f5ff_0%,#edf1f4_100%)] min-[810px]:p-10"
              >
                <span className="grid size-[54px] shrink-0 place-items-center rounded-[18px] bg-[linear-gradient(133deg,#406ae4_0%,#3b82f6_100%)] btn-emboss">
                  <span className="block size-7 text-white">{perkIcons[card.icon]}</span>
                </span>
                <div className="flex flex-col gap-2">
                  <h3 className="t-h4">{card.title}</h3>
                  <p className="t-body-lg">{card.description}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
