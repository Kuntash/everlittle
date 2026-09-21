type PwaInstallContext = {
  isOnboarding?: boolean;
  dismissed: boolean;
  hasInstallPrompt: boolean;
  isAuthenticated: boolean;
  isIos: boolean;
  standalone: boolean;
};

export function shouldOfferPwaInstall({
  isOnboarding = false,
  dismissed,
  hasInstallPrompt,
  isAuthenticated,
  isIos,
  standalone,
}: PwaInstallContext) {
  return (
    !isOnboarding && isAuthenticated && !standalone && !dismissed && (hasInstallPrompt || isIos)
  );
}
