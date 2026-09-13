export function CookiePreferencesLink() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("everlittle-open-cookie-preferences"))}
    >
      Cookie preferences
    </button>
  );
}
