import { Radio } from "@/components/ui/radio";

const sortOptions = [
  { id: "newest", label: "جدیدترین" },
  { id: "most-viewed", label: "پربازدیدترین" },
  { id: "best-selling", label: "پر فروش ترین" },
];

function ReceivedLinksFilterContent({ selectedFilter, onFilterChange }) {
  return (
    <div className="flex flex-col pr-[10px]">
      {sortOptions.map((option, index) => (
        <>
          <div key={option.id} className="py-3">
            <Radio
              checked={selectedFilter === option.id}
              onChange={() => onFilterChange(option.id)}
              label={option.label}
            />
          </div>
          {sortOptions.length - 1 > index && (
            <div className="w-full h-[2px] mr-8 bg-gray-200" />
          )}
        </>
      ))}
    </div>
  );
}
export default ReceivedLinksFilterContent;
