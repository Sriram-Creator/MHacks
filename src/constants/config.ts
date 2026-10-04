import Constants from 'expo-constants';

/**
 * Last-resort host when Metro's host can't be inferred (web, or a
 * production-style launch). Prefer talking to the same machine that
 * is serving the Expo bundle so a physical device can reach /server.
 */
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
  const fromEnv = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '');
  if (fromEnv) {
    return fromEnv;
  }
  const host = metroHost();
  if (host) {
    return `http://${host}:3001`;
  }
  return FALLBACK_API_URL.replace(/\/$/, '');
}

export const API_URL = resolveApiUrl();

// This demo app has no auth, so both roles share a single user record.
export const USER_ID = 'me';
