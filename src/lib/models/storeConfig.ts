import { CookieConfig } from './cookieConfig';
import { LocalStorageConfig } from './localStorageConfig';

/**
 * Configuración para almacenar el Token
 */
export interface StoreConfig {
  /**
   * Configuración para Cookie
   */
  cookie?: CookieConfig | false;
  /**
   * Configuración para localStorage
   */
  localStorage?: LocalStorageConfig | false;
}
