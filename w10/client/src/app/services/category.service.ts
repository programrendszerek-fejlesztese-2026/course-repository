import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Category } from '../in-memory/models';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private baseUrl = `${environment.apiUrl}/categories`;

  constructor(private http: HttpClient) {}

  private normalizeCategory(obj: any): Category {
    const { _id, ...rest } = obj || {};
    return {
      id: _id ?? rest.id,
      name: rest.name ?? '',
      description: rest.description ?? undefined
    } as Category;
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<any[]>(this.baseUrl).pipe(
      map(items => (items || []).map(i => this.normalizeCategory(i))),
      catchError(err => {
        console.error('getCategories error', err);
        return throwError(() => err);
      })
    );
  }

  getCategoryById(id: string): Observable<Category> {
    return this.http.get<any>(`${this.baseUrl}/${id}`).pipe(
      map(item => this.normalizeCategory(item)),
      catchError(err => {
        console.error('getCategoryById error', err);
        return throwError(() => err);
      })
    );
  }

  createCategory(data: Partial<Category>): Observable<Category> {
    return this.http.post<any>(this.baseUrl, data).pipe(
      map(item => this.normalizeCategory(item)),
      catchError(err => {
        console.error('createCategory error', err);
        return throwError(() => err);
      })
    );
  }

  updateCategory(id: string, data: Partial<Category>): Observable<Category> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, data).pipe(
      map(item => this.normalizeCategory(item)),
      catchError(err => {
        console.error('updateCategory error', err);
        return throwError(() => err);
      })
    );
  }

  deleteCategory(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      catchError(err => {
        console.error('deleteCategory error', err);
        return throwError(() => err);
      })
    );
  }
}
