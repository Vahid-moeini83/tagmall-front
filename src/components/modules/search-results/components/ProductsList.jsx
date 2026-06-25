import ProductListItem from "./ProductListItem";

function ProductsList({ products, isDesktop = false }) {
  if (isDesktop) {
    return (
      <div className="mt-9 space-y-10">
        {products.map((product) => (
          <ProductListItem key={product.id} product={product} isDesktop />
        ))}
      </div>
    );
  }

  // Mobile view
  return (
    <div className="space-y-[10px]">
      {products.map((product) => (
        <ProductListItem key={product.id} product={product} />
      ))}
    </div>
  );
}

export default ProductsList;
