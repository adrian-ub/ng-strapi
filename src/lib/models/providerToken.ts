/**
 * Configuración del proveedor del Token
 */
export interface ProviderToken {
  /**
   * Código de acceso Token
   */
  access_token?: string;
  /**
   * Código
   */
  code?: string;
  /**
   * Código de autenticación con proveedor
   */
  oauth_token?: string;
}
