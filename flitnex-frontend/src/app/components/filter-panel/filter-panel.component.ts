import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-filter-panel',
  template: `
    <div class="flex items-center space-x-4">
      <button
        class="filter-tag transition-all duration-200"
        [class.active]="selectedType === ''"
        (click)="setType('')"
      >
        All
      </button>
      <button
        class="filter-tag transition-all duration-200"
        [class.active]="selectedType === 'movie'"
        (click)="setType('movie')"
      >
        Movies
      </button>
      <button
        class="filter-tag transition-all duration-200"
        [class.active]="selectedType === 'tv'"
        (click)="setType('tv')"
      >
        TV Shows
      </button>
    </div>
  `
})
export class FilterPanelComponent {
  @Input() selectedType: '' | 'movie' | 'tv' = '';
  @Output() typeChange = new EventEmitter<'' | 'movie' | 'tv'>();

  setType(type: '' | 'movie' | 'tv'): void {
    this.typeChange.emit(type);
  }
}
