import { ProductNavigation } from "@/components/layout/product-layout";
import ProductMain from "@/components/modules/product-single/components/ProductMain";
import ProductRelatedAccessories from "@/components/modules/product-single/components/ProductRelatedAccessories";
import ProductSpecifications from "@/components/modules/product-single/components/ProductSpecifications";
import ProductReviews from "@/components/modules/product-single/components/ProductReviews";
import ProductUserComments from "@/components/modules/product-single/components/ProductUserComments";
import ProductPartnership from "@/components/modules/product-single/components/ProductPartnership";

export default function ProductPage({ params }) {
  return (
    <div className="min-h-screen bg-gray-200">
      <ProductNavigation />

      <div className="mx-[10px] py-[10px] space-y-1 pb-[80px] lg:mx-[50px] lg:pt-[50px] lg:pb-[50px]">
        <ProductMain />
        <ProductRelatedAccessories />
        <ProductSpecifications />
        <ProductReviews />
        <ProductUserComments />
        <ProductPartnership />
      </div>
    </div>
  );
}
