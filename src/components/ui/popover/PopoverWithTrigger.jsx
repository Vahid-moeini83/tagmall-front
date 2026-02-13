"use client";

export default function PopoverWithTrigger({
  isOpen,
  onClose,
  trigger,
  children,
  popoverClassName = "",
  triggerPosition = "",
  offset = 24,
}) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-gray-200/50 backdrop-blur-sm z-[90]"
        onClick={onClose}
      />

      {/* Trigger element - stays visible above backdrop */}
      <div className={`fixed z-[100] ${triggerPosition}`}>{trigger}</div>

      {/* Popover content */}
      <div className={`fixed z-[100] ${popoverClassName}`}>{children}</div>
    </>
  );
}
