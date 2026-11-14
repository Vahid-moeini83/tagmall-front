import SellerHeader from "./SellerHeader";
import SellerStats from "./SellerStats";
import SellerSalesChart from "./SellerSalesChart";
import SellerTopProducts from "./SellerTopProducts";
import SellerRecentOrders from "./SellerRecentOrders";


function SellerDashboard() {
  return (
    <div className="flex-1 w-full max-w-[1140px] mx-auto px-4 pt-5 pb-6 sm:p-6 lg:p-10 flex flex-col gap-5 lg:gap-6">
      {/* 1. Dashboard heading and summary cards */}
      <section className="flex flex-col gap-4 lg:gap-6">
        <SellerHeader />
        <SellerStats />
      </section>

      {/* 3. Middle Visual Section (Sales Chart & Top Products) */}
      <section className="flex flex-col lg:flex-row items-stretch gap-5">
        {/* Sales Chart (Takes right side in RTL) */}
        <div className="flex-1 min-w-0">
          <SellerSalesChart />
        </div>

        {/* Top Selling Products (Takes left side in RTL) */}
        <div className="w-full lg:w-[450px] shrink-0">
          <SellerTopProducts />
        </div>
      </section>

      {/* 4. Bottom Section (Recent Orders Table) */}
      <section>
        <SellerRecentOrders />
      </section>
    </div>
  );
}

export default SellerDashboard;
