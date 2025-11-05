import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable, catchError, EMPTY , map  } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { ApiService } from '../../services/api.service';
import { Show } from '../../models';

@Component({
  selector: 'app-show-detail',
  template: `
    <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div class="py-10">
        <main>
          <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="px-4 py-8 sm:px-0">
              <!-- Back button -->
              <button
                (click)="goBack()"
                class="mb-6 btn btn-primary"
              >
                Back to List
              </button>

              <!-- Loading state -->
              <div *ngIf="loading" class="flex justify-center items-center h-64">
                <div class="text-xl text-gray-600 dark:text-gray-400">Loading...</div>
              </div>

              <!-- Error state -->
              <div *ngIf="error" class="bg-red-50 dark:bg-red-900 p-4 rounded-lg mb-6">
                <p class="text-red-700 dark:text-red-100">{{ error }}</p>
              </div>

              <!-- Show data -->
              <ng-container *ngIf="show$ | async as show">

                <!-- Show details -->
                <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
                  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <!-- Image -->
                    <div class="lg:col-span-1">
                      <div class="w-full h-full bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                        <span class="text-9xl text-gray-400">{{ show && show.title[0] }}</span>
                      </div>
                    </div>

                    <!-- Details -->
                    <div class="lg:col-span-2 p-6">
                      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
                        {{ show.title }}
                      </h1>

                      <div class="mt-4 space-y-4">
                        <p class="text-gray-600 dark:text-gray-300">
                          {{ show.description }}
                        </p>

                        <div class="grid grid-cols-2 gap-4">
                          <div>
                            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">
                              Type
                            </h3>
                            <p class="mt-1 text-gray-900 dark:text-white">
                              {{ show.type === 'movie' ? 'Movie' : 'TV Show' }}
                            </p>
                          </div>

                          <div>
                            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">
                              Release Year
                            </h3>
                            <p class="mt-1 text-gray-900 dark:text-white">
                              {{ show?.release_year }}
                            </p>
                          </div>

                          <div>
                            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">
                              Rating
                            </h3>
                            <p class="mt-1 text-gray-900 dark:text-white">
                              {{ show.rating }}
                            </p>
                          </div>

                          <div>
                            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">
                              Duration
                            </h3>
                            <p class="mt-1 text-gray-900 dark:text-white">
                              {{ show.duration }}
                            </p>
                          </div>
                        </div>

                        <div>
                          <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Director
                          </h3>
                          <p class="mt-1 text-gray-900 dark:text-white">
                            {{ show.director }}
                          </p>
                        </div>

                        <div>
                          <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Cast
                          </h3>
                          <p class="mt-1 text-gray-900 dark:text-white">
                            {{ show?.cast?.join(', ') }}
                          </p>
                        </div>

                        <div>
                          <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Genres
                          </h3>
                          <div class="mt-1 flex flex-wrap gap-2">
                            <span
                              *ngFor="let genre of show.listed_in"
                              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100"
                            >
                              {{ genre }}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ng-container>
            </div>
          </div>
        </main>
      </div>
    </div>
  `
})
export class ShowDetailComponent implements OnInit {
  show$!: Observable<Show>;
  loading = false;
  error: string | null = null;

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.show$ = this.route.params.pipe(
      tap((params: Params) => {
        console.log('Route params:', params);
        this.loading = true;
        this.error = null;
      }),
      switchMap((params: Params) => {
        if (!params['show_id']) {
          this.loading = false;
          this.error = 'No show ID provided';
          return EMPTY;
        }
        console.log('Fetching show with ID:', params['show_id']);
        return this.apiService.getShow(params['show_id']);
      }),
      map((response: any) => response.show),  // Extract the nested 'show' object
      tap((show: Show) => {
        console.log('Show data extracted:', show);
        this.loading = false;
      }),
      catchError(err => {
        console.error('Error loading show:', err);
        this.loading = false;
        this.error = err.message || 'Failed to load show details';
        return EMPTY;
      })
    );
  }

  goBack(): void {
    window.history.back();
  }
}
