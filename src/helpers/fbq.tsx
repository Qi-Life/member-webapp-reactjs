export const trackFacebookEvent = (
  event: string,
  params?: Record<string, any>
) => {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq('track', event, params);
  } else {
    console.log('[Facebook Pixel]', event, params);
  }
};
