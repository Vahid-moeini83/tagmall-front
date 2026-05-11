import { ProductSingle } from "@/components/modules/product-single";
import {
  getProductById,
  getProductComments,
} from "@/lib/server/actions/product";
import { getToken } from "@/lib/server/cookies";

export default async function ProductPage({ params }) {
  params = await params;
  const productId = params.slug;

  const token = await getToken();

  // Fetch product and comments in parallel
  const [{ productRes, productErr }, { commentsRes, commentsErr }] =
    await Promise.all([getProductById(2), getProductComments(2, token)]);

  return (
    <ProductSingle
      product={productRes}
      productError={productErr}
      comments={commentsRes}
      commentsError={commentsErr}
    />
  );
}
