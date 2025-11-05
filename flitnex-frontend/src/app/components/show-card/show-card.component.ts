import { Component, Input } from '@angular/core';
import { Show } from '../../models';
import { User } from '../../models';
import {Observable} from "rxjs";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-show-card',
  template: `
    <div class="title-card group ">
      <div class="relative aspect-[2/3] bg-[#181818] p-4 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
        <!-- Thumbnail/Placeholder -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
          <div class="absolute inset-0 flex items-center justify-center">
            <span class="text-6xl font-bold text-white/10">{{ show.title[0] }}</span>
          </div>
        </div>

        <!-- Title Info Overlay -->
        <div class="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black via-black/50 to-transparent  group-hover:opacity-100 transition-opacity duration-300">
          <div class="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 m-4 gap-4">
            <h3 class="text-lg font-bold text-white mb-1">{{ show.title }}</h3>

            <div class="flex items-center space-x-2 text-sm text-gray-300 mb-2">
              <span class="px-2 py-1 bg-[#E50914] rounded text-white"
                    [class.animate-pulse]="isRestricted">
                {{ show.rating }}
              </span>
              <span>{{ show.release_year }}</span>
              <span>·</span>
              <span class="capitalize">{{ show.type }}</span>
            </div>

            <p class="text-sm text-gray-300 line-clamp-3 mb-4">{{ show.description }}</p>

            <!-- Age restriction warning -->
            <div *ngIf="isRestricted" class="mb-4">
              <p class="text-sm text-[#E50914] font-medium flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                18+ Only
              </p>
            </div>

            <!-- Action buttons -->
            <div class="flex items-center space-x-2">
              <a *ngIf="canView" [routerLink]="['/shows', show.show_id]"
                 class="flex-1 btn btn-primary py-2 text-sm font-medium text-center"
                 [class.opacity-50]="!canView"
                 [class.cursor-not-allowed]="!canView">
                {{ canView ? 'View Details' : 'Age Restricted' }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ShowCardComponent {
  @Input() show!: Show;
  @Input() userAge: number = 0;

  currentUser$: Observable<User | null>;

  constructor(
    private authService: AuthService,
    // private router: Router
  ) {
    this.currentUser$ = this.authService.currentUser$;
  }

  get isRestricted(): boolean {
    if (this.show.rating === 'R' || this.show.rating === 'TV-MA') {
      return this.userAge < 18;
    }
    return false;
  }

  get canView(): boolean {
    return !this.isRestricted || this.userAge >= 18;
  }
}
