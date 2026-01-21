export class AuthService {
  static instance: AuthService;
  private token: string | null = null;
  private expiresAt: number | null = null;
  private expireTimer: ReturnType<typeof setTimeout> | null = null;

  private constructor() {
    this.loadFromStorage();
    this.scheduleTokenExpiration();
  }

  static getInstance() {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private saveToStorage() {
    if (this.token && this.expiresAt) {
      localStorage.setItem('auth_token', this.token);
      localStorage.setItem('auth_expiresAt', this.expiresAt.toString());
    } else {
      this.clearStorage();
    }
  }

  private loadFromStorage() {
    const storedToken = localStorage.getItem('auth_token');
    const storedExpiresAt = localStorage.getItem('auth_expiresAt');

    if (storedToken && storedExpiresAt) {
      const expiration = Number(storedExpiresAt);

      if (Date.now() > expiration) {
        this.clearStorage();
        return;
      }

      this.token = storedToken;
      this.expiresAt = expiration;
    }
  }

  private clearStorage() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_expiresAt');
  }

  setToken(token: string, expirationInSeconds: number) {
    this.token = token;
    this.expiresAt = Date.now() + expirationInSeconds * 1000;
    this.saveToStorage();
    this.scheduleTokenExpiration();
  }

  getToken() {
    if (this.expiresAt && Date.now() > this.expiresAt) {
      this.clearToken();
      return null;
    }
    return this.token;
  }

  clearToken() {
    this.token = null;
    this.expiresAt = null;
    this.clearStorage();
    if (this.expireTimer) {
      clearTimeout(this.expireTimer);
      this.expireTimer = null;
    }
  }

  isTokenValid() {
    if (!this.token || !this.expiresAt) return false;
    return Date.now() < this.expiresAt!;
  }

  getRemainingTime() {
    if (!this.expiresAt) return 0;
    return Math.max(0, this.expiresAt - Date.now());
  }

  private scheduleTokenExpiration() {
    if (!this.expiresAt) return;

    const remainingTime = this.expiresAt! - Date.now();
    if (remainingTime <= 0) {
      this.clearToken();
      return;
    }
    if (this.expireTimer) {
      clearTimeout(this.expireTimer);
    }
    this.expireTimer = globalThis.setTimeout(() => {
      this.clearToken();
    }, remainingTime);
  }
}
