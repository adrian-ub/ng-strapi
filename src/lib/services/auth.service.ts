import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { JwtService } from './jwt.service';

import { Authentication } from '../models/authentication';
import { StoreConfig } from '../models/storeConfig';
import { Provider } from '../models/provider';
import { ProviderToken } from '../models/providerToken';

import { Observable } from 'rxjs';
import * as Cookies from 'js-cookie';

/**
 * Servicio para la autenticación
 * @Template T
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  /**
   * URL del host Strapi
   */
  private baseUrl: string;

  /**
   * Constructor predeterminado.
   * @param baseUrl Tu Strapi host.
   * @param storeConfig Extienda la configuración de storeConfig.
   * @param http Servicios Http de Angular
   * @param jwtService Servicio para almacenar el token de autenticación
   */
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

  /**
   * Obtener token
   * @returns Cadena de texto con el Token
   */
  public getToken(): string {
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

  /**
   * Registra un nuevo usuario.
   * @param data Array de todos los campos utilizado en su tabla users
   * @returns Authentication User token and profile
   */
  public register(data: any): Observable<Authentication> {
    this.clearToken();
    const authentication = this.http.post<Authentication>(`${this.baseUrl}/auth/local/register`, data);

    const token = authentication;
    token.subscribe(jwt => {
      this.setToken(jwt.jwt);
    });
    return authentication;
  }

  /**
   * Inicie sesión obteniendo un token de autenticación.
   * @param identifier Puede ser un correo electrónico o un nombre de usuario.
   * @param password Contraseña
   * @returns Token de usuario de autenticación y perfil
   */
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

  /**
   * Obteniendo el usuario actual
   * @param T Parametro para concordar con su interfaz
   * @returns Observable<T> con el usuario actual
   */
  public getCurrentUser<T>(): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/users/me`);
  }

  /**
   * Saber si hay un usuario autenticado.
   * @returns Boolean
   */
  public isAuthenticated(): boolean {
    return !this.jwtService.isTokenExpired(this.getToken());
  }

  /**
   * Cerrar sesión
   * @returns Si se cerró o no la sesión.
   */
  public logout(): boolean {
    try {
      this.clearToken();
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Envía un correo electrónico a un usuario con el enlace de su página de restablecimiento de contraseña.
   * Este enlace contiene un código de parámetro de URL que se requiere para restablecer la contraseña del usuario.
   * Recibido enlace url formato https://my-domain.com/rest-password?code=privateCode.
   * @param email Email a donde se enviara el correo electrónico
   * @param url Url a donde sera enviado para reestablecer la contraseña
   * @returns Observable
   */
  public forgotPassword(email: string, url: string) {
    this.clearToken();
    return this.http.post(`${this.baseUrl}/auth/local`, {
      email,
      url
    });
  }

  /**
   * Restablecer la contraseña del usuario.
   * @param code Es el código recibido en el correo
   * @param password Nueva contraseña
   * @param passwordConfirmation Confirmación de la nueva contraseña
   * @returns Observable
   */
  public resetPassword(
    code: string,
    password: string,
    passwordConfirmation: string
  ) {
    this.clearToken();
    return this.http.post(`${this.baseUrl}/auth/reset-password`, {
      code,
      password,
      passwordConfirmation
    });
  }

  /**
   * Recupere la URL del proveedor de conexión
   * @param provider 'Facebook', 'Twitter', etc..
   * @returns Url del provider
   */
  public getProviderAuthenticationUrl(provider: Provider): string {
    return `${this.baseUrl}/connect/${provider}`;
  }

  /**
   * Autentique al usuario con el token presente en la URL (para el navegador) o en `params` (en Node.js)
   * @param provider Proveedor
   * @param params Proveedor del token
   * @returns Observable
   */
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

  /**
   * Guardar Token para poder recordarlo
   * @param token Recuperado por registro o inicio de sesión
   * @param comesFromStorage  Viene de almacenamiento
   */
  private setToken(token: string, comesFromStorage?: boolean) {
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

  /**
   * Borrar token
   */
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
