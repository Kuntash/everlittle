type PwaInstallContext = {
  dismissed: boolean;
  hasInstallPrompt: boolean;
  isAuthenticated: boolean;
  isIos: boolean;
  standalone: boolean;
};

export function shouldOfferPwaInstall({
  dismissed,
  hasInstallPrompt,
  isAuthenticated,
  isIos,
  standalone,
}: PwaInstallContext) {
  return isAuthenticated && !standalone && !dismissed && (hasInstallPrompt || isIos);
}
