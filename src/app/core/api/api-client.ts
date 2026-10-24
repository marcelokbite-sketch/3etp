import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpContext, HttpContextToken, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export type AuthorityContext = 'client' | 'hq' | 'customer' | 'auto';
export const AUTH_AUTHORITY = new HttpContextToken<AuthorityContext>(() => 'auto');

export interface RequestOptions {
  headers?: HttpHeaders | Record<string, string | string[]>;
  params?: HttpParams | Record<string, string | number | boolean | readonly (string | number | boolean)[]>;
  reportProgress?: boolean;
  withCredentials?: boolean;
  context?: HttpContext;
}

@Injectable({
  providedIn: 'root'
})
export class HqApiClient {
  private http = inject(HttpClient);

  private normalizeUrl(url: string): string {
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return url.startsWith('/api/v1') ? url : `/api/v1${url.startsWith('/') ? '' : '/'}${url}`;
  }

  private getHqContext(customContext?: HttpContext): HttpContext {
    const ctx = customContext || new HttpContext();
    return ctx.set(AUTH_AUTHORITY, 'hq');
  }

  get<T>(url: string, options?: RequestOptions): Observable<T> {
    return this.http.get<T>(this.normalizeUrl(url), {
      ...options,
      context: this.getHqContext(options?.context)
    });
  }

  post<T>(url: string, body: unknown, options?: RequestOptions): Observable<T> {
    return this.http.post<T>(this.normalizeUrl(url), body, {
      ...options,
      context: this.getHqContext(options?.context)
    });
  }

  put<T>(url: string, body: unknown, options?: RequestOptions): Observable<T> {
    return this.http.put<T>(this.normalizeUrl(url), body, {
      ...options,
      context: this.getHqContext(options?.context)
    });
  }

  patch<T>(url: string, body: unknown, options?: RequestOptions): Observable<T> {
    return this.http.patch<T>(this.normalizeUrl(url), body, {
      ...options,
      context: this.getHqContext(options?.context)
    });
  }

  delete<T>(url: string, options?: RequestOptions): Observable<T> {
    return this.http.delete<T>(this.normalizeUrl(url), {
      ...options,
      context: this.getHqContext(options?.context)
    });
  }
}

@Injectable({
  providedIn: 'root'
})
export class ClientApiClient {
  private http = inject(HttpClient);

  private normalizeUrl(url: string): string {
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return url.startsWith('/api/v1') ? url : `/api/v1${url.startsWith('/') ? '' : '/'}${url}`;
  }

  private getClientContext(customContext?: HttpContext): HttpContext {
    const ctx = customContext || new HttpContext();
    return ctx.set(AUTH_AUTHORITY, 'client');
  }

  get<T>(url: string, options?: RequestOptions): Observable<T> {
    return this.http.get<T>(this.normalizeUrl(url), {
      ...options,
      context: this.getClientContext(options?.context)
    });
  }

  post<T>(url: string, body: unknown, options?: RequestOptions): Observable<T> {
    return this.http.post<T>(this.normalizeUrl(url), body, {
      ...options,
      context: this.getClientContext(options?.context)
    });
  }

  put<T>(url: string, body: unknown, options?: RequestOptions): Observable<T> {
    return this.http.put<T>(this.normalizeUrl(url), body, {
      ...options,
      context: this.getClientContext(options?.context)
    });
  }

  patch<T>(url: string, body: unknown, options?: RequestOptions): Observable<T> {
    return this.http.patch<T>(this.normalizeUrl(url), body, {
      ...options,
      context: this.getClientContext(options?.context)
    });
  }

  delete<T>(url: string, options?: RequestOptions): Observable<T> {
    return this.http.delete<T>(this.normalizeUrl(url), {
      ...options,
      context: this.getClientContext(options?.context)
    });
  }
}

@Injectable({
  providedIn: 'root'
})
export class CustomerApiClient {
  private http = inject(HttpClient);

  private normalizeUrl(url: string): string {
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return url.startsWith('/api/v1') ? url : `/api/v1${url.startsWith('/') ? '' : '/'}${url}`;
  }

  private getCustomerContext(customContext?: HttpContext): HttpContext {
    const ctx = customContext || new HttpContext();
    return ctx.set(AUTH_AUTHORITY, 'customer');
  }

  get<T>(url: string, options?: RequestOptions): Observable<T> {
    return this.http.get<T>(this.normalizeUrl(url), {
      ...options,
      context: this.getCustomerContext(options?.context)
    });
  }

  post<T>(url: string, body: unknown, options?: RequestOptions): Observable<T> {
    return this.http.post<T>(this.normalizeUrl(url), body, {
      ...options,
      context: this.getCustomerContext(options?.context)
    });
  }

  put<T>(url: string, body: unknown, options?: RequestOptions): Observable<T> {
    return this.http.put<T>(this.normalizeUrl(url), body, {
      ...options,
      context: this.getCustomerContext(options?.context)
    });
  }

  patch<T>(url: string, body: unknown, options?: RequestOptions): Observable<T> {
    return this.http.patch<T>(this.normalizeUrl(url), body, {
      ...options,
      context: this.getCustomerContext(options?.context)
    });
  }

  delete<T>(url: string, options?: RequestOptions): Observable<T> {
    return this.http.delete<T>(this.normalizeUrl(url), {
      ...options,
      context: this.getCustomerContext(options?.context)
    });
  }
}

@Injectable({
  providedIn: 'root'
})
export class ApiClient {
  private http = inject(HttpClient);

  private normalizeUrl(url: string): string {
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return url.startsWith('/api/v1') ? url : `/api/v1${url.startsWith('/') ? '' : '/'}${url}`;
  }

  private getContext(authority: AuthorityContext = 'auto', customContext?: HttpContext): HttpContext {
    const ctx = customContext || new HttpContext();
    return ctx.set(AUTH_AUTHORITY, authority);
  }

  get<T>(url: string, options?: RequestOptions, authority: AuthorityContext = 'auto'): Observable<T> {
    return this.http.get<T>(this.normalizeUrl(url), {
      ...options,
      context: this.getContext(authority, options?.context)
    });
  }

  post<T>(url: string, body: unknown, options?: RequestOptions, authority: AuthorityContext = 'auto'): Observable<T> {
    return this.http.post<T>(this.normalizeUrl(url), body, {
      ...options,
      context: this.getContext(authority, options?.context)
    });
  }

  put<T>(url: string, body: unknown, options?: RequestOptions, authority: AuthorityContext = 'auto'): Observable<T> {
    return this.http.put<T>(this.normalizeUrl(url), body, {
      ...options,
      context: this.getContext(authority, options?.context)
    });
  }

  patch<T>(url: string, body: unknown, options?: RequestOptions, authority: AuthorityContext = 'auto'): Observable<T> {
    return this.http.patch<T>(this.normalizeUrl(url), body, {
      ...options,
      context: this.getContext(authority, options?.context)
    });
  }

  delete<T>(url: string, options?: RequestOptions, authority: AuthorityContext = 'auto'): Observable<T> {
    return this.http.delete<T>(this.normalizeUrl(url), {
      ...options,
      context: this.getContext(authority, options?.context)
    });
  }
}
