export async function existingAccountSignUpResponse(
  database: D1Database,
  email: string | undefined,
): Promise<Response | null> {
  const normalizedEmail = email?.trim().toLowerCase();
  if (!normalizedEmail) return null;

  const existingUser = await database
    .prepare('SELECT id FROM "user" WHERE lower(email) = ?')
    .bind(normalizedEmail)
    .first<{ id: string }>();
  if (!existingUser) return null;

  return Response.json(
    {
      code: "ACCOUNT_ALREADY_EXISTS",
      message: "You already have an account. Please sign in instead.",
    },
    { status: 409 },
  );
}
