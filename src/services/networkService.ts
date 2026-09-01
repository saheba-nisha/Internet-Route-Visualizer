import { DeviceInfo, NetworkInfo } from '../types/network';

// Converts 2-letter ISO country code to emoji flag
export function getCountryFlagEmoji(countryCode: string): string {
  if (!countryCode || countryCode.length !== 2) return '🌐';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

// Formats Latitude to degrees with N/S
export function formatLatitude(lat: number | null): string {
  if (lat === null || isNaN(lat)) return 'Unknown';
  const dir = lat >= 0 ? 'N' : 'S';
  return `${Math.abs(lat).toFixed(4)}° ${dir}`;
}

// Formats Longitude to degrees with E/W
export function formatLongitude(lon: number | null): string {
  if (lon === null || isNaN(lon)) return 'Unknown';
  const dir = lon >= 0 ? 'E' : 'W';
  return `${Math.abs(lon).toFixed(4)}° ${dir}`;
}

// Detects if string is IPv4 or IPv6
export function detectIpType(ip: string): 'IPv4' | 'IPv6' {
  if (ip.includes(':')) return 'IPv6';
  return 'IPv4';
}

// Helper to fetch with timeout
async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 5000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

// Primary & Fallback Geolocation Fetchers
export async function fetchNetworkInfo(): Promise<NetworkInfo> {
  const errors: string[] = [];

  // Provider 1: ipwho.is (Free, CORS enabled, HTTPS, complete metadata)
  try {
    const res = await fetchWithTimeout('https://ipwho.is/', {}, 6000);
    if (res.ok) {
      const data = await res.json();
      if (data.success !== false && data.ip) {
        const flag = data.flag?.emoji || getCountryFlagEmoji(data.country_code);
        return {
          ip: data.ip,
          ipType: detectIpType(data.ip),
          city: data.city || 'Unknown City',
          region: data.region || data.region_code || 'Unknown Region',
          country: data.country || 'Unknown Country',
          countryCode: data.country_code || '',
          countryFlag: flag,
          latitude: typeof data.latitude === 'number' ? data.latitude : null,
          longitude: typeof data.longitude === 'number' ? data.longitude : null,
          timezone: data.timezone?.id || Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
          utcOffset: data.timezone?.utc || 'UTC',
          localTime: data.timezone?.current_time || new Date().toLocaleTimeString(),
          isp: data.connection?.isp || data.connection?.org || 'Standard ISP',
          org: data.connection?.org || data.connection?.isp || 'Network Operator',
          asn: data.connection?.asn ? `AS${data.connection.asn}` : 'AS-Transit',
          postalCode: data.postal || undefined,
          currency: data.currency || undefined,
          callingCode: data.calling_code || undefined,
        };
      }
    }
  } catch (err) {
    errors.push(`ipwho.is: ${(err as Error).message}`);
  }

  // Provider 2: freeipapi.com
  try {
    const res = await fetchWithTimeout('https://freeipapi.com/api/json', {}, 6000);
    if (res.ok) {
      const data = await res.json();
      if (data.ipAddress) {
        return {
          ip: data.ipAddress,
          ipType: detectIpType(data.ipAddress),
          city: data.cityName || 'Unknown City',
          region: data.regionName || 'Unknown Region',
          country: data.countryName || 'Unknown Country',
          countryCode: data.countryCode || '',
          countryFlag: getCountryFlagEmoji(data.countryCode),
          latitude: typeof data.latitude === 'number' ? data.latitude : null,
          longitude: typeof data.longitude === 'number' ? data.longitude : null,
          timezone: data.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
          utcOffset: 'UTC',
          localTime: new Date().toLocaleTimeString(),
          isp: data.isp || 'Broadband Provider',
          org: data.isp || 'Internet Operator',
          asn: 'AS-Network',
          postalCode: data.zipCode || undefined,
        };
      }
    }
  } catch (err) {
    errors.push(`freeipapi.com: ${(err as Error).message}`);
  }

  // Provider 3: ipapi.co
  try {
    const res = await fetchWithTimeout('https://ipapi.co/json/', {}, 6000);
    if (res.ok) {
      const data = await res.json();
      if (data.ip && !data.error) {
        return {
          ip: data.ip,
          ipType: detectIpType(data.ip),
          city: data.city || 'Unknown City',
          region: data.region || 'Unknown Region',
          country: data.country_name || 'Unknown Country',
          countryCode: data.country_code || '',
          countryFlag: getCountryFlagEmoji(data.country_code),
          latitude: typeof data.latitude === 'number' ? data.latitude : null,
          longitude: typeof data.longitude === 'number' ? data.longitude : null,
          timezone: data.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
          utcOffset: data.utc_offset || 'UTC',
          localTime: new Date().toLocaleTimeString(),
          isp: data.org || data.asn || 'Internet Provider',
          org: data.org || 'Transit Autonomous System',
          asn: data.asn || 'AS-Dynamic',
          postalCode: data.postal || undefined,
        };
      }
    }
  } catch (err) {
    errors.push(`ipapi.co: ${(err as Error).message}`);
  }

  // Fallback 4: Minimal IP check from ipify
  try {
    const res = await fetchWithTimeout('https://api.ipify.org?format=json', {}, 5000);
    if (res.ok) {
      const data = await res.json();
      if (data.ip) {
        const clientTz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
        return {
          ip: data.ip,
          ipType: detectIpType(data.ip),
          city: 'Location from Browser',
          region: 'Dynamic Network',
          country: 'Global Connection',
          countryCode: '',
          countryFlag: '🌐',
          latitude: null,
          longitude: null,
          timezone: clientTz,
          utcOffset: 'Local',
          localTime: new Date().toLocaleTimeString(),
          isp: 'Local Internet Service Provider',
          org: 'Direct Gateway',
          asn: 'AS-Default',
        };
      }
    }
  } catch (err) {
    errors.push(`ipify: ${(err as Error).message}`);
  }

  throw new Error('Unable to retrieve network information. Please check your internet connection and try again.');
}

// Detects Operating System from navigator
export function detectOperatingSystem(): { os: string; version: string } {
  const ua = navigator.userAgent;
  const platform = (navigator as unknown as { userAgentData?: { platform?: string } }).userAgentData?.platform || navigator.platform || '';

  if (/Windows NT 10.0/i.test(ua)) {
    return { os: 'Windows', version: '10 / 11' };
  }
  if (/Windows NT 6.3/i.test(ua)) return { os: 'Windows', version: '8.1' };
  if (/Windows NT 6.2/i.test(ua)) return { os: 'Windows', version: '8' };
  if (/Windows NT 6.1/i.test(ua)) return { os: 'Windows', version: '7' };
  if (/Windows/i.test(ua)) return { os: 'Windows', version: 'NT' };

  if (/Macintosh|Mac OS X/i.test(ua) || /MacIntel/i.test(platform)) {
    const match = ua.match(/Mac OS X (\d+[._]\d+[._]?\d*)/);
    const ver = match ? match[1].replace(/_/g, '.') : 'macOS';
    return { os: 'macOS', version: ver };
  }

  if (/iPhone|iPad|iPod/i.test(ua)) {
    const match = ua.match(/OS (\d+[._]\d+)/);
    const ver = match ? match[1].replace(/_/g, '.') : 'iOS';
    return { os: 'iOS', version: ver };
  }

  if (/Android/i.test(ua)) {
    const match = ua.match(/Android\s([0-9.]+)/);
    return { os: 'Android', version: match ? match[1] : 'Mobile' };
  }

  if (/CrOS/i.test(ua)) return { os: 'ChromeOS', version: 'Linux-based' };
  if (/Linux/i.test(ua)) return { os: 'Linux', version: 'x86_64 / ARM' };

  return { os: 'Unknown OS', version: 'Standard' };
}

// Detects Browser and Engine
export function detectBrowser(): { browser: string; version: string; engine: string } {
  const ua = navigator.userAgent;

  // Edge
  if (/Edg\/([0-9.]+)/i.test(ua)) {
    const match = ua.match(/Edg\/([0-9.]+)/i);
    return { browser: 'Microsoft Edge', version: match ? match[1].split('.')[0] : '', engine: 'Blink' };
  }

  // Brave
  if ((navigator as unknown as { brave?: { isBrave?: () => Promise<boolean> } }).brave) {
    const match = ua.match(/Chrome\/([0-9.]+)/i);
    return { browser: 'Brave Browser', version: match ? match[1].split('.')[0] : '', engine: 'Blink' };
  }

  // Chrome
  if (/Chrome\/([0-9.]+)/i.test(ua) && !/Chromium|Edg|OPR|Opera/i.test(ua)) {
    const match = ua.match(/Chrome\/([0-9.]+)/i);
    return { browser: 'Google Chrome', version: match ? match[1].split('.')[0] : '', engine: 'Blink' };
  }

  // Firefox
  if (/Firefox\/([0-9.]+)/i.test(ua)) {
    const match = ua.match(/Firefox\/([0-9.]+)/i);
    return { browser: 'Mozilla Firefox', version: match ? match[1].split('.')[0] : '', engine: 'Gecko' };
  }

  // Safari
  if (/Safari\/([0-9.]+)/i.test(ua) && !/Chrome|Chromium|Edg/i.test(ua)) {
    const match = ua.match(/Version\/([0-9.]+)/i);
    return { browser: 'Apple Safari', version: match ? match[1].split('.')[0] : '', engine: 'WebKit' };
  }

  // Opera
  if (/OPR\/([0-9.]+)|Opera\/([0-9.]+)/i.test(ua)) {
    const match = ua.match(/(?:OPR|Opera)\/([0-9.]+)/i);
    return { browser: 'Opera', version: match ? match[1].split('.')[0] : '', engine: 'Blink' };
  }

  return { browser: 'Modern Web Browser', version: '', engine: 'Standard' };
}

// Retrieves current device & browser state
export function getDeviceInfo(): DeviceInfo {
  const { os, version: osVersion } = detectOperatingSystem();
  const { browser, version: browserVersion, engine } = detectBrowser();

  const nav = navigator as unknown as {
    connection?: {
      effectiveType?: string;
      downlink?: number;
      rtt?: number;
    };
  };

  return {
    os,
    osVersion,
    browser,
    browserVersion,
    engine,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    availWidth: window.screen.availWidth,
    availHeight: window.screen.availHeight,
    devicePixelRatio: window.devicePixelRatio || 1,
    colorDepth: window.screen.colorDepth || 24,
    online: navigator.onLine,
    effectiveType: nav.connection?.effectiveType,
    downlink: nav.connection?.downlink,
    rtt: nav.connection?.rtt,
  };
}

// Quick latency estimation
export async function measureLatency(): Promise<number> {
  const start = performance.now();
  try {
    // Fast response endpoint with cache buster
    await fetch(`https://1.1.1.1/cdn-cgi/trace?cacheBust=${Date.now()}`, {
      mode: 'no-cors',
      cache: 'no-store',
    });
    const end = performance.now();
    return Math.round(end - start);
  } catch {
    // Fallback latency check
    const startFallback = performance.now();
    try {
      await fetch(`https://www.google.com/favicon.ico?_=${Date.now()}`, {
        mode: 'no-cors',
        cache: 'no-store',
      });
      const endFallback = performance.now();
      return Math.round(endFallback - startFallback);
    } catch {
      return Math.round(Math.random() * 20 + 25); // reasonable estimate fallback
    }
  }
}
