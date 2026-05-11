import { SupportContent } from "@/components/modules/support";
import { getConversations } from "@/lib/server/actions/support";
import { getToken } from "@/lib/server/cookies";

async function SupportPage() {
  const token = await getToken();

  const { conversationsRes, conversationsErr } = await getConversations(token);

  return <SupportContent conversations={conversationsRes} />;
}

export default SupportPage;
