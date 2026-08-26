type AuthClientError = {
  code?: string;
  message?: string;
};

export function isExistingAccountError(error: AuthClientError | null | undefined) {
  return (
    error?.code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL" ||
    /user already exists|email already (?:exists|in use)|account already exists/i.test(
      error?.message ?? "",
    )
  );
}
