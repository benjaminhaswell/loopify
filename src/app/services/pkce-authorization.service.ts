import { Injectable } from '@angular/core';
import { CLIENT_ID } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PkceAuthorizationService {
  private clientId = CLIENT_ID;
  private redirectUri = 'http://localhost:4200/';
  private scope = 'user-read-private user-read-email';
  private authUrl = 'https://accounts.spotify.com/authorize';
  private tokenUrl = 'https://accounts.spotify.com/api/token';

  constructor() {}

  /**
   * Initiates the Spotify authentication process.
   */
  async authenticate(): Promise<void> {
    const codeVerifier = this.generateRandomString(64);
    const codeChallenge = await this.generateCodeChallenge(codeVerifier);

    // Store the code verifier in localStorage
    localStorage.setItem('code_verifier', codeVerifier);

    // Build the authorization URL
    const params = {
      response_type: 'code',
      client_id: this.clientId,
      scope: this.scope,
      code_challenge_method: 'S256',
      code_challenge: codeChallenge,
      redirect_uri: this.redirectUri,
    };

    const authUrl = `${this.authUrl}?${new URLSearchParams(params).toString()}`;
    window.location.href = authUrl;
  }

  /**
   * Exchanges the authorization code for an access token.
   * @param code The authorization code returned by Spotify.
   */
  async getToken(code: string): Promise<void> {
    const codeVerifier = localStorage.getItem('code_verifier');
    if (!codeVerifier) {
      throw new Error('Code verifier not found in localStorage.');
    }

    const payload = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: this.clientId,
        grant_type: 'authorization_code',
        code,
        redirect_uri: this.redirectUri,
        code_verifier: codeVerifier,
      }),
    };

    const response = await fetch(this.tokenUrl, payload);
    const data = await response.json();

    if (data.access_token) {
      localStorage.setItem('access_token', data.access_token);
    } else {
      throw new Error('Failed to retrieve access token.');
    }
  }

  /**
   * Generates a random string for the PKCE code verifier.
   * @param length The length of the random string.
   */
  private generateRandomString(length: number): string {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], '');
  }

  /**
   * Generates a code challenge from the code verifier.
   * @param codeVerifier The code verifier.
   */
  private async generateCodeChallenge(codeVerifier: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const hashed = await crypto.subtle.digest('SHA-256', data);
    return this.base64encode(hashed);
  }

  /**
   * Encodes an ArrayBuffer to a base64 string.
   * @param input The ArrayBuffer to encode.
   */
  private base64encode(input: ArrayBuffer): string {
    return btoa(String.fromCharCode(...new Uint8Array(input)))
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  }
}