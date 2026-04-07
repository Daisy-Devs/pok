import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card"; // adjust path
import Image from "next/image";

export default function CauseCard({ cause }: any) {
  return (
    <Card
      variant="cause"
      className="transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(99,102,241,0.15)]"
    >
      {/* Image */}
      {cause.image && (
        <div className="relative w-full aspect-392/202">
          <Image src={cause.image} alt={cause.title} fill className="object-cover rounded-t-2xl" />
        </div>
      )}

      {/* Tags */}
      <div className="flex items-center gap-2 p-2 mb-3 mt-5"> {/* mt-5 replaces mb-5 on image */}
        {cause.tags.map((tag: any, i: number) => (
          <span
            key={i}
            className={`text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full ${
              tag.variant === "primary" ? "bg-primary-light text-primary" : "bg-green-100 text-green-600"
            }`}
          >
            {tag.label}
          </span>
        ))}
      </div>

      <h3 className="px-3 font-bold text-secondary-color text-xl leading-snug mb-2">{cause.title}</h3>
      <p className="px-3 text-sm text-foreground leading-relaxed mb-4">{cause.description}</p>

      <div className="px-3 mb-4">
        <div className="flex justify-between text-xs mb-1.5">
          <span className="font-black text-secondary-color">{cause.raised} raised</span>
          <span className="font-bold text-primary">{cause.percentage}%</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-700 bg-primary" style={{ width: `${cause.percentage}%` }} />
        </div>
      </div>

      <div className="p-3">
        <Button className="w-full font-semibold" text="Donate" variant="blue" size='lg'/>
      </div>
    </Card>
  );
}