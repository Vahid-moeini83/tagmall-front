function UserMarker({ heading = 0, isManual = false }) {
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
