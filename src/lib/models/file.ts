/**
 * Archivo
 */
export interface File {
  /**
   * Nombre del archivo
   */
  name: string;
  /**
   * Sha256
   */
  sha256: string;
  /**
   * Hash
   */
  hash: string;
  /**
   * Extensión
   */
  ext: string;
  /**
   * Tamaño
   */
  size: string;
  /**
   * Tipo
   */
  mime: string;
  /**
   * Url
   */
  url: string;
  /**
   * Proveedor
   */
  provider: string;
  /**
   * Fecha de actualización
   */
  updatedAt: string;
  /**
   * Fecha de creación
   */
  createdAt: string;
  /**
   * Relacionados
   */
  related: string[];
}
