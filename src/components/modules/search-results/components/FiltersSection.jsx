function FiltersSection({
  sortOptions,
  sortBy,
  setSortBy,
  setIsSpecsDialogOpen,
  setIsBrandDialogOpen,
  setIsPriceDialogOpen,
  setIsSellerTypeDialogOpen,
}) {
  return (
    <div className="mt-4 overflow-x-auto">
      <div className="flex items-center gap-0 min-w-max">
        {/* Sort Options */}
        <div className="flex items-center gap-5 pr-[10px] pl-[18px] border-l-2 border-gray-200">
          <span className="text-gray-800 shrink-0">ترتیب نمایش:</span>
          <div className="flex items-center gap-5">
            {sortOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setSortBy(option.id)}
                className={`transition-all shrink-0 cursor-pointer ${
                  sortBy === option.id
                    ? "text-primary"
                    : "text-gray-600 hover:opacity-80"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Specifications Filter */}
        <div className="px-4 border-l-2 border-gray-200">
          <button
            onClick={() => setIsSpecsDialogOpen(true)}
            className="text-primary shrink-0"
          >
            مشخصات خاصی در نظر دارید ؟
          </button>
        </div>

        {/* Brand Filter */}
        <div className="px-4 border-l-2 border-gray-200">
          <button
            onClick={() => setIsBrandDialogOpen(true)}
            className="text-primary shrink-0"
          >
            به برند خاصی علاقه دارید ؟
          </button>
        </div>

        {/* Price Range Filter */}
        <div className="px-4 border-l-2 border-gray-200">
          <button
            onClick={() => setIsPriceDialogOpen(true)}
            className="text-primary shrink-0"
          >
            بازه قیمتی
          </button>
        </div>

        {/* Seller Type Filter */}
        <div className="pr-4">
          <button
            onClick={() => setIsSellerTypeDialogOpen(true)}
            className="text-primary shrink-0"
          >
            نوع فروشنده
          </button>
        </div>
      </div>
    </div>
  );
}

export default FiltersSection;
