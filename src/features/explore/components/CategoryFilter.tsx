import { Button } from "@/src/components/ui/button";

export default function CategoryFilter({
  active,
  setActive,
  categories,
}: {
  active: string;
  setActive: (val: string) => void;
  categories: string[];
}) {
 
  return (
   <div className="flex gap-2 overflow-x-auto no-scrollbar">
      {categories.map((cat) => {
        const isActive = active === cat;

        return (
          <Button
            key={cat}
            onClick={() => setActive(cat)}
            variant={isActive ? "blue" : "grey"}
            size="short"
            className="rounded-full whitespace-nowrap shrink-0"
          >
            {cat}
          </Button>
        );
      })}
    </div>
  );
}
