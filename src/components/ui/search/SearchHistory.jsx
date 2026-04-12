"use client";
import { useState, useEffect } from "react";
import {
  MoreSquareIcon,
  CloseSquareIcon,
  LookingAvatarIcon,
  StrokeArrowLeftIcon,
} from "@/icons";
import toast from "react-hot-toast";
import {
  fetchSearchHistory,
  deleteSearchHistoryItem,
  deleteAllSearchHistory,
} from "@/lib/server/actions/search";
import { getToken } from "@/lib/server/cookies";
import { v4 as uuidv4 } from "uuid";
import SearchSkeleton from "../loading/search/SearchSkeleton";

// Get or create persistent user search ID
const getUserSearchId = () => {
  if (typeof window === "undefined") return null;
  let userSearchId = localStorage.getItem("userSearchId");
  if (!userSearchId) {
    userSearchId = uuidv4();
    localStorage.setItem("userSearchId", userSearchId);
  }
  return userSearchId;
};

function SearchHistory() {
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [historyItems, setHistoryItems] = useState([]);
  const [deleteMode, setDeleteMode] = useState(false);
  const [pendingDeletes, setPendingDeletes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchHistory = async () => {
    setIsLoading(true);
    const token = await getToken();
    const userSearchId = getUserSearchId();
    const { searchHistoryRes, searchHistoryErr } = await fetchSearchHistory(
      token,
      userSearchId,
    );
    if (searchHistoryRes) {
      const transformedData = [];
      if (searchHistoryRes?.data) {
        searchHistoryRes.data.forEach((item) => {
          if (item.type === "product" && item.product_ids) {
            item.product_ids.forEach((product) => {
              transformedData.push({
                historyId: item?.id,
                searchIdentifier: item?.search_identifier,
                id: product?.id,
                uniqueKey: `${item?.id}-product-${product?.id}`,
                type: "product",
                name: product?.name,
              });
            });
          } else if (item.type === "category" && item.category_ids) {
            item.category_ids.forEach((category) => {
              const hasProducts =
                category?.products && category.products.length > 0;
              transformedData.push({
                historyId: item?.id,
                searchIdentifier: item?.search_identifier,
                id: category?.id,
                uniqueKey: `${item?.id}-category-${category?.id}`,
                type: "category",
                name: category?.name,
                subcategories: hasProducts
                  ? category.products.map((prod) => ({
                      ...prod,
                      uniqueKey: `${item?.id}-${category?.id}-${prod?.id}`,
                    }))
                  : undefined,
              });
            });
          }
        });
      }
      setHistoryItems(transformedData);
    } else if (searchHistoryErr) {
      toast.error("خطا در نمایش تاریخچه جست‌و‌جو و بازدیدهای اخیر");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const toggleCategory = (categoryId) => {
    setExpandedCategory((prev) => (prev === categoryId ? null : categoryId));
  };

  // مدیریت کلیک روی دکمه پایین (حالت حذف / حذف همه)
  const handleDeleteModeToggle = () => {
    if (deleteMode) {
      // اگر قبلاً وارد حالت حذف شده‌ایم، یعنی کاربر می‌خواهد "همه" را حذف کند
      // همه آیتم‌ها را به لیست انتظار حذف اضافه می‌کنیم (مشابه حذف تکی)
      const allItemsToDelete = historyItems.map((item) => ({
        type: "item",
        item: item,
      }));
      setPendingDeletes((prev) => [...prev, ...allItemsToDelete]);

      // خالی کردن UI
      setHistoryItems([]);
      setExpandedCategory(null);
    } else {
      // ورود به حالت حذف
      setDeleteMode(true);
    }
  };

  // مدیریت کلیک روی دکمه ضربدر آیتم‌ها
  const handleDeleteClick = (target) => {
    let deletedItem;
    if (target.type === "item") {
      const item = historyItems?.find((i) => i?.uniqueKey === target.uniqueKey);
      deletedItem = { type: "item", item: item };
      setHistoryItems((prev) =>
        prev?.filter((item) => item?.uniqueKey !== target.uniqueKey),
      );
    } else if (target.type === "subcategory") {
      const category = historyItems?.find(
        (item) => item?.id === target.categoryId,
      );
      const subcategory = category?.subcategories?.find(
        (sub) => sub?.id === target.id,
      );
      deletedItem = {
        type: "subcategory",
        item: subcategory,
        categoryId: target.categoryId,
      };
      setHistoryItems((prev) =>
        prev?.map((item) => {
          if (item?.id === target.categoryId) {
            const updatedSubcategories = item?.subcategories?.filter(
              (sub) => sub?.id !== target.id,
            );
            if (
              updatedSubcategories?.length === 0 &&
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

  // تایید نهایی حذف (هم برای تکی و هم برای همه)
  const handleConfirmDeletes = async () => {
    if (pendingDeletes.length === 0) {
      setDeleteMode(false);
      return;
    }

    // بستن مودال و حالت حذف قبل از شروع درخواست API
    setDeleteMode(false);
    setExpandedCategory(null);

    // انجام عملیات حذف
    await performDelete();
  };

  // انجام عملیات API (هوشمند: تشخیص حذف تکی یا همه)
  const performDelete = async () => {
    const token = await getToken();
    const userSearchId = getUserSearchId();

    // --- اصلاح شده: اگر تعداد موارد در انتظار حذف بیشتر از 1 باشد، یعنی حذف همه است ---
    if (pendingDeletes.length > 1) {
      const { deleteAllSearchHistoryErr } = await deleteAllSearchHistory(
        token,
        userSearchId,
      );
      if (deleteAllSearchHistoryErr) {
        toast.error("خطا در حذف همه تاریخچه و بازدیدها");
      }
      // پاک کردن لیست موارد در انتظار حذف
      setPendingDeletes([]);
      return;
    }

    // در غیر این صورت، حذف آیتم‌های مشخص (تکی)
    const categoryIds = {};
    const productIds = [];
    let searchIdentifier = null;

    pendingDeletes.forEach((deletedItem) => {
      if (!searchIdentifier && deletedItem?.item?.searchIdentifier) {
        searchIdentifier = deletedItem.item.searchIdentifier;
      }
      if (deletedItem?.type === "item") {
        if (deletedItem?.item?.type === "product") {
          productIds.push(deletedItem?.item?.id);
        } else if (deletedItem?.item?.type === "category") {
          categoryIds[deletedItem?.item?.id] = [];
        }
      } else if (deletedItem?.type === "subcategory") {
        if (!categoryIds[deletedItem?.categoryId]) {
          categoryIds[deletedItem?.categoryId] = [];
        }
        categoryIds[deletedItem?.categoryId].push(deletedItem?.item?.id);
      }
    });

    const bodyData = {
      search_identifier: searchIdentifier || uuidv4(),
      category_ids: categoryIds,
      product_ids: productIds,
    };

    const { deleteSearchHistoryItemErr } = await deleteSearchHistoryItem(
      bodyData,
      token,
      userSearchId,
    );

    if (deleteSearchHistoryItemErr) {
      toast.error("خطا در حذف موارد");
    }

    // پاک کردن لیست موارد در انتظار حذف
    setPendingDeletes([]);
  };

  const expandedCategoryData = historyItems?.find(
    (item) => item?.id === expandedCategory,
  );

  const getDeleteButtonText = () => {
    if (deleteMode) {
      if (expandedCategory && expandedCategoryData) {
        return `پاک کردن همه بازدیدهای اخیر "${expandedCategoryData?.name}"`;
      }
      return "پاک کردن همه تاریخچه جست و جو و بازدیدهای اخیر";
    }
    if (expandedCategory && expandedCategoryData) {
      return `پاک کردن بازدیدهای اخیر "${expandedCategoryData?.name}"`;
    }
    return "پاک کردن تاریخچه جست و جو و بازدیدهای اخیر";
  };

  const showDeleteButtons = deleteMode && !expandedCategory;
  const showSubcategoryDeleteButtons = deleteMode && expandedCategory;

  return (
    <>
      <div className="flex-1 overflow-y-auto lg:py-4">
        <div className="flex items-center justify-between mb-5 pl-[6px] lg:pr-4">
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
        {isLoading ? (
          <SearchSkeleton />
        ) : (
          <div className="flex flex-col gap-2 lg:px-[6px]">
            {historyItems?.map((item) => (
              <div
                key={item?.uniqueKey}
                className={`overflow-hidden transition-all duration-300 ${
                  expandedCategory === item?.id
                    ? "bg-gray-200 rounded-lg px-[10px] lg:pr-[10px] lg:pl-[6px] py-4"
                    : ""
                }`}
              >
                <div
                  className={`flex items-center justify-between transition-all duration-300 ease-in-out group ${expandedCategory === item?.id ? "pb-3" : "py-4 pl-[10px] lg:pl-[6px] lg:pr-[10px]"}`}
                >
                  <span
                    className={`text-gray-600 cursor-pointer hover:text-primary flex-1 text-sm lg:text-base transition-all duration-300 ${
                      expandedCategory === item?.id ? "text-center" : ""
                    }`}
                  >
                    {expandedCategory === item?.id &&
                    item?.type === "category" ? (
                      <>
                        <span className="font-black">بازدیدهای اخیر</span>{" "}
                        {item?.name}
                      </>
                    ) : (
                      item?.name
                    )}
                  </span>
                  <div className="flex items-center gap-2">
                    {showDeleteButtons ? (
                      <button
                        onClick={() =>
                          handleDeleteClick({
                            type: "item",
                            uniqueKey: item?.uniqueKey,
                          })
                        }
                        className="cursor-pointer"
                      >
                        <CloseSquareIcon size={18} />
                      </button>
                    ) : (
                      item?.type === "category" &&
                      item?.subcategories &&
                      item?.subcategories?.length > 0 &&
                      (expandedCategory === null ||
                        expandedCategory === item?.id) && (
                        <button
                          onClick={() => toggleCategory(item?.id)}
                          className="flex items-center justify-center transition-transform duration-300 ease-in-out hover:scale-110"
                        >
                          {expandedCategory === item?.id ? (
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
                {item?.type === "category" && (
                  <div
                    className={`flex flex-col gap-1 transition-all duration-300 ease-in-out origin-top ${
                      expandedCategory === item?.id
                        ? "max-h-96 opacity-100 mt-1"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    {item?.subcategories?.map((sub) => (
                      <div
                        key={sub?.uniqueKey}
                        className="flex items-center justify-between py-4 hover:bg-gray-50 rounded-lg cursor-pointer transition-all duration-200 ease-in-out text-gray-600 hover:text-primary group"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <LookingAvatarIcon
                            color="var(--color-gray-400)"
                            size={20}
                          />
                          <span className="text-sm lg:text-base">
                            {sub?.name}
                          </span>
                        </div>
                        {showSubcategoryDeleteButtons && (
                          <button
                            onClick={() =>
                              handleDeleteClick({
                                type: "subcategory",
                                id: sub?.id,
                                categoryId: item?.id,
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
        )}
      </div>
      <div className="p-4">
        <button
          disabled={historyItems.length === 0}
          onClick={handleDeleteModeToggle}
          className={`w-full py-2 font-medium transition-all duration-200 text-sm ${historyItems?.length > 0 ? "text-primary hover:text-primary/80 rounded-lg" : "text-gray-400"}`}
        >
          {getDeleteButtonText()}
        </button>
      </div>
    </>
  );
}
export default SearchHistory;
