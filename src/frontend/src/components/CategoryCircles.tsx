import { useRef } from "react";

const CATEGORIES = [
  { label: "New In", value: "New In", gradient: "from-rose-200 to-pink-300" },
  {
    label: "Bestsellers",
    value: "Bestsellers",
    gradient: "from-amber-200 to-orange-300",
  },
  { label: "Tops", value: "Tops", gradient: "from-sky-200 to-blue-300" },
  {
    label: "Shirts",
    value: "Shirts",
    gradient: "from-teal-200 to-emerald-300",
  },
  {
    label: "Dresses",
    value: "Dresses",
    gradient: "from-violet-200 to-purple-300",
  },
  {
    label: "Co-ord Sets",
    value: "Co-ord Sets",
    gradient: "from-fuchsia-200 to-pink-300",
  },
  {
    label: "Party Wear",
    value: "Party Wear",
    gradient: "from-indigo-200 to-blue-300",
  },
  { label: "Spring", value: "Spring", gradient: "from-lime-200 to-green-300" },
  {
    label: "Jewellery",
    value: "Jewellery",
    gradient: "from-yellow-200 to-amber-300",
  },
  {
    label: "Pants & Skirts",
    value: "Pants & Skirts",
    gradient: "from-slate-200 to-gray-300",
  },
  {
    label: "Ethnic Wear",
    value: "Ethnic Wear",
    gradient: "from-red-200 to-orange-300",
  },
  {
    label: "Plus Size",
    value: "Plus Size",
    gradient: "from-pink-200 to-rose-300",
  },
  { label: "Sale", value: "Sale", gradient: "from-red-300 to-red-500" },
];

interface CategoryCirclesProps {
  activeCategory: string;
  onCategoryChange: (cat: string) => void;
}

export function CategoryCircles({
  activeCategory,
  onCategoryChange,
}: CategoryCirclesProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="border-b border-border bg-background">
      <div
        ref={scrollRef}
        className="flex gap-5 px-4 py-4 overflow-x-auto scrollbar-hide max-w-7xl mx-auto"
        style={{ scrollbarWidth: "none" }}
      >
        {CATEGORIES.map((cat, i) => (
          <button
            type="button"
            key={cat.value}
            data-ocid={`category.tab.${i + 1}`}
            onClick={() => onCategoryChange(cat.value)}
            className="flex flex-col items-center gap-2 flex-shrink-0 group"
          >
            <div
              className={`w-16 h-16 rounded-full bg-gradient-to-br ${cat.gradient} transition-all duration-200 ${
                activeCategory === cat.value
                  ? "ring-2 ring-foreground ring-offset-2 scale-105"
                  : "group-hover:scale-105"
              }`}
            />
            <span
              className={`text-xs text-center leading-tight max-w-[64px] ${
                activeCategory === cat.value
                  ? "font-semibold"
                  : "text-foreground/70"
              }`}
            >
              {cat.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
