"use client";

import { useRouter } from "next/navigation";

function DragHandler({ hasCloseEvent = false, onClose }) {
  const router = useRouter();

  const handleOnMouseDown = (e) => {
    e.preventDefault();

    if (hasCloseEvent) {
      onClose();
      return;
    }

    router.back();
  };

  return (
    <div
      onTouchStart={handleOnMouseDown}
      onMouseDown={handleOnMouseDown}
      className="w-30 h-1 rounded-full bg-gray-300 cursor-pointer touch-none"
    />
  );
}

export default DragHandler;
