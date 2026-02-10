import Image from "next/image";

function SellerMarker({ seller, isActive }) {
  const borderColor = isActive
    ? "border-primary"
    : seller.hasReadyDelivery
      ? "border-green-600"
      : "border-orange-600";

  const tailColor = isActive
    ? "bg-primary"
    : seller.hasReadyDelivery
      ? "bg-green-500"
      : "bg-orange-600";

  if (seller.hasSpecialSale) {
    return (
      <div className="flex flex-col-reverse items-center justify-end cursor-pointer transition-all duration-300 ease-out">
        <div
          className={`w-1 h-2.5 -mt-1 z-0 ${tailColor}`}
          style={{ marginTop: "-4px", zIndex: 0 }}
        />
        <div
          className={`relative w-12 h-12 rounded-lg border-[3.5px] p-[3px] shadow-md overflow-hidden bg-white z-10 ${borderColor}`}
        >
          <Image
            src={seller.profileImage}
            alt={seller.name}
            width={48}
            height={48}
            className="w-full h-full object-cover rounded-md"
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`w-2 h-2 rounded-full bg-primary ${
        isActive ? "border border-white p-0.5" : ""
      }`}
      style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.3)" }}
    />
  );
}

export default SellerMarker;
