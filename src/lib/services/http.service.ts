import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { File } from '../models/file';

/**
 * Obtener los datos de la API
 */
@Injectable({
  providedIn: 'root'
})
export class HttpService {

  /**
   * URL del host de Strapi
   */
  private baseUrl: string;

  /**
   * Constructor por defecto
   * @param baseUrl Url del host de Strapi
   * @param http Servicio `HttpClient` de Angular
   */
  constructor(@Inject('baseUrl') baseUrl: string, private readonly http: HttpClient) {
    this.baseUrl = baseUrl;
  }

  /**
   * Lista de entradas
   * @param contentTypePluralized Tipo de contenido Pluralizado
   * @param params Filtrar y ordenar consultas.
   * @return Observable
   */
  public getEntries<T>(contentTypePluralized: string, params?: HttpParams): Observable<T[]> {
    return this.http.get<T[]>(`${this.baseUrl}/${contentTypePluralized}`, {
      params
    });
  }

  /**
   * Obtenga el recuento total de entradas con los criterios proporcionados
   * @param contentTypePluralized Tipo de contenido Pluralizado
   * @param params Filtrar y ordenar consultas
   * @returns Observable<number>
   */
  public getEntryCount(contentTypePluralized: string, params?: HttpParams): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/${contentTypePluralized}/count`, {
      params
    });
  }

  /**
   * Obtén una entrada específica
   * @param contentTypePluralized Tipo de contenido Pluralizado
   * @param id ID de entrada
   * @returns Observable
   */
  public getEntry<T>(contentTypePluralized: string, id: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${contentTypePluralized}/${id}`);
  }

  /**
   * Crear datos
   * @param contentTypePluralized Tipo de contenido Pluralizado
   * @param data Nueva entrada
   * @param params Parametros
   * @returns Observable
   */
  public createEntry<T>(contentTypePluralized: string, data: T, params?: HttpParams): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${contentTypePluralized}`,
      data,
      {
        params
      }
    );
  }

  /**
   * Actualizar datos
   * @param contentTypePluralized Tipo de contenido Pluralizado
   * @param id ID de entrada
   * @param data Nuevos datos
   * @param params Parametros
   * @returns Observable
   */
  public updateEntry<T>(contentTypePluralized: string, id: string, data: T, params?: HttpParams): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${contentTypePluralized}/${id}`, data, {
      params
    });
  }

  /**
   * Eliminar una entrada
   * @param contentTypePluralized Tipo de contenido Pluralizado
   * @param id ID de entrada
   * @returns Observable
   */
  public deleteEntry<T>(contentTypePluralized: string, id: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}/${contentTypePluralized}/${id}`);
  }

  /**
   * Buscar archivos
   * @param query Palabras clave
   * @returns Observable
   */
  public searchFiles(query: string): Observable<File> {
    return this.http.get<File>(`${this.baseUrl}/upload/search/${decodeURIComponent(query)}`);
  }

  /**
   * Obtener archivos
   * @param params Filtrar y ordenar consultas
   * @returns Observable
   */
  public getFiles(params?: HttpParams): Observable<File[]> {
    return this.http.get<File[]>(`${this.baseUrl}/upload/files`, {
      params
    });
  }

  /**
   * Obtener un archivo
   * @param id ID de entrada
   * @returns Observable
   */
  public getFile(id: string): Observable<File> {
    return this.http.get<File>(`${this.baseUrl}/upload/files/${id}`);
  }

  /**
   * Subir archivos
   * @param data FormData
   * @param params Parametros
   */
  public upload(data: FormData, params?: HttpParams): Observable<File> {
    return this.http.post<File>(`${this.baseUrl}/upload`, data, {
        params
      });
  }

}
