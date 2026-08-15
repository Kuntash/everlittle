import { handleArchiveApi } from "@/lib/archive-api";
import { createAuth } from "@/lib/auth";

export default {
  async fetch(request, env): Promise<Response> {
    if (new URL(request.url).pathname.startsWith("/api/auth/")) {
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
