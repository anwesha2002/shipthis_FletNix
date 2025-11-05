import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, tap, map, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { PaginatedResponse, Show, ShowFilters } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) {}

  getShows(filters: ShowFilters): Observable<PaginatedResponse<Show>> {
    let params = new HttpParams()
      .set('page', filters.page.toString())
      .set('perPage', filters.perPage.toString());

    if (filters.titleSearch) {
      params = params.set('search', filters.titleSearch);
    }
    if (filters.castSearch) {
      params = params.set('cast', filters.castSearch);
    }
    if (filters.type) {
      const backendType = filters.type === 'movie' ? 'Movie' : 'TV Show';
      params = params.set('type', backendType);
    }

    return this.http.get<any>(`${environment.apiBaseUrl}/shows`, { params }).pipe(
      tap(response => {
        console.log('Raw API Response:', response);
        console.log('Filters sent:', filters);
        console.log('Params:', params.toString());
      }),
      map(response => {
        // Handle both array and paginated response formats
        const items = Array.isArray(response) ? response : (response.items || []);
        const totalItems = Array.isArray(response) ? response.length : (response.totalItems || response.total || items.length);

        return {
          items,
          totalItems,
          total: totalItems,
          page: filters.page,
          perPage: filters.perPage,
          totalPages: Math.ceil(totalItems / filters.perPage)
        };
      }),
      tap(transformed => {
        console.log('Transformed Response:', transformed);
      }),
      catchError(error => {
        console.error('Error fetching shows:', error);
        console.error('Error details:', error.error);
        return throwError(() => new Error('Failed to load shows. Please try again later.'));
      })
    );
  }

  getShow(show_id: string): Observable<Show> {
    return this.http.get<Show>(`${environment.apiBaseUrl}/shows/${show_id}`).pipe(
      catchError(error => {
        console.error('Error fetching show:', error);
        throw new Error(error.error?.message || 'Failed to load show details');
      }));
  }

  // Additional API methods can be added here as needed
}
