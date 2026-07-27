"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import usePublicStore from "@/app/store/publicStore";
import { LoginContent } from "@/components/modules/login";

/**
 * Opens login when redirected from protected routes (?login=1)
 * and keeps a single global LoginContent instance.
 */
function AuthLoginGate() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isLoginOpen = usePublicStore((s) => s.isLoginOpen);
  const setLoginOpen = usePublicStore((s) => s.setLoginOpen);

  useEffect(() => {
    if (searchParams.get("login") !== "1") return;

    setLoginOpen(true);

    const params = new URLSearchParams(searchParams.toString());
    params.delete("login");
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [searchParams, pathname, router, setLoginOpen]);

  return <LoginContent isOpen={isLoginOpen} setIsOpen={setLoginOpen} />;
}

export default AuthLoginGate;
