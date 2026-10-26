// Sends a GA4 event when analytics is enabled and the visitor has consented.
// Never pass personal data (names, emails, message text) as parameters.
type Params = Record<string, string | number | boolean>;

export function track(event: string, params: Params = {}) {
  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtag === "function") gtag("event", event, params);
}
