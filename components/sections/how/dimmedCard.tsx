import { Card, CardDescription, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Image from "next/image";

function DimmedCard({
  heading,
  description,
  className,
  image,
}: {
  heading: string;
  description: string;
  className?: string;
  image?: string;
}) {
  const cardClass =
    "pt-2 rounded-lg border-2 border-primary/20 shadow-md glass-3 from-brand-foreground/20 to-brand-foreground/0 bg-radial hover:from-brand-foreground/30 transition delay-150 duration-300 ease-in-out hover:to-brand-foreground/10";

  const imageSrc = image?.trim() ? image : "/logo.png";

  return (
    <Card
      className={cn(
        className,
        "flex flex-col opacity-100 card-anim bg-muted",
        cardClass
      )}
    >
      <CardContent className="p-2 lg:p-auto">
        <div className="p-1 lg:px-2 lg:mr-3 slg:gap-2 text-lg sm:text-xl font-bold flex items-center">
          {heading}

          <Image
            src={imageSrc}
            width={45}
            height={35}
            alt="logo"
			className = "w-8 h-6 lg:w-9 lg:h-8 ml-3 sm:ml-4 lg:ml-2"
          />
        </div>

        <CardDescription className="py-1 lg:pl-2 mt-0 text-muted-foreground max-w-lg">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
}

export default DimmedCard;
