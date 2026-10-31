import { Skeleton } from "@/components/ui/loading";

function Line({ width = "w-32", height = "h-4" }) {
  return <Skeleton className={`${width} ${height}`} />;
}

function Panel({ children, className = "" }) {
  return (
    <section className={`rounded-card bg-surface p-5 lg:p-6 ${className}`}>
      {children}
    </section>
  );
}

function Header() {
  return (
    <header className="hidden h-[52px] flex-col gap-2 lg:flex">
      <Line width="w-48" height="h-6" />
      <Line width="w-56" height="h-3" />
    </header>
  );
}

function Rows({ count = 5, columns = 6 }) {
  return (
    <div className="mt-5 divide-y divide-border-subtle">
      {Array.from({ length: count }, (_, row) => (
        <div key={row} className="flex items-center gap-4 py-4">
          {Array.from({ length: columns }, (_, column) => (
            <Skeleton
              key={column}
              className={`h-4 min-w-0 flex-1 ${column > 2 ? "hidden sm:block" : ""}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function Listing({ campaigns = false }) {
  return (
    <>
      <div className="flex gap-2 overflow-hidden">
        {Array.from({ length: campaigns ? 4 : 6 }, (_, index) => (
          <Skeleton key={index} className="h-10 w-28 shrink-0 rounded-lg" />
        ))}
      </div>
      <Panel className="flex flex-col gap-4 sm:flex-row">
        <Skeleton className="h-11 flex-1 rounded-lg" />
        <Skeleton className="h-11 w-full rounded-lg sm:w-52" />
        <Skeleton className="h-11 w-full rounded-lg sm:w-52" />
      </Panel>
      <Panel>
        <Skeleton className="h-10 w-full rounded-lg" />
        <Rows count={7} columns={campaigns ? 5 : 8} />
        <div className="mt-5 flex justify-between">
          <Line width="w-32" />
          <Line width="w-44" />
        </div>
      </Panel>
    </>
  );
}

function Dashboard() {
  return (
    <>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <Panel key={index} className="flex h-36 flex-col justify-between">
            <Line width="w-24" />
            <Line width="w-32" height="h-7" />
            <Line width="w-16" height="h-3" />
          </Panel>
        ))}
      </div>
      <div className="grid gap-5 lg:grid-cols-[1fr_450px]">
        <Panel className="h-80">
          <Line width="w-48" height="h-5" />
          <div className="mt-12 flex h-48 items-end justify-around gap-3">
            {["h-36", "h-24", "h-44", "h-20", "h-32", "h-40"].map((height, index) => (
              <Skeleton key={index} className={`${height} w-8 rounded-md`} />
            ))}
          </div>
        </Panel>
        <Panel className="h-80">
          <Line width="w-40" height="h-5" />
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="mt-4 h-12 w-full rounded-lg" />
          ))}
        </Panel>
      </div>
      <Panel>
        <Line width="w-40" height="h-5" />
        <Rows count={5} />
      </Panel>
    </>
  );
}

function Detail({ order = false }) {
  return order ? (
    <>
      <div className="grid gap-4 lg:grid-cols-2 lg:gap-6">
        {Array.from({ length: 2 }, (_, index) => (
          <Panel key={index} className="h-64">
            <Line width="w-36" height="h-5" />
            {Array.from({ length: 4 }, (_, row) => (
              <Skeleton key={row} className="mt-5 h-4 w-3/4" />
            ))}
          </Panel>
        ))}
      </div>
      <Panel className="min-h-96">
        <Line width="w-36" height="h-5" />
        <Skeleton className="mt-5 h-10 w-full rounded-lg" />
        <Rows count={4} columns={7} />
      </Panel>
    </>
  ) : (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="flex flex-col gap-6">
        <Panel className="h-96">
          <Line width="w-40" height="h-5" />
          <Rows count={6} columns={2} />
        </Panel>
        <Panel className="h-64">
          <Line width="w-36" height="h-5" />
          <Rows count={3} columns={3} />
        </Panel>
      </div>
      <div className="flex flex-col gap-6">
        <Panel className="h-96">
          <Skeleton className="h-64 w-full rounded-lg" />
          <div className="mt-4 flex gap-3">
            {Array.from({ length: 4 }, (_, index) => (
              <Skeleton key={index} className="h-16 w-16 rounded-lg" />
            ))}
          </div>
        </Panel>
        <Panel className="h-64">
          <Line width="w-36" height="h-5" />
          <Rows count={3} columns={3} />
        </Panel>
      </div>
    </div>
  );
}

function Form({ cards = false }) {
  return (
    <>
      <div className="flex gap-3">
        <Skeleton className="h-9 w-44 rounded-pill" />
        <Skeleton className="h-9 w-44 rounded-pill" />
      </div>
      <Panel>
        <Line width="w-48" height="h-5" />
        <Skeleton className="my-5 h-11 w-full rounded-lg" />
        {cards ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, index) => (
              <Skeleton key={index} className="h-40 w-full rounded-card" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 8 }, (_, index) => (
              <Skeleton key={index} className="h-11 w-full rounded-lg" />
            ))}
          </div>
        )}
      </Panel>
    </>
  );
}

function Profile() {
  return (
    <>
      <Panel className="flex items-center gap-4">
        <Skeleton className="h-16 w-16 shrink-0 rounded-circle" />
        <div className="flex flex-col gap-3">
          <Line width="w-40" height="h-5" />
          <Line width="w-64" />
        </div>
      </Panel>
      {Array.from({ length: 3 }, (_, index) => (
        <Panel key={index}>
          <Line width="w-40" height="h-5" />
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {Array.from({ length: 4 }, (_, field) => (
              <div key={field} className="flex flex-col gap-3">
                <Line width="w-28" />
                <Skeleton className="h-11 w-full rounded-lg" />
              </div>
            ))}
          </div>
        </Panel>
      ))}
    </>
  );
}

function Messages() {
  return (
    <div className="flex h-[calc(100dvh-136px)] min-h-0 bg-surface lg:h-dvh">
      <div className="flex w-full flex-col gap-5 border-l border-border-subtle p-5 lg:w-[345px]">
        <Line width="w-40" height="h-6" />
        <Skeleton className="h-11 w-full rounded-lg" />
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="flex gap-3">
            <Skeleton className="h-10 w-10 shrink-0 rounded-circle" />
            <div className="flex flex-col gap-2">
              <Line width="w-32" />
              <Line width="w-48" height="h-3" />
            </div>
          </div>
        ))}
      </div>
      <div className="hidden flex-1 flex-col justify-between p-6 lg:flex">
        <Line width="w-48" height="h-6" />
        <div className="flex flex-col gap-6">
          <Skeleton className="h-14 w-2/3 rounded-lg" />
          <Skeleton className="h-14 w-1/2 self-end rounded-lg" />
          <Skeleton className="h-14 w-2/3 rounded-lg" />
        </div>
        <Skeleton className="h-12 w-full rounded-lg" />
      </div>
    </div>
  );
}

export default function SellerPageSkeleton({ variant = "dashboard" }) {
  if (variant === "messages") {
    return <div role="status" aria-label="در حال بارگذاری پیام‌ها"><Messages /></div>;
  }

  return (
    <div
      role="status"
      aria-label="در حال بارگذاری صفحه"
      aria-busy="true"
      className="mx-auto flex w-full max-w-[1140px] flex-1 flex-col gap-6 px-4 pb-28 pt-5 sm:p-6 lg:p-10 lg:pb-10"
    >
      <Header />
      {variant === "dashboard" && <Dashboard />}
      {variant === "listing" && <Listing />}
      {variant === "campaigns" && <Listing campaigns />}
      {variant === "order-detail" && <Detail order />}
      {variant === "product-detail" && <Detail />}
      {variant === "product-create" && <Form cards />}
      {variant === "campaign-editor" && <Form />}
      {variant === "profile" && <Profile />}
      {variant === "branches" && <Form />}
    </div>
  );
}
