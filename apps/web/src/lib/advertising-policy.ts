export type AdvertisingPolicy = {
  mode: "opt-in" | "us-opt-out";
  globalPrivacyControl: boolean;
};

// Only the explicitly supported US policy defaults to measurement. Unknown
// locations and other countries require an affirmative choice.
export function advertisingPolicy(
  country: unknown,
  globalPrivacyControl: boolean,
): AdvertisingPolicy {
  return { mode: country === "US" ? "us-opt-out" : "opt-in", globalPrivacyControl };
}
