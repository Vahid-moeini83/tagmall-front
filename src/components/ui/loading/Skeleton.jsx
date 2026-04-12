import { cn } from "@/lib/client/utils";

function Skeleton({ className, ...props }) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-gray-200 rounded-md animate-pulse", className)}
      {...props}
    />
  );
}

export default Skeleton;
