import { cn } from "@/lib/utils";

interface FilterChipsProps {
  activeFilters: string[];
  onFilterToggle: (filter: string) => void;
}

const filters = ["All", "Online", "Offline", "Unauthorized"];

const FilterChips = ({ activeFilters, onFilterToggle }: FilterChipsProps) => {
  return (
    <div className="p-4 border-b border-border">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-foreground mr-2">Filter:</span>
        <div className="flex gap-2">
          {filters.map((filter) => {
            const isActive = activeFilters.includes(filter);
            return (
              <button
                key={filter}
                onClick={() => onFilterToggle(filter)}
                className={cn(
                  "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                )}
              >
                {filter}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FilterChips;
