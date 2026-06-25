import { useState } from "react";
import { formatPrice } from "@/lib/client/utils";

const sellerTypeOptions = [
  { id: "all", label: "همه فروشندگان" },
  { id: "special", label: "فروشندگان ویژه" },
  { id: "official", label: "فروشندگان رسمی" },
  { id: "local", label: "فروشندگان بومی" },
];

const sortOptions = [
  { id: "mostSold", label: "پرفروش‌ترین" },
  { id: "newest", label: "جدیدترین" },
  { id: "mostViewed", label: "پربازدیدترین" },
  { id: "cheapest", label: "ارزان ترین" },
  { id: "expensive", label: "گران ترین" },
];

const mobileFilters = [
  { id: "sort", label: "اولویت نمایش" },
  { id: "price", label: "محدوده قیمت" },
  { id: "brand", label: "برند" },
  { id: "specs", label: "مشخصات" },
  { id: "seller", label: "نوع فروشنده" },
];

const MIN_PRICE = 500;
const MAX_PRICE = 100000000;

function useMobileProductFilters() {
  const [sortBy, setSortBy] = useState("newest");
  const [showAvailable, setShowAvailable] = useState(true);
  const [isFiltersDrawerOpen, setIsFiltersDrawerOpen] = useState(false);
  const [expandedFilter, setExpandedFilter] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedSpecs, setSelectedSpecs] = useState([]);
  const [sellerType, setSellerType] = useState("all");
  const [priceRange, setPriceRange] = useState([MIN_PRICE, MAX_PRICE]);

  const handleBrandToggle = (brandId) => {
    setSelectedBrands((prev) =>
      prev.includes(brandId)
        ? prev.filter((id) => id !== brandId)
        : [...prev, brandId],
    );
  };

  const handleSpecToggle = (optionId) => {
    setSelectedSpecs((prev) =>
      prev.includes(optionId)
        ? prev.filter((id) => id !== optionId)
        : [...prev, optionId],
    );
  };

  const handleFilterToggle = (filterId) => {
    setExpandedFilter((prev) =>
      prev.includes(filterId)
        ? prev.filter((id) => id !== filterId)
        : [...prev, filterId],
    );
  };

  const hasFiltersChanged = () => {
    return (
      sortBy !== "newest" ||
      selectedBrands.length > 0 ||
      selectedSpecs.length > 0 ||
      sellerType !== "all" ||
      priceRange[0] !== MIN_PRICE ||
      priceRange[1] !== MAX_PRICE
    );
  };

  const handleResetFilters = () => {
    setSortBy("newest");
    setSelectedBrands([]);
    setSelectedSpecs([]);
    setSellerType("all");
    setPriceRange([MIN_PRICE, MAX_PRICE]);
    setExpandedFilter([]);
  };

  const getFilterValue = (filterId) => {
    switch (filterId) {
      case "sort":
        return sortOptions.find((o) => o.id === sortBy)?.label || "";
      case "price":
        return `${formatPrice(priceRange[0])} تا ${formatPrice(priceRange[1])} تومان`;
      case "brand":
        return selectedBrands.length > 0 ? `${selectedBrands.length} برند` : "";
      case "specs":
        return selectedSpecs.length > 0 ? `${selectedSpecs.length} مورد` : "";
      case "seller":
        return sellerTypeOptions.find((o) => o.id === sellerType)?.label || "";
      default:
        return "";
    }
  };

  const sortLabel = sortOptions.find((o) => o.id === sortBy)?.label || "";

  const filtersDrawerProps = {
    isOpen: isFiltersDrawerOpen,
    onClose: () => setIsFiltersDrawerOpen(false),
    mobileFilters,
    expandedFilter,
    onFilterToggle: handleFilterToggle,
    getFilterValue,
    sortBy,
    onSortChange: setSortBy,
    priceRange,
    onPriceChange: setPriceRange,
    minPrice: MIN_PRICE,
    maxPrice: MAX_PRICE,
    selectedBrands,
    onBrandToggle: handleBrandToggle,
    selectedSpecs,
    onSpecToggle: handleSpecToggle,
    sellerType,
    onSellerTypeChange: setSellerType,
    hasFiltersChanged,
    onResetFilters: handleResetFilters,
    availableProductsIconActive: showAvailable,
    onAvailableProductsToggle: () => setShowAvailable((prev) => !prev),
  };

  return {
    sortLabel,
    openFiltersDrawer: () => setIsFiltersDrawerOpen(true),
    filtersDrawerProps,
  };
}

export default useMobileProductFilters;
