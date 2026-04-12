"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/client/utils";

const FilterBox = ({ icon, options, value, onChange }) => {
  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center justify-center p-2 rounded-lg hover:bg-gray-200/50 transition-colors duration-200 focus:outline-none">
        {icon}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-40 bg-white/90 backdrop-blur-md border border-gray-200 rounded-md shadow-xl p-0"
      >
        {options.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onSelect={() => onChange(option.value)}
            className={cn(
              "text-right px-4 py-3 text-sm font-medium transition-colors duration-150 flex items-center justify-between group",
              value === option.value
                ? "bg-blue-50 text-primary"
                : "text-gray-700 hover:bg-gray-50",
            )}
          >
            <span>{option.label}</span>
            {value === option.value && (
              <div className="w-2 h-2 rounded-full bg-blue-600" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FilterBox;
