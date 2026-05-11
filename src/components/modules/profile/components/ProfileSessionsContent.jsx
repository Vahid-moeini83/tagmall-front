"use client";

import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { CustomOptions } from "@/components/ui/option";
import { HintIcon } from "@/icons";
import { CheckIcon } from "lucide-react";
import {
  formatISOToPersianDate,
  formatISOToPersianTime,
} from "@/lib/client/utils";
import { SessionsSkeleton } from "@/components/ui/loading";

function ProfileSessionsContent({
  sessions,
  phone,
  selectedSessions,
  setSelectedSessions,
  onDeleteSessions,
  isLoading,
  isDeleting,
  setIsSessionsHintOpen,
}) {
  const [selectAll, setSelectAll] = useState(false);

  // فیلتر نشست‌های فعال (is_current_session = false یعنی قابل حذف)
  const activeSessions = sessions.filter((s) => !s.is_current_session);

  const handleSelect = (id) => {
    const item = sessions.find((s) => s.id === id);
    if (item?.is_current_session) return; // جلوگیری از انتخاب نشست جاری

    let updated = [...selectedSessions];

    if (updated.includes(id)) {
      updated = updated.filter((x) => x !== id);
    } else {
      updated.push(id);
    }

    setSelectedSessions(updated);
  };

  // آپدیت selectAll بر اساس انتخاب‌ها
  useEffect(() => {
    const allActiveIds = activeSessions.map((s) => s.id);
    const allSelected =
      allActiveIds.length > 0 &&
      allActiveIds.every((aid) => selectedSessions.includes(aid));
    setSelectAll(allSelected);
  }, [selectedSessions, activeSessions]);

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedSessions([]);
    } else {
      const allActiveIds = activeSessions.map((s) => s.id);
      setSelectedSessions(allActiveIds);
    }
  };

  if (isLoading) {
    return <SessionsSkeleton />;
  }

  if (sessions.length === 0) {
    return (
      <div className="flex flex-col gap-4 mt-3 lg:mt-0 select-none">
        <div className="flex items-center justify-between">
          <span>نشست های فعال:</span>
        </div>
        <p className="text-center text-gray-600 py-8">
          نشستی برای این شماره یافت نشد
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 mt-3 lg:mt-0 select-none">
      <div className="flex items-center justify-between">
        <span>نشست های فعال:</span>
        <HintIcon
          size={20}
          className="cursor-pointer ml-4"
          onClick={() => setIsSessionsHintOpen(true)}
        />
      </div>

      <CustomOptions
        type="checkbox"
        value={selectedSessions}
        onChange={handleSelect}
        options={sessions.map((s) => ({
          id: s.id,
          label: `${s.created_at}`,
          isActive: !s.is_current_session,
        }))}
        renderLabel={(item) => {
          const session = sessions.find((s) => s.id === item.id);
          const persianDate = formatISOToPersianDate(session?.created_at || "");
          const persianTime = formatISOToPersianTime(session?.created_at || "");

          return (
            <div
              className={`relative flex items-center gap-1 ${
                item.isActive === false ? "text-gray-400" : "text-gray-600"
              }`}
            >
              <span className="font-bold">ورود</span> در {persianDate} ساعت{" "}
              {persianTime}
              {!item.isActive && (
                <CheckIcon
                  className="absolute top-1/2 -translate-y-1/2 left-[3px] text-success-medium"
                  size={20}
                />
              )}
            </div>
          );
        }}
      />

      {/* انتخاب همه - فقط اگر بیش از 1 نشست فعال داشته باشیم */}
      {activeSessions.length > 1 && (
        <div className="flex items-center pr-4 gap-2 text-gray-700 text-sm cursor-pointer">
          <Checkbox
            checked={selectAll}
            hasBorder={false}
            onClick={handleSelectAll}
            className="bg-gray-200!"
          />
          همه نشست‌های فعال با شماره {phone}
        </div>
      )}

      {/* دکمه حذف */}
      <button
        disabled={selectedSessions.length === 0 || isDeleting}
        className={`text-center py-4 ${
          selectedSessions.length > 0 && !isDeleting
            ? "text-error-medium cursor-pointer"
            : "text-gray-400 cursor-not-allowed"
        }`}
        onClick={onDeleteSessions}
      >
        {isDeleting
          ? "در حال حذف..."
          : "دسترسی از نشست‌های فعال انتخاب شده مسدود شود؟"}
      </button>
    </div>
  );
}

export default ProfileSessionsContent;
