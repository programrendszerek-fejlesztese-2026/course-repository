import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Rating } from '../in-memory/models';

@Injectable({
  providedIn: 'root'
})
export class RatingService {
  private baseUrl = `${environment.apiUrl}/ratings`;

  constructor(private http: HttpClient) {}

  private normalizeRating(obj: any): Rating {
    const { _id, createdAt, ...rest } = obj || {};
    return {
      id: _id ?? rest.id,
      userId: rest.userId ?? '',
      recipeId: rest.recipeId ?? '',
      score: rest.score ?? 0,
      comment: rest.comment ?? undefined,
      createdAt: createdAt ? new Date(createdAt) : (rest.createdAt ? new Date(rest.createdAt) : new Date())
    } as Rating;
  }

  getRatings(): Observable<Rating[]> {
    return this.http.get<any[]>(this.baseUrl).pipe(
      map(items => (items || []).map(i => this.normalizeRating(i))),
      catchError(err => {
        console.error('getRatings error', err);
        return throwError(() => err);
      })
    );
  }

  getRatingById(id: string): Observable<Rating> {
    return this.http.get<any>(`${this.baseUrl}/${id}`).pipe(
      map(item => this.normalizeRating(item)),
      catchError(err => {
        console.error('getRatingById error', err);
        return throwError(() => err);
      })
    );
  }

  createRating(data: { recipeId: string; score: number; comment?: string }): Observable<Rating> {
    // Do not send userId; server will extract from JWT
    return this.http.post<any>(this.baseUrl, data).pipe(
      map(item => this.normalizeRating(item)),
      catchError(err => {
        console.error('createRating error', err);
        return throwError(() => err);
      })
    );
  }

  updateRating(id: string, data: Partial<Rating>): Observable<Rating> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, data).pipe(
      map(item => this.normalizeRating(item)),
      catchError(err => {
        console.error('updateRating error', err);
        return throwError(() => err);
      })
    );
  }

  deleteRating(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      catchError(err => {
        console.error('deleteRating error', err);
        return throwError(() => err);
      })
    );
  }

  getRatingsByRecipe(recipeId: string): Observable<Rating[]> {
    return this.getRatings().pipe(
      map(list => (list || []).filter(r => r.recipeId === recipeId)),
      catchError(err => {
        console.error('getRatingsByRecipe error', err);
        return throwError(() => err);
      })
    );
  }
}
