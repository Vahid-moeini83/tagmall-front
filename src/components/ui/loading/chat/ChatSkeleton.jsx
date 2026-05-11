import { Skeleton } from "..";

function ChatSkeleton() {
  return (
    <div className="flex flex-col h-full select-none">
      {/* Chat messages area */}
      <div className="flex-1 flex flex-col gap-6 lg:gap-4 px-[10px] lg:px-0 pt-4">
        {/* Support message (right side) */}
        <div className="flex w-full justify-end">
          <div className="flex items-end gap-2 w-[80%] lg:w-[40%] flex-row-reverse">
            <Skeleton className="w-10 h-10 rounded-lg shrink-0" />
            <Skeleton className="flex-1 h-24 lg:h-32 rounded-lg rounded-bl-none" />
          </div>
        </div>

        {/* User message (left side) */}
        <div className="flex w-full justify-start">
          <div className="flex items-end gap-2 w-[70%] lg:w-[35%]">
            <Skeleton className="w-10 h-10 rounded-lg shrink-0" />
            <Skeleton className="flex-1 h-16 lg:h-20 rounded-lg rounded-br-none" />
          </div>
        </div>

        {/* Support message (right side) */}
        <div className="flex w-full justify-end">
          <div className="flex items-end gap-2 w-[65%] lg:w-[30%] flex-row-reverse">
            <Skeleton className="w-10 h-10 rounded-lg shrink-0" />
            <Skeleton className="flex-1 h-20 rounded-lg rounded-bl-none" />
          </div>
        </div>

        {/* User message (left side) */}
        <div className="flex w-full justify-start">
          <div className="flex items-end gap-2 w-[75%] lg:w-[38%]">
            <Skeleton className="w-10 h-10 rounded-lg shrink-0" />
            <Skeleton className="flex-1 h-24 rounded-lg rounded-br-none" />
          </div>
        </div>

        {/* Support message (right side) - without avatar */}
        <div className="flex w-full justify-end mt-1">
          <div className="flex items-end gap-2 w-[60%] lg:w-[28%] mr-[50px]">
            <Skeleton className="flex-1 h-16 rounded-lg" />
          </div>
        </div>

        {/* User message (left side) - without avatar */}
        <div className="flex w-full justify-start mt-1">
          <div className="flex items-end gap-2 w-[68%] lg:w-[32%] ml-[50px]">
            <Skeleton className="flex-1 h-20 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Chat input box at bottom */}
      <div className="px-[10px] lg:px-0 pb-6 lg:pb-12 pt-4">
        <div className="flex items-center justify-center">
          <Skeleton className="w-full max-w-[540px] h-14 lg:h-12 rounded-t-md rounded-bl-md" />
        </div>
      </div>
    </div>
  );
}

export default ChatSkeleton;
