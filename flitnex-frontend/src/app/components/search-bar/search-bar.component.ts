import {Component, EventEmitter, Input, Output, SimpleChanges} from '@angular/core';
import {Subject, takeUntil} from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-search-bar',
  template: `
    <div class="space-y-4">
      <div class="flex space-x-4">
        <!-- Title search -->
        <div class="relative flex-1">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            class="form-input pl-10 w-full bg-[#141414] border border-gray-600 focus:border-[#E50914] text-white placeholder-gray-400
                   rounded-md transition duration-200 hover:border-gray-500"
            placeholder="Search titles..."
            [value]="titleQuery"
            (input)="onTitleInput($event)"
          />
          <div *ngIf="titleQuery"
               class="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
               (click)="clearTitleSearch()">
            <svg class="w-5 h-5 text-gray-400 hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        </div>

        <!-- Cast search -->
        <div class="relative flex-1">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <input
            type="text"
            class="form-input pl-10 w-full bg-[#141414] border border-gray-600 focus:border-[#E50914] text-white placeholder-gray-400
                   rounded-md transition duration-200 hover:border-gray-500"
            placeholder="Search cast..."
            [value]="castQuery"
            (input)="onCastInput($event)"
          />
          <div *ngIf="castQuery"
               class="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
               (click)="clearCastSearch()">
            <svg class="w-5 h-5 text-gray-400 hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SearchBarComponent {
  @Input() initialTitleSearch: string = '';
  @Input() initialCastSearch: string = '';
  @Output() search = new EventEmitter<{ title: string; cast: string }>();

  private titleSearchSubject = new Subject<string>();
  private castSearchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  titleQuery = '';
  castQuery = '';

  constructor() {
    // Set up debounced search for title
    this.titleSearchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(query => {
      this.titleQuery = query;
      this.emitSearch();
    });

    // Set up debounced search for cast
    this.castSearchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(query => {
      this.castQuery = query;
      this.emitSearch();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialTitleSearch']) {
      this.titleQuery = this.initialTitleSearch || '';
    }
    if (changes['initialCastSearch']) {
      this.castQuery = this.initialCastSearch || '';
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  clearTitleSearch(): void {
    this.titleQuery = '';
    this.titleSearchSubject.next('');
  }

  clearCastSearch(): void {
    this.castQuery = '';
    this.castSearchSubject.next('');
  }

  clearAllSearches(): void {
    this.titleQuery = '';
    this.castQuery = '';
    this.titleSearchSubject.next('');
    this.castSearchSubject.next('');
  }

  // Method to set values from parent (e.g., from URL query params)
  setSearchValues(title: string, cast: string): void {
    this.titleQuery = title || '';
    this.castQuery = cast || '';
  }

  onTitleInput(event: Event): void {
    const query = (event.target as HTMLInputElement).value;
    this.titleSearchSubject.next(query);
  }

  onCastInput(event: Event): void {
    const query = (event.target as HTMLInputElement).value;
    this.castSearchSubject.next(query);
  }

  private emitSearch(): void {
    this.search.emit({
      title: this.titleQuery,
      cast: this.castQuery
    });
  }
}
