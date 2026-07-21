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
} from "@/lib/server/actions/search";
import { getToken } from "@/lib/server/cookies";
import { v4 as uuidv4 } from "uuid";
import SearchSkeleton from "../loading/search/SearchSkeleton";
import SpinnerLoading from "@/components/ui/loading/SpinnerLoading";

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

function ConfirmCancelButtons({
  onConfirm,
  onCancel,
  isConfirming = false,
  isConfirmEnabled = false,
}) {
  return (
    <div className="flex w-full gap-2">
      <button
        type="button"
        disabled={isConfirming || !isConfirmEnabled}
        onClick={onConfirm}
        className={`flex-1 border-2 py-2 rounded-full text-sm font-medium flex items-center justify-center disabled:cursor-not-allowed ${
          isConfirmEnabled
            ? "text-primary border-primary disabled:opacity-70"
            : "text-gray-400 border-gray-400"
        }`}
      >
        {isConfirming ? (
          <SpinnerLoading size={18} className="border-primary" />
        ) : (
          "تایید"
        )}
      </button>
      <button
        type="button"
        disabled={isConfirming}
        onClick={onCancel}
        className="flex-1 text-error-medium py-2 rounded-full text-sm font-medium disabled:opacity-70"
      >
        انصراف
      </button>
    </div>
  );
}

function SearchHistory() {
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [historyItems, setHistoryItems] = useState([]);
  const [deleteMode, setDeleteMode] = useState(null);
  const [pendingDeletes, setPendingDeletes] = useState([]);
  const [itemsSnapshot, setItemsSnapshot] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const transformHistoryData = (data) => {
    const transformedData = [];
    if (data) {
      data.forEach((item) => {
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
    return transformedData;
  };

  const fetchHistory = async () => {
    setIsLoading(true);
    const token = await getToken();
    const userSearchId = getUserSearchId();
    const { searchHistoryRes, searchHistoryErr } = await fetchSearchHistory(
      token,
      userSearchId,
    );
    if (searchHistoryRes) {
      setHistoryItems(transformHistoryData(searchHistoryRes?.data));
    } else if (searchHistoryErr) {
      toast.error("خطا در نمایش تاریخچه جست‌و‌جو و بازدیدهای اخیر");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const toggleCategory = (categoryId) => {
    if (deleteMode) return;
    setExpandedCategory((prev) => (prev === categoryId ? null : categoryId));
  };

  const enterDeleteMode = (mode) => {
    setItemsSnapshot(structuredClone(historyItems));
    setDeleteMode(mode);
    setPendingDeletes([]);
  };

  const handleCancelDeletes = () => {
    if (itemsSnapshot) {
      setHistoryItems(itemsSnapshot);
    }
    setItemsSnapshot(null);
    setPendingDeletes([]);
    setDeleteMode(null);
  };

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
        prev
          ?.map((item) => {
            if (item?.id === target.categoryId) {
              const updatedSubcategories = item?.subcategories?.filter(
                (sub) => sub?.id !== target.id,
              );
              if (updatedSubcategories?.length === 0) {
                setExpandedCategory(null);
                return null;
              }
              return {
                ...item,
                subcategories: updatedSubcategories,
              };
            }
            return item;
          })
          .filter(Boolean),
      );
    }
    setPendingDeletes((prev) => [...prev, deletedItem]);
  };

  const handleConfirmDeletes = async () => {
    if (pendingDeletes.length === 0) {
      handleCancelDeletes();
      return;
    }

    const snapshotForRecovery = itemsSnapshot;
    setDeleteMode(null);
    setExpandedCategory(null);
    setItemsSnapshot(null);
    setIsConfirmingDelete(true);

    await performDelete(snapshotForRecovery);

    setIsConfirmingDelete(false);
  };

  const performDelete = async (snapshotForRecovery = null) => {
    const token = await getToken();
    const userSearchId = getUserSearchId();

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
      if (snapshotForRecovery) {
        setHistoryItems(snapshotForRecovery);
      } else {
        await fetchHistory();
      }
    }

    setPendingDeletes([]);
  };

  const expandedCategoryData = historyItems?.find(
    (item) => item?.id === expandedCategory,
  );

  const isGlobalDeleteMode = deleteMode === "global";
  const isCategoryDeleteMode =
    deleteMode !== null &&
    deleteMode !== "global" &&
    deleteMode === expandedCategory;

  return (
    <>
      <div className="flex-1 overflow-y-auto lg:py-4 scroll-hidden">
        <div className="flex items-center justify-between mb-5 pl-[6px] lg:pr-4">
          <h3 className="text-primary font-bold text-sm lg:text-base">
            تاریخچه جست و جو و بازدیدهای اخیر
          </h3>
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
                    ? "bg-gray-200 rounded-lg px-[10px] lg:pr-[10px] lg:pl-[6px]"
                    : ""
                }`}
              >
                <div
                  className={`flex items-center justify-between transition-all duration-300 ease-in-out group ${expandedCategory === item?.id ? "pb-3" : "py-4 pl-3 lg:pl-[6px] lg:pr-[10px]"}`}
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
                    {isGlobalDeleteMode ? (
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
                      !deleteMode &&
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
                        ? "max-h-[600px] opacity-100 mt-1"
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
                        {isCategoryDeleteMode && (
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

                    {expandedCategory === item?.id && (
                      <div className="pt-2">
                        {isCategoryDeleteMode ? (
                          <ConfirmCancelButtons
                            onConfirm={handleConfirmDeletes}
                            onCancel={handleCancelDeletes}
                            isConfirming={isConfirmingDelete}
                            isConfirmEnabled={pendingDeletes.length > 0}
                          />
                        ) : (
                          <button
                            type="button"
                            disabled={!item?.subcategories?.length}
                            onClick={() => enterDeleteMode(item?.id)}
                            className="w-full bg-white text-primary py-2 rounded-lg text-sm font-medium disabled:text-gray-400"
                          >
                            {`پاک کردن بازدیدهای اخیر "${item?.name}"`}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {!expandedCategory && (
        <div className="py-4 lg:px-[10px]">
          {isGlobalDeleteMode ? (
            <ConfirmCancelButtons
              onConfirm={handleConfirmDeletes}
              onCancel={handleCancelDeletes}
              isConfirming={isConfirmingDelete}
              isConfirmEnabled={pendingDeletes.length > 0}
            />
          ) : (
            <button
              type="button"
              disabled={historyItems.length === 0}
              onClick={() => enterDeleteMode("global")}
              className={`w-full py-2 font-medium transition-all duration-200 rounded-full border-2 text-sm ${
                historyItems?.length > 0
                  ? "text-primary border-primary"
                  : "text-gray-400 border-gray-400"
              }`}
            >
              پاک کردن تاریخچه جست و جو و بازدیدهای اخیر
            </button>
          )}
        </div>
      )}
    </>
  );
}
export default SearchHistory;
