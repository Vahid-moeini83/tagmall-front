"use client";

import { useState, useEffect, useRef } from "react";
import {
  MoreSquareIcon,
  CloseSquareIcon,
  LookingAvatarIcon,
  UndoIcon,
  StrokeArrowLeftIcon,
} from "@/icons";
import toast from "react-hot-toast";

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
  const [deleteMode, setDeleteMode] = useState(false);
  const [pendingDeletes, setPendingDeletes] = useState([]);
  const countdownTimerRef = useRef(null);

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
    let deletedItem;

    if (target.type === "all") {
      deletedItem = { type: "all", items: [...historyItems] };
      setHistoryItems([]);
    } else if (target.type === "category") {
      const category = historyItems.find((item) => item.id === target.id);
      deletedItem = { type: "category", item: category };
      setHistoryItems((prev) => prev.filter((item) => item.id !== target.id));
      if (expandedCategory === target.id) {
        setExpandedCategory(null);
      }
    } else if (target.type === "item") {
      const item = historyItems.find((i) => i.id === target.id);
      deletedItem = { type: "item", item: item };
      setHistoryItems((prev) => prev.filter((item) => item.id !== target.id));
    } else if (target.type === "subcategory") {
      const category = historyItems.find(
        (item) => item.id === target.categoryId,
      );
      const subcategory = category?.subcategories.find(
        (sub) => sub.id === target.id,
      );
      deletedItem = {
        type: "subcategory",
        item: subcategory,
        categoryId: target.categoryId,
      };
      setHistoryItems((prev) =>
        prev.map((item) => {
          if (item.id === target.categoryId) {
            const updatedSubcategories = item.subcategories.filter(
              (sub) => sub.id !== target.id,
            );
            // If this was the last subcategory, close the category
            if (
              updatedSubcategories.length === 0 &&
              expandedCategory === target.categoryId
            ) {
              setExpandedCategory(null);
            }
            return {
              ...item,
              subcategories: updatedSubcategories,
            };
          }
          return item;
        }),
      );
    }

    setPendingDeletes((prev) => [...prev, deletedItem]);
  };

  const handleUndo = () => {
    pendingDeletes.forEach((deletedItem) => {
      if (deletedItem.type === "all") {
        setHistoryItems(deletedItem.items);
      } else if (deletedItem.type === "category") {
        setHistoryItems((prev) => [...prev, deletedItem.item]);
      } else if (deletedItem.type === "item") {
        setHistoryItems((prev) => [...prev, deletedItem.item]);
      } else if (deletedItem.type === "subcategory") {
        setHistoryItems((prev) =>
          prev.map((item) => {
            if (item.id === deletedItem.categoryId) {
              return {
                ...item,
                subcategories: [...item.subcategories, deletedItem.item],
              };
            }
            return item;
          }),
        );
      }
    });

    setPendingDeletes([]);
    toast.dismiss();
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
    }
  };

  const showToastWithCountdown = () => {
    let countdown = 5;
    const toastId = toast(
      () => (
        <div className="flex items-center justify-between gap-4 w-full">
          <span className="text-sm">حذف انجام شد ({countdown} ثانیه)</span>
          <button
            onClick={handleUndo}
            className="flex items-center justify-center hover:scale-110 transition-transform"
          >
            <UndoIcon />
          </button>
        </div>
      ),
      {
        duration: Infinity,
        position: "bottom-center",
      },
    );

    countdownTimerRef.current = setInterval(() => {
      countdown--;
      if (countdown > 0) {
        toast(
          () => (
            <div className="flex items-center justify-between gap-4 w-full">
              <span className="text-sm">حذف انجام شد ({countdown} ثانیه)</span>
              <button
                onClick={handleUndo}
                className="flex items-center justify-center hover:scale-110 transition-transform"
              >
                <UndoIcon />
              </button>
            </div>
          ),
          {
            id: toastId,
          },
        );
      } else {
        clearInterval(countdownTimerRef.current);
        toast.dismiss(toastId);
      }
    }, 1000);
  };

  const handleConfirmDeletes = () => {
    if (pendingDeletes.length > 0) {
      showToastWithCountdown();
    }
    setPendingDeletes([]);
    setDeleteMode(false);
    setExpandedCategory(null);
  };

  useEffect(() => {
    return () => {
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
        countdownTimerRef.current = null;
      }
      // Don't dismiss toast on unmount - let it continue
    };
  }, []);

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
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-primary font-bold text-sm lg:text-base">
            تاریخچه جست و جو و بازدیدهای اخیر
          </h3>
          {deleteMode && (
            <button
              onClick={handleConfirmDeletes}
              className="text-primary hover:text-primary/80 transition-colors text-sm font-medium"
            >
              تایید
            </button>
          )}
        </div>

        <div className="flex flex-col gap-2">
          {historyItems.map((item) => (
            <div
              key={item.id}
              className={`overflow-hidden transition-all duration-300 ${
                expandedCategory === item.id
                  ? "bg-gray-200 rounded-lg px-5 pt-4"
                  : ""
              }`}
            >
              <div
                className={`flex items-center justify-between hover:bg-gray-100 rounded-lg cursor-pointer transition-all duration-300 ease-in-out group ${expandedCategory === item.id ? "pb-3" : "py-4 pl-2.5"}`}
              >
                <span
                  className={`text-gray-600 hover:text-primary flex-1 text-sm lg:text-base transition-all duration-300 ${
                    expandedCategory === item.id ? "text-center" : ""
                  }`}
                >
                  {expandedCategory === item.id && item.type === "category" ? (
                    <>
                      <span className="font-black">بازدیدهای اخیر</span>{" "}
                      {item.name}
                    </>
                  ) : (
                    item.name
                  )}
                </span>
                <div className="flex items-center gap-2">
                  {showDeleteButtons ? (
                    <button
                      onClick={() =>
                        handleDeleteClick({ type: "item", id: item.id })
                      }
                      className="transition-all duration-300 ease-in-out hover:scale-110"
                    >
                      <CloseSquareIcon size={18} />
                    </button>
                  ) : (
                    item.type === "category" &&
                    item.subcategories.length > 0 &&
                    (expandedCategory === null ||
                      expandedCategory === item.id) && (
                      <button
                        onClick={() => toggleCategory(item.id)}
                        className="flex items-center justify-center transition-transform duration-300 ease-in-out hover:scale-110"
                      >
                        {expandedCategory === item.id ? (
                          <StrokeArrowLeftIcon
                            size={20}
                            className="transition-all duration-300 ease-in-out"
                          />
                        ) : (
                          <MoreSquareIcon
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
                  className={`flex flex-col gap-1 transition-all duration-300 ease-in-out origin-top ${
                    expandedCategory === item.id
                      ? "max-h-96 opacity-100 mt-1"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  {item.subcategories.map((sub) => (
                    <div
                      key={sub.id}
                      className="flex items-center justify-between py-4 hover:bg-gray-50 rounded-lg cursor-pointer transition-all duration-200 ease-in-out text-gray-600 hover:text-primary group"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <LookingAvatarIcon
                          color="var(--color-gray-400)"
                          size={20}
                        />
                        <span className="text-sm lg:text-base">{sub.name}</span>
                      </div>
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
                          <CloseSquareIcon size={20} color="black" />
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
          className="w-full py-2 text-primary hover:text-primary/80 font-medium rounded-lg hover:bg-gray-100 transition-all duration-200 text-sm"
        >
          {getDeleteButtonText()}
        </button>
      </div>
    </>
  );
}

export default SearchHistory;
