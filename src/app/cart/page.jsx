import { CartPageContent } from "@/components/modules/cart";
import { getCart } from "@/lib/server/actions/cart";
import { getToken } from "@/lib/server/cookies";

async function CartPage() {
  const token = await getToken();

  const { cartRes, cartErr } = await getCart(token);

  console.log("Cart: ", cartRes);

  return <CartPageContent initialCartData={cartRes} />;
}

export default CartPage;
