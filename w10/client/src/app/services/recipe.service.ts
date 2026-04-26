import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Recipe } from '../in-memory/models';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private baseUrl = `${environment.apiUrl}/recipes`;

  constructor(private http: HttpClient) {}

  private normalizeRecipe(obj: any): Recipe {
    const { _id, createdAt, ...rest } = obj || {};
    return {
      id: _id ?? rest.id,
      title: rest.title ?? '',
      description: rest.description ?? '',
      categoryId: rest.categoryId ?? '',
      ingredients: rest.ingredients ?? [],
      createdBy: rest.createdBy ?? '',
      createdAt: createdAt ? new Date(createdAt) : (rest.createdAt ? new Date(rest.createdAt) : new Date())
    } as Recipe;
  }

  getRecipes(categoryId?: string): Observable<Recipe[]> {
    const params = categoryId ? { category: categoryId } : undefined;
    return this.http.get<any[]>(this.baseUrl, { params }).pipe(
      map(items => (items || []).map(i => this.normalizeRecipe(i))),
      catchError(err => {
        console.error('getRecipes error', err);
        return throwError(() => err);
      })
    );
  }

  getRecipeById(id: string): Observable<Recipe> {
    return this.http.get<any>(`${this.baseUrl}/${id}`).pipe(
      map(item => this.normalizeRecipe(item)),
      catchError(err => {
        console.error('getRecipeById error', err);
        return throwError(() => err);
      })
    );
  }

  createRecipe(data: Partial<Recipe>): Observable<Recipe> {
    return this.http.post<any>(this.baseUrl, data).pipe(
      map(item => this.normalizeRecipe(item)),
      catchError(err => {
        console.error('createRecipe error', err);
        return throwError(() => err);
      })
    );
  }

  updateRecipe(id: string, data: Partial<Recipe>): Observable<Recipe> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, data).pipe(
      map(item => this.normalizeRecipe(item)),
      catchError(err => {
        console.error('updateRecipe error', err);
        return throwError(() => err);
      })
    );
  }

  deleteRecipe(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      catchError(err => {
        console.error('deleteRecipe error', err);
        return throwError(() => err);
      })
    );
  }
}
