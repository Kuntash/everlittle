import { beforeEach, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { GoogleAdsMeasurement } from "@/components/google-ads-measurement";
import { ADS_CONSENT_KEY, configureAdsPolicy, loadGoogleAds } from "@/lib/google-ads";

vi.mock("@tanstack/react-router", () => ({ useRouterState: () => "/" }));
vi.mock("@/lib/auth-client", () => ({ authClient: { useSession: () => ({ data: null }) } }));
vi.mock("@/lib/google-ads", async (original) => ({
  ...(await original<typeof import("@/lib/google-ads")>()),
  loadGoogleAds: vi.fn().mockResolvedValue(true),
}));
beforeEach(() => {
  localStorage.clear();
  configureAdsPolicy({ mode: "opt-in", globalPrivacyControl: false });
  vi.mocked(loadGoogleAds).mockClear();
});
function platform(mode: "opt-in" | "us-opt-out", gpc = false, environment = "live_mode") {
  vi.spyOn(globalThis, "fetch").mockResolvedValue(
    new Response(
      JSON.stringify({
        deploymentMode: "hosted",
        advertising: { mode, globalPrivacyControl: gpc },
        analytics: { posthog: { environment } },
      }),
    ),
  );
}
it("hides the floating control when allowed and supports revocation from the footer", async () => {
  platform("us-opt-out");
  render(<GoogleAdsMeasurement />);
  await waitFor(() => expect(fetch).toHaveBeenCalled());
  fireEvent(window, new Event("everlittle-open-cookie-preferences"));
  expect(screen.getByText(/measurement is on/)).toBeInTheDocument();
  expect(loadGoogleAds).toHaveBeenCalled();
  expect(localStorage.getItem(ADS_CONSENT_KEY)).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "Not allow" }));
  expect(localStorage.getItem(ADS_CONSENT_KEY)).toBe("denied");
  expect(screen.queryByRole("complementary")).not.toBeInTheDocument();
});
it("shows an opt-in banner elsewhere and waits for the choice", async () => {
  platform("opt-in");
  render(<GoogleAdsMeasurement />);
  fireEvent.click(await screen.findByRole("button", { name: "Allow" }));
  await waitFor(() => expect(loadGoogleAds).toHaveBeenCalled());
  expect(localStorage.getItem(ADS_CONSENT_KEY)).toBe("granted");
  expect(screen.queryByRole("button", { name: "Cookie preferences" })).not.toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Done" })).not.toBeInTheDocument();
});
it("honors GPC without an automatic banner or an enabled allow button", async () => {
  platform("us-opt-out", true);
  localStorage.setItem(ADS_CONSENT_KEY, "granted");
  render(<GoogleAdsMeasurement />);
  fireEvent.click(await screen.findByRole("button", { name: "Cookie preferences" }));
  expect(screen.getByRole("button", { name: "Allow" })).toBeDisabled();
  expect(loadGoogleAds).not.toHaveBeenCalled();
});
it("keeps test deployments untagged", async () => {
  platform("us-opt-out", false, "test_mode");
  render(<GoogleAdsMeasurement />);
  await waitFor(() => expect(fetch).toHaveBeenCalled());
  expect(screen.queryByRole("button")).not.toBeInTheDocument();
  expect(loadGoogleAds).not.toHaveBeenCalled();
});

it("keeps a compact preferences control after refusing and allows a later change", async () => {
  platform("opt-in");
  render(<GoogleAdsMeasurement />);
  fireEvent.click(await screen.findByRole("button", { name: "Not allow" }));
  expect(loadGoogleAds).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Cookie preferences" }));
  expect(screen.queryByRole("button", { name: "Done" })).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Allow" }));
  expect(screen.queryByRole("button", { name: "Cookie preferences" })).not.toBeInTheDocument();
  expect(localStorage.getItem(ADS_CONSENT_KEY)).toBe("granted");
});
