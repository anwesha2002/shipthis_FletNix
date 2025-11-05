import { Component, HostListener, OnInit  } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models';

@Component({
  selector: 'app-header',
  template: `
    <header class="fixed w-full z-50 transition-all duration-300" [class.bg-transparent]="isTop" [class.bg-[#141414]]="!isTop">
      <div class="netflix-gradient absolute inset-0 opacity-0 transition-opacity duration-300" [class.opacity-100]="!isTop"></div>
      <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="flex justify-between h-16">
          <div class="flex items-center space-x-8">
            <div class="flex-shrink-0 flex items-center">
              <a routerLink="/" class="text-3xl font-bold text-[#E50914] hover:text-[#B20710] transition-colors duration-200">
                FletNix
              </a>
            </div>
            <div class="hidden md:flex items-center space-x-6">
              <a routerLink="/" class="text-gray-300 hover:text-white transition-colors duration-200 text-sm font-medium">
                Home
              </a>
              <a routerLink="/shows" class="text-gray-300 hover:text-white transition-colors duration-200 text-sm font-medium">
                TV Shows
              </a>
              <a routerLink="/movies" class="text-gray-300 hover:text-white transition-colors duration-200 text-sm font-medium">
                Movies
              </a>
            </div>
          </div>

          <div class="flex items-center space-x-4">
            <ng-container *ngIf="currentUser$ | async as user; else loginButtons">
              <div class="relative group">
                <button class="flex items-center space-x-2 text-white focus:outline-none">
                  <div class="w-8 h-8 rounded-full bg-[#E50914] flex items-center justify-center text-white font-medium">
                    {{ user.email[0].toUpperCase() }}
                  </div>
                  <svg class="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div class="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-[#181818] ring-1 ring-black ring-opacity-5
                          opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div class="py-1">
                    <p class="px-4 py-2 text-sm text-gray-300 border-b border-gray-700">{{ user.email }}</p>
                    <button (click)="logout()"
                            class="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#2F2F2F] transition-colors duration-200">
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </ng-container>

            <ng-template #loginButtons>
              <div class="flex items-center space-x-4">
                <a routerLink="/login"
                   class="btn btn-primary text-sm font-medium">
                  Sign In
                </a>
                <a routerLink="/register"
                   class="btn btn-secondary text-sm font-medium">
                  Register
                </a>
              </div>
            </ng-template>
          </div>
        </div>
      </nav>
    </header>
  `
})
export class HeaderComponent implements OnInit {
  currentUser$: Observable<User | null>;
  isTop = true;
  private scrollThreshold = 50;
  private ticking = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit(): void {
    this.checkScrollPosition();
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    // Use requestAnimationFrame for better performance
    if (!this.ticking) {
      window.requestAnimationFrame(() => {
        this.checkScrollPosition();
        this.ticking = false;
      });
      this.ticking = true;
    }
  }

  private checkScrollPosition(): void {
    const scrollPosition = window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop || 0;

    this.isTop = scrollPosition < this.scrollThreshold;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}
