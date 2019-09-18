import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { File } from '../models/file';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private baseUrl: string;

  constructor(@Inject('baseUrl') baseUrl: string, private readonly http: HttpClient) {
    this.baseUrl = baseUrl;
  }

  public getEntries<T>(contentTypePluralized: string, params?: HttpParams): Observable<T[]> {
    return this.http.get<T[]>(`${this.baseUrl}/${contentTypePluralized}`, {
      params
    });
  }

  public getEntryCount(contentType: string, params?: HttpParams): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/${contentType}/count`, {
      params
    });
  }

  public getEntry<T>(contentTypePluralized: string, id: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${contentTypePluralized}/${id}`);
  }

  public createEntry<T>(contentTypePluralized: string, data: T, params?: HttpParams): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${contentTypePluralized}`,
      data,
      {
        params
      }
    );
  }

  public updateEntry<T>(contentTypePluralized: string, id: string, data: T, params?: HttpParams): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${contentTypePluralized}/${id}`, data, {
      params
    });
  }

  public deleteEntry<T>(contentTypePluralized: string, id: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}/${contentTypePluralized}/${id}`);
  }

  public searchFiles(query: string): Observable<File> {
    return this.http.get<File>(`${this.baseUrl}/upload/search/${decodeURIComponent(query)}`);
  }

  public getFiles(params?: HttpParams): Observable<File[]> {
    return this.http.get<File[]>(`${this.baseUrl}/upload/files`, {
      params
    });
  }

  public getFile(id: string): Observable<File> {
    return this.http.get<File>(`${this.baseUrl}/upload/files/${id}`);
  }

  public upload(data: FormData, params?: HttpParams): Observable<File> {
    return this.http.post<File>(`${this.baseUrl}/upload`, data, {
        params
      });
  }

}
