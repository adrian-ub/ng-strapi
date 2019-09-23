/**
 * Modelo de autenticación
 */
export interface Authentication {
  /**
   * Usuario
   */
  user: object;
  /**
   * Token
   */
  jwt: string;
}
