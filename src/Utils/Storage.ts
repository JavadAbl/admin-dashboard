class Storage {
  private themeKey = "theme";
  private accessTokenKey = "accessToken";
  private refreshTokenKey = "accessToken";

  getTheme() {
    return localStorage.getItem(this.themeKey);
  }

  setTheme(theme: string) {
    localStorage.setItem(this.themeKey, theme);
  }

  setTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem(this.accessTokenKey, accessToken);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
  }

  getAccessToken() {
    return localStorage.getItem(this.accessTokenKey);
  }

  getRefreshToken() {
    return localStorage.getItem(this.refreshTokenKey);
  }
}

export const storage = new Storage();
