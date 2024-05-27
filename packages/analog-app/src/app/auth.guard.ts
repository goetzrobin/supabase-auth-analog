import { CanActivateFn, Router } from "@angular/router";
import { injectSupabaseAuth } from "./auth.service";
import { PLATFORM_ID, inject } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { sendRedirect, parseCookies } from "h3";
import { REQUEST, RESPONSE } from "../request-response";

export function authenticationGuard(): CanActivateFn {
  return async () => {
    const isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
    const req = inject(REQUEST, { optional: true });
    const res = inject(RESPONSE, { optional: true });
    const auth = injectSupabaseAuth();
    const router = inject(Router);

    if (isBrowser) {
      const browserSession = await auth.getSession();
      if (browserSession.data.session) {
        return true;
      }

      await router.navigateByUrl("/");
      return false;
    }
    if (!req || !res) return false;
    const cookies = parseCookies({ node: { req, res } } as any);

    const serverSession = await auth.setSession({
      access_token: cookies["sb-access-token"],
      refresh_token: cookies["sb-refresh-token"],
    });

    if (serverSession.data?.session) {
      return true;
    } else {
      auth.signOut();
      sendRedirect({ node: { req, res } } as any, "/");
    }
    return false;
  };
}
