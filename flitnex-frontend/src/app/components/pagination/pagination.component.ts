import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  template: `
    <div class="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 sm:px-6">
      <div class="flex flex-1 justify-between sm:hidden">
        <!-- Mobile pagination -->
        <button
          [disabled]="currentPage === 1"
          (click)="pageChange.emit(currentPage - 1)"
          class="btn btn-primary"
          [class.opacity-50]="currentPage === 1"
        >
          Previous
        </button>
        <button
          [disabled]="currentPage === totalPages"
          (click)="pageChange.emit(currentPage + 1)"
          class="btn btn-primary"
          [class.opacity-50]="currentPage === totalPages"
        >
          Next
        </button>
      </div>

      <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <!-- Results info -->
        <div>
          <p class="text-sm text-gray-700 dark:text-gray-300">
            Showing
            <span class="font-medium">{{ (currentPage - 1) * perPage + 1 }}</span>
            to
            <span class="font-medium">{{  min(currentPage * perPage, total)  }}</span>
            of
            <span class="font-medium">{{ total }}</span>
            results
          </p>
        </div>

        <!-- Desktop pagination -->
        <div>
          <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <button
              (click)="pageChange.emit(1)"
              [disabled]="currentPage === 1"
              class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              [class.opacity-50]="currentPage === 1"
            >
              <span class="sr-only">First</span>
              «
            </button>

            <button
              (click)="pageChange.emit(currentPage - 1)"
              [disabled]="currentPage === 1"
              class="relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              [class.opacity-50]="currentPage === 1"
            >
              <span class="sr-only">Previous</span>
              ‹
            </button>

            <ng-container *ngFor="let page of getPageNumbers()">
              <button
                (click)="pageChange.emit(page)"
                [class.bg-blue-50]="page === currentPage"
                [class.text-blue-600]="page === currentPage"
                [class.font-semibold]="page === currentPage"
                class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              >
                {{ page }}
              </button>
            </ng-container>

            <button
              (click)="pageChange.emit(currentPage + 1)"
              [disabled]="currentPage === totalPages"
              class="relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              [class.opacity-50]="currentPage === totalPages"
            >
              <span class="sr-only">Next</span>
              ›
            </button>

            <button
              (click)="pageChange.emit(totalPages)"
              [disabled]="currentPage === totalPages"
              class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              [class.opacity-50]="currentPage === totalPages"
            >
              <span class="sr-only">Last</span>
              »
            </button>
          </nav>
        </div>
      </div>
    </div>
  `
})
export class PaginationComponent {
  @Input() currentPage: number = 1;
  @Input() perPage: number = 15;
  @Input() total: number = 0;
  @Input() totalPages: number = 1;
  @Output() pageChange = new EventEmitter<number>();

  min(a: number, b: number): number {
    return Math.min(a, b);
  }

  getStartItem(): number {
    if (!this.total || this.total === 0) return 0;
    return (this.currentPage - 1) * this.perPage + 1;
  }

  getEndItem(): number {
    if (!this.total || this.total === 0) return 0;
    return Math.min(this.currentPage * this.perPage, this.total);
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }
}
