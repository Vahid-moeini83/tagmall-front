import { SupportContent } from "@/components/modules/support";
import { getConversations } from "@/lib/server/actions/support";
import { getUserOrders } from "@/lib/server/actions/cart";
import { getToken } from "@/lib/server/cookies";

async function SupportPage() {
  const token = await getToken();

  const { conversationsRes } = await getConversations(token);
  const { ordersRes } = await getUserOrders(token, 1);

  console.log(conversationsRes);

  return (
    <SupportContent
      conversations={conversationsRes}
      initialOrders={ordersRes}
    />
  );
}

export default SupportPage;
