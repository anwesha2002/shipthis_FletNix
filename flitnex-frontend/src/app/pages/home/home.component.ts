import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, switchMap, tap, catchError } from 'rxjs/operators';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Show, ShowFilters, User, PaginatedResponse } from '../../models';

@Component({
  selector: 'app-home',
  template: `
    <div class="min-h-screen bg-[#141414] pt-16">
      <!-- Hero Section -->
      <div class="relative h-[70vh] mb-8">
        <div class="absolute inset-0 bg-[url('/assets/hero-bg.jpg')] bg-cover bg-center">
          <div class="absolute inset-0 netflix-gradient"></div>
        </div>
        <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center ">
          <div class="text-white max-w-2xl">
            <h1 class="text-5xl font-bold mb-4">Welcome to FletNix</h1>
            <p class="text-xl text-gray-300 mb-8">Discover your next favorite show or movie</p>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Search and Filters -->
        <div class="search-container mb-8 rounded-lg">
          <div class="flex flex-col md:flex-row md:items-center md:space-x-6">
            <div class="flex-1 mb-4 md:mb-0">
              <app-search-bar
                [initialTitleSearch]="filters.titleSearch"
                [initialCastSearch]="filters.castSearch"
                (search)="onSearch($event)"
              ></app-search-bar>
            </div>
            <div class="flex-none">
              <app-filter-panel
                [selectedType]="filters.type || ''"
                (typeChange)="handleTypeChange($event)"
              ></app-filter-panel>
            </div>
          </div>
        </div>

        <ng-container *ngIf="shows$ | async as shows; else loadingTpl">
          <!-- Loading state -->
          <div *ngIf="loading" class="flex justify-center items-center py-12">
            <div class="animate-pulse">
              <svg class="w-12 h-12 text-[#E50914]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          </div>

          <!-- No results state -->
          <div *ngIf="!loading && (!shows.items || shows.items.length === 0)" class="text-center py-12">
              <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" stroke="currentColor" fill="none" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            <h3 class="text-xl font-medium text-gray-400 mb-2">No shows found</h3>
            <p class="text-gray-500">Try adjusting your search or filters</p>
          </div>

          <!-- Grid of shows -->
          <div *ngIf="!loading && shows.items && shows.items.length > 0"
               class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 min-h-[300px]">
            <app-show-card
              *ngFor="let show of shows.items"
              [show]="show"
              [userAge]="(currentUser$ | async)?.age || 0"
              class="transform transition-transform duration-200 hover:scale-105"
            ></app-show-card>
          </div>


          <!-- Pagination -->
          <div class="mt-8 flex justify-center">
            <app-pagination
              *ngIf="(shows.items?.length ?? 0) > 0"
              [currentPage]="shows.page"
              [perPage]="shows.perPage"
              [total]="shows.total"
              [totalPages]="shows.totalPages"
              (pageChange)="onPageChange($event)"
            ></app-pagination>
          </div>
        </ng-container>

        <ng-template #loadingTpl>
          <div class="flex items-center justify-center min-h-[300px]">
            <div class="animate-pulse">
              <svg class="w-12 h-12 text-[#E50914]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          </div>
        </ng-template>
      </main>
    </div>
  `
})

export class HomeComponent implements OnInit {
  shows$!: Observable<PaginatedResponse<Show>>;
  currentUser$: Observable<User | null>;
  filters: ShowFilters = {
    page: 1,
    perPage: 15,
    titleSearch: '',
    castSearch: '',
    type: ''
  };
  loading = false;

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit(): void {
    this.shows$ = this.route.queryParams.pipe(
      tap(() => this.loading = true),
      map(params => {
        const type = params['type'];
        const filters: ShowFilters = {
          page: Number(params['page']) || 1,
          perPage: 15,
          titleSearch: params['titleSearch'] || '',
          castSearch: params['castSearch'] || '',
          type: (type === 'movie' || type === 'tv' ? type : '') as '' | 'movie' | 'tv'
        };
        return filters;
      }),
      tap(filters => {
        console.log('Using filters:', filters);
        this.filters = filters;
      }),
      switchMap(filters => this.apiService.getShows(filters).pipe(
        catchError(error => {
          console.error('Error in home component:', error);
          return of({
            items: [],
            totalItems: 0,
            total: 0,
            page: 1,
            perPage: 15,
            totalPages: 0
          });
        })
      )),
      tap(response => {
        console.log('Component received response:', response);
        this.loading = false;
      })
    );
  }

  onSearch(query: { title: string; cast: string }): void {
    this.updateRouteParams({
      titleSearch: query.title,
      castSearch: query.cast,
      page: 1
    });
  }

  onTypeChange(type: '' | 'movie' | 'tv'): void {
    this.updateRouteParams({ type, page: 1 });
  }

  onPageChange(page: number): void {
    this.updateRouteParams({ page });
  }

  handleTypeChange(value: string): void {
    if (value === '' || value === 'movie' || value === 'tv') {
      this.onTypeChange(value as '' | 'movie' | 'tv');
    }
  }

  private updateRouteParams(params: Partial<ShowFilters>): void {
    const currentParams = this.route.snapshot.queryParams;
    const queryParams: any = { ...currentParams, ...params };

    // Only include defined values
    if ('page' in params) queryParams['page'] = params.page;
    if ('perPage' in params) queryParams['perPage'] = params.perPage;
    if ('titleSearch' in params) queryParams['titleSearch'] = params.titleSearch;
    if ('castSearch' in params) queryParams['castSearch'] = params.castSearch;
    if ('type' in params) queryParams['type'] = params.type;

    // Clean up undefined values
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value === undefined || value === '') {
        delete queryParams[key as keyof ShowFilters];
      }
    });

    // Remove null values
    Object.keys(queryParams).forEach(key => {
      const value = queryParams[key];
      if (value === null || value === undefined || value === '' ||
        (typeof value === 'string' && value.trim() === '')) {
        delete queryParams[key];
      }
    });

    console.log('Updating route with params:', queryParams);

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: '',
      replaceUrl: true
    });
  }
}
