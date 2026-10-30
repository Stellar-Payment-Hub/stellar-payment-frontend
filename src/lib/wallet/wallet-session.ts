import { WalletSessionState } from '../../types/wallet-hub';

const SESSION_KEY = 'sph_wallet_session_v1';
const DEFAULT_TIMEOUT_MS = 60 * 60 * 1000; // 1 hour

export class WalletSessionManager {
  static saveSession(session: Omit<WalletSessionState, 'connectedAt' | 'expiresAt'>): WalletSessionState {
    const now = Date.now();
    const fullSession: WalletSessionState = {
      ...session,
      connectedAt: now,
      expiresAt: now + DEFAULT_TIMEOUT_MS,
    };
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(fullSession));
    } catch (e) {
      console.warn('Failed to persist wallet session', e);
    }
    return fullSession;
  }

  static getSession(): WalletSessionState | null {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      const session: WalletSessionState = JSON.parse(raw);
      if (Date.now() > session.expiresAt) {
        this.clearSession();
        return null;
      }
      return session;
    } catch {
      return null;
    }
  }

  static clearSession(): void {
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch {}
  }
}
