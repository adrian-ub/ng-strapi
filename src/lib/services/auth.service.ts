import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { JwtService } from './jwt.service';

import { Authentication } from '../models/authentication';
import { StoreConfig } from '../models/storeConfig';
import { Provider } from '../models/provider';
import { ProviderToken } from '../models/providerToken';

import { Observable } from 'rxjs';
import * as Cookies from 'js-cookie';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl: string;

  constructor(@Inject('baseUrl') baseUrl: string, @Inject('config') private storeConfig: StoreConfig, private readonly http: HttpClient,
              private jwtService: JwtService) {

    this.baseUrl = baseUrl;

    this.storeConfig = {
      cookie: {
        key: 'jwt',
        options: {
          path: '/'
        }
      },
      localStorage: {
        key: 'jwt'
      },
      ...storeConfig
    };
    this.getToken();
  }

  public getToken() {
    let existingToken: string;

    if (this.storeConfig.cookie) {
      existingToken = Cookies.get(this.storeConfig.cookie.key);
    } else if (this.storeConfig.localStorage) {
      existingToken = JSON.parse(window.localStorage.getItem(
        this.storeConfig.localStorage.key
      ) as string);
    }
    return existingToken;
  }

  public register(data: any): Observable<Authentication> {
    this.clearToken();
    const authentication = this.http.post<Authentication>(`${this.baseUrl}/auth/local/register`, data);

    const token = authentication;
    token.subscribe(jwt => {
      this.setToken(jwt.jwt);
    });
    return authentication;
  }

  public login(identifier: string, password: string): Observable<Authentication> {

    this.clearToken();

    const authentication = this.http.post<Authentication>(`${this.baseUrl}/auth/local`, {
      identifier,
      password
    });

    const token = authentication;

    token.subscribe(jwt => {
      this.setToken(jwt.jwt);
    });

    return authentication;

  }

  public getCurrentUser<T>(): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/users/me`);
  }


  public isAuthenticated(): boolean {
    return !this.jwtService.isTokenExpired(this.getToken());
  }

  public logout() {
    try {
      this.clearToken();
      return true;
    } catch (e) {
      return false;
    }
  }

  public forgotPassword(email: string, url: string) {
    this.clearToken();
    const request = this.http.post(`${this.baseUrl}/auth/local`, {
      email,
      url
    });

    return request;
  }

  public resetPassword(
    code: string,
    password: string,
    passwordConfirmation: string
  ) {
    this.clearToken();
    const request = this.http.post(`${this.baseUrl}/auth/reset-password`, {
      code,
      password,
      passwordConfirmation
    });

    return request;
  }

  public getProviderAuthenticationUrl(provider: Provider): string {
    return `${this.baseUrl}/connect/${provider}`;
  }

  public authenticateProvider(provider: Provider, params?: ProviderToken): Observable<Authentication> {
    this.clearToken();
    const headers = new HttpHeaders();
    headers.append('access_token', params.access_token);
    headers.append('code', params.code);
    headers.append('oauth_token', params.oauth_token);

    const authentication = this.http.get<Authentication>(`${this.baseUrl}/auth/${provider}/callback`, {
      headers
    });

    const token = authentication;
    token.subscribe(jwt => {
      this.setToken(jwt.jwt);
    });

    return authentication;
  }


  private setToken(token: string, comesFromStorage?: boolean): void {
    if (!comesFromStorage) {
      if (this.storeConfig.localStorage) {
        window.localStorage.setItem(
          this.storeConfig.localStorage.key,
          JSON.stringify(token)
        );
      }
      if (this.storeConfig.cookie) {
        Cookies.set(
          this.storeConfig.cookie.key,
          token,
          this.storeConfig.cookie.options
        );
      }
    }
  }

  private clearToken(): void {
    if (this.storeConfig.localStorage) {
      window.localStorage.removeItem(this.storeConfig.localStorage.key);
    }
    if (this.storeConfig.cookie) {
      Cookies.remove(
        this.storeConfig.cookie.key,
        this.storeConfig.cookie.options
      );
    }
  }

}
