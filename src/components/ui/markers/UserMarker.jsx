function UserMarker({ heading = 0, isManual = false, variant = "default" }) {
  if (variant === "desktop") {
    return (
      <div className="relative flex flex-col items-center justify-center select-none pointer-events-none">
        {/* User Heading Radial Arc if available */}
        {heading !== undefined && heading !== 0 && (
          <div
            className="absolute size-20 pointer-events-none -top-6"
            style={{
              transform: `rotate(${heading}deg)`,
              background:
                "radial-gradient(circle, rgba(245, 130, 32, 0.4) 0%, rgba(245, 130, 32, 0) 70%)",
            }}
          />
        )}
        {/* Orange center dot with soft orange ring */}
        <div className="relative size-6 rounded-circle bg-secondary border-[6px] border-secondary-100 shadow-card flex items-center justify-center" />
        {/* Tooltip 'شما اینجا هستید' */}
        <div className="mt-1 bg-surface border border-secondary text-secondary px-2.5 py-1 rounded-md shadow-card whitespace-nowrap">
          <span className="text-small font-semibold">شما اینجا هستید</span>
        </div>
      </div>
    );
  }

  // Default (Mobile) Behavior - Frozen and Unchanged
  if (isManual) {
    return (
      <div className="flex flex-col-reverse items-center justify-end">
        <div
          className="w-1 h-2.5 -mt-1 z-0 bg-[#3D3183]"
          style={{ marginTop: "-4px", zIndex: 0 }}
        />
        <div className="relative w-12 h-12 rounded-[14px] border-3 border-[#3D3183] shadow-md bg-white z-10 flex items-center justify-center">
          <span className="text-[10px] font-medium text-[#3D3183] text-center leading-tight">
            موقعیت شما
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-5 h-5 flex items-center justify-center">
      <div
        className="user-marker-shadow absolute inset-0 z-9 pointer-events-none"
        style={{ transform: `rotate(${heading}deg)` }}
      />
      <div
        className="relative z-10 w-5 h-5 rounded-full border-[3px] border-white shadow-md bg-[#3D3183]"
        style={{ boxShadow: "0 4px 6px rgba(0,0,0,0.3)" }}
      />
    </div>
  );
}

export default UserMarker;
