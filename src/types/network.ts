export interface NetworkInfo {
  ip: string;
  ipType: 'IPv4' | 'IPv6';
  city: string;
  region: string;
  country: string;
  countryCode: string;
  countryFlag: string;
  latitude: number | null;
  longitude: number | null;
  timezone: string;
  utcOffset: string;
  localTime: string;
  isp: string;
  org: string;
  asn: string;
  postalCode?: string;
  currency?: string;
  callingCode?: string;
}

export interface DeviceInfo {
  os: string;
  osVersion: string;
  browser: string;
  browserVersion: string;
  engine: string;
  screenWidth: number;
  screenHeight: number;
  availWidth: number;
  availHeight: number;
  devicePixelRatio: number;
  colorDepth: number;
  online: boolean;
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
}

export interface RouteNodeData {
  id: string;
  label: string;
  name: string;
  badge: string;
  status: 'active' | 'success' | 'routing' | 'target';
  statusText: string;
  details: { label: string; value: string }[];
  iconType: 'device' | 'local' | 'isp' | 'internet' | 'location';
}

export interface LatencyMetric {
  latencyMs: number | null;
  status: 'measuring' | 'ready' | 'offline';
  timestamp: string;
}
