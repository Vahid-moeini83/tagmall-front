"use client";

import { useState } from "react";
import { MoreCircleIcon, MinusCircleIcon, CloseCircleIcon } from "@/icons";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

// Mock data - بعداً از API میاد
const mockHistory = [
  {
    id: 1,
    type: "category",
    name: "گوشی موبایل",
    subcategories: [
      { id: 11, name: "سامسونگ" },
      { id: 12, name: "اپل" },
      { id: 13, name: "شیائومی" },
    ],
  },
  {
    id: 2,
    type: "product",
    name: "ایرپاد پرو",
  },
  {
    id: 3,
    type: "category",
    name: "لپ تاپ",
    subcategories: [
      { id: 31, name: "ایسوس" },
      { id: 32, name: "لنوو" },
    ],
  },
  {
    id: 4,
    type: "product",
    name: "کیبورد مکانیکی",
  },
];

function SearchHistory() {
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [historyItems, setHistoryItems] = useState(mockHistory);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteMode, setDeleteMode] = useState(false);

  const toggleCategory = (categoryId) => {
    setExpandedCategory((prev) => (prev === categoryId ? null : categoryId));
  };

  const handleDeleteModeToggle = () => {
    if (deleteMode) {
      handleDeleteClick(
        expandedCategory
          ? { type: "category", id: expandedCategory }
          : { type: "all" },
      );
    } else {
      setDeleteMode(true);
    }
  };

  const handleDeleteClick = (target) => {
    setDeleteTarget(target);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteTarget?.type === "all") {
      setHistoryItems([]);
    } else if (deleteTarget?.type === "category") {
      setHistoryItems((prev) =>
        prev.filter((item) => item.id !== deleteTarget.id),
      );
      if (expandedCategory === deleteTarget.id) {
        setExpandedCategory(null);
      }
    } else if (deleteTarget?.type === "item") {
      setHistoryItems((prev) =>
        prev.filter((item) => item.id !== deleteTarget.id),
      );
    } else if (deleteTarget?.type === "subcategory") {
      setHistoryItems((prev) =>
        prev.map((item) => {
          if (item.id === deleteTarget.categoryId) {
            return {
              ...item,
              subcategories: item.subcategories.filter(
                (sub) => sub.id !== deleteTarget.id,
              ),
            };
          }
          return item;
        }),
      );
    }
    setDeleteDialogOpen(false);
    setDeleteTarget(null);
    setDeleteMode(false);
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setDeleteTarget(null);
  };

  const expandedCategoryData = historyItems.find(
    (item) => item.id === expandedCategory,
  );

  const getDeleteButtonText = () => {
    if (deleteMode) {
      if (expandedCategory && expandedCategoryData) {
        return `پاک کردن همه بازدیدهای اخیر "${expandedCategoryData.name}"`;
      }
      return "پاک کردن همه تاریخچه جست و جو و بازدیدهای اخیر";
    }
    if (expandedCategory && expandedCategoryData) {
      return `پاک کردن بازدیدهای اخیر "${expandedCategoryData.name}"`;
    }
    return "پاک کردن تاریخچه جست و جو و بازدیدهای اخیر";
  };

  const getDialogText = () => {
    if (deleteTarget?.type === "all") {
      return "آیا از پاک کردن همه تاریخچه جست و جو و بازدیدهای اخیر اطمینان دارید؟";
    } else if (deleteTarget?.type === "category") {
      const category = historyItems.find((item) => item.id === deleteTarget.id);
      return `آیا از پاک کردن همه بازدیدهای اخیر "${category?.name}" اطمینان دارید؟`;
    } else if (deleteTarget?.type === "item") {
      const item = historyItems.find((i) => i.id === deleteTarget.id);
      return `آیا از پاک کردن "${item?.name}" اطمینان دارید؟`;
    } else if (deleteTarget?.type === "subcategory") {
      const category = historyItems.find(
        (item) => item.id === deleteTarget.categoryId,
      );
      const subcategory = category?.subcategories.find(
        (sub) => sub.id === deleteTarget.id,
      );
      return `آیا از پاک کردن "${subcategory?.name}" اطمینان دارید؟`;
    }
    return "";
  };

  const showDeleteButtons = deleteMode && !expandedCategory;
  const showSubcategoryDeleteButtons = deleteMode && expandedCategory;

  if (historyItems.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500 text-sm lg:text-base">
        تاریخچه‌ای برای نمایش وجود ندارد
      </div>
    );
  }

  return (
    <>
      <div className="flex-1 overflow-y-auto lg:p-4">
        <h3 className="text-tint-700 font-bold mb-4 text-sm lg:text-base">
          تاریخچه جست و جو و بازدیدهای اخیر
        </h3>

        <div className="flex flex-col gap-2">
          {historyItems.map((item) => (
            <div key={item.id} className="overflow-hidden">
              <div className="flex items-center justify-between p-3 hover:bg-gray-100 rounded-lg cursor-pointer transition-all duration-300 ease-in-out group">
                <span className="text-gray-600 hover:text-primary flex-1 text-sm lg:text-base">
                  {item.name}
                </span>
                <div className="flex items-center gap-2">
                  {showDeleteButtons ? (
                    <button
                      onClick={() =>
                        handleDeleteClick({ type: "item", id: item.id })
                      }
                      className="transition-all duration-300 ease-in-out hover:scale-110"
                    >
                      <CloseCircleIcon size={18} />
                    </button>
                  ) : (
                    item.type === "category" && (
                      <button
                        onClick={() => toggleCategory(item.id)}
                        className="flex items-center justify-center transition-transform duration-300 ease-in-out hover:scale-110"
                      >
                        {expandedCategory === item.id ? (
                          <MinusCircleIcon
                            size={20}
                            className="transition-all duration-300 ease-in-out"
                          />
                        ) : (
                          <MoreCircleIcon
                            size={20}
                            className="transition-all duration-300 ease-in-out"
                          />
                        )}
                      </button>
                    )
                  )}
                </div>
              </div>

              {item.type === "category" && (
                <div
                  className={`mr-6 flex flex-col gap-1 transition-all duration-300 ease-in-out origin-top ${
                    expandedCategory === item.id
                      ? "max-h-96 opacity-100 mt-1"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  {item.subcategories.map((sub) => (
                    <div
                      key={sub.id}
                      className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-all duration-200 ease-in-out text-gray-600 hover:text-primary group"
                    >
                      <span className="flex-1 text-sm lg:text-base">
                        {sub.name}
                      </span>
                      {showSubcategoryDeleteButtons && (
                        <button
                          onClick={() =>
                            handleDeleteClick({
                              type: "subcategory",
                              id: sub.id,
                              categoryId: item.id,
                            })
                          }
                          className="transition-all duration-300 ease-in-out hover:scale-110"
                        >
                          <CloseCircleIcon color="black" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="p-4">
        <button
          onClick={handleDeleteModeToggle}
          className="w-full py-2 text-tint-600 hover:text-tint-700 font-medium rounded-lg hover:bg-gray-100 transition-all duration-200 text-sm"
        >
          {getDeleteButtonText()}
        </button>
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent showCloseButton={false} className="z-1000">
          <div className="py-4 text-center text-gray-700 text-sm lg:text-base">
            {getDialogText()}
          </div>
          <DialogFooter className="flex flex-row gap-2 mt-4">
            <DialogClose asChild>
              <button
                onClick={handleCancelDelete}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm lg:text-base"
              >
                انصراف
              </button>
            </DialogClose>
            <button
              onClick={handleConfirmDelete}
              className="flex-1 px-4 py-2 bg-error-medium text-white rounded-lg hover:bg-error transition-colors text-sm lg:text-base"
            >
              حذف
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default SearchHistory;
