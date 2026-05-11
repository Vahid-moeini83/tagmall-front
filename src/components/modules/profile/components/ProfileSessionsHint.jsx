"use client";

import ResponsiveModal from "@/components/ui/responsive-modal";

function ProfileSessionsHint({ isOpen, setIsOpen }) {
  return (
    <ResponsiveModal
      isHintBox
      title={"راهنمای نشست‌های فعال"}
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
    >
      <p className="text-gray-600 text-justify leading-7">
        در این بخش می‌توانید تمامی نشست‌های فعال خود را مشاهده و مدیریت کنید.
        نشست جاری شما با علامت تیک سبز مشخص شده و قابل حذف نیست. برای امنیت
        بیشتر، می‌توانید نشست‌های دیگر را که دیگر استفاده نمی‌کنید، مسدود کنید.
      </p>
    </ResponsiveModal>
  );
}

export default ProfileSessionsHint;
