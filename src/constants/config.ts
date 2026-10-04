export const API_URL = 'http://10.165.0.191:3001';
import Constants from 'expo-constants';

const FALLBACK_API_URL = 'http://10.165.0.191:3001';

/** Pull the LAN hostname out of Expo's packager URI (`192.168.1.12:8081`). */
function metroHost(): string | undefined {
  const hostUri =
    Constants.expoConfig?.hostUri ??
    Constants.linkingUri?.replace(/^exp:\/\//, '');
  if (!hostUri) {
    return undefined;
  }
  const host = hostUri.replace(/^https?:\/\//, '').split('/')[0]?.split(':')[0];
  if (!host || host === 'localhost' || host === '127.0.0.1') {
    return undefined;
  }
  return host;
}

function resolveApiUrl(): string {
  const host = metroHost();
  if (host) {
    return `http://${host}:3001`;
  }
  return FALLBACK_API_URL;
}

export const API_URL = resolveApiUrl();
console.log('[api] API_URL =', API_URL);

export const USER_ID = 'me';
