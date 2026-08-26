import { handleArchiveApi } from "@/lib/archive-api";
import { createAuth } from "@/lib/auth";
import { existingAccountSignUpResponse } from "@/lib/signup-guard";

export default {
  async fetch(request, env): Promise<Response> {
    const pathname = new URL(request.url).pathname;
    if (pathname.startsWith("/api/auth/")) {
      if (pathname.endsWith("/sign-up/email")) {
        const input = (await request.clone().json()) as { email?: string };
        const existingAccountResponse = await existingAccountSignUpResponse(env.DB, input.email);
        if (existingAccountResponse) return existingAccountResponse;
      }
      return createAuth({
        allowSignUp: true,
        baseURL: env.PUBLIC_APP_URL,
        database: env.DB,
        secret: env.BETTER_AUTH_SECRET,
        requireEmailVerification: false,
        sendAuthEmail: async () => undefined,
      }).handler(request);
    }

    return (await handleArchiveApi(request)) ?? new Response("Not found", { status: 404 });
  },
} satisfies ExportedHandler<Env>;
