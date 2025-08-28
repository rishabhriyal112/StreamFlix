// Mobile detection and API optimization
export const isMobile = () => {
  if (typeof navigator === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export const getMobileOptimizedUrl = (url) => {
  if (isMobile()) {
    // Add mobile-specific parameters
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}language=en-US&region=US`;
  }
  return url;
};

export const getMobileHeaders = () => {
  return {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'User-Agent': 'StreamFlix/1.0',
    'Cache-Control': 'no-cache'
  };
};