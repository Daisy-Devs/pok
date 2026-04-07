import { Button } from "@/src/components/ui/button";

export default function CategoryFilter({
  active,
  setActive,
}: {
  active: string;
  setActive: (val: string) => void;
}) {
  const categories = [
  "All",
  "ENVIRONMENT",
  "EDUCATION",
  "DISASTER RELIEF",
  "HEALTH",
];

  return (
    <div className="flex gap-2 flex-wrap">
  {categories.map((cat) => {
    const isActive = active === cat;

    return (
      <Button
        key={cat}
        onClick={() => setActive(cat)}
        variant={isActive ? "blue" : "grey"}
        size="short"
        className="rounded-full"
      >
        {cat}
      </Button>
    );
  })}
</div>
  );
}