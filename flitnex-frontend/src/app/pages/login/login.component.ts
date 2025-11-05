import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Sign in to your account
          </h2>
        </div>
        <form class="mt-8 space-y-6" [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="rounded-md shadow-sm -space-y-px">
            <div class="mb-2">
              <label for="email" class="sr-only">Email address</label>
              <input
                id="email"
                type="email"
                formControlName="email"
                class="form-input rounded-t-md w-full"
                placeholder="Email address"
              >
            </div>
            <div >
              <label for="password" class="sr-only">Password</label>
              <input
                id="password"
                type="password"
                formControlName="password"
                class="form-input rounded-b-md w-full"
                placeholder="Password"
              >
            </div>
          </div>

          <div>
            <button
              type="submit"
              [disabled]=" isLoading"
              class="btn btn-primary w-full"
            >
              {{ isLoading ? 'Signing in...' : 'Sign in' }}
            </button>
          </div>
        </form>

        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?
          <a
            routerLink="/register"
            class="font-medium text-blue-600 hover:text-blue-500"
          >
            Register now
          </a>
        </p>
      </div>
    </div>
  `
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid && !this.isLoading) {
      this.isLoading = true;
      this.authService.login(this.loginForm.value)
        .subscribe({
          next: () => {
            this.router.navigate(['/']);
          },
          error: (error) => {
            this.isLoading = false;
            console.error('Login failed:', error);
            // You might want to show an error message to the user here
            alert('Login failed: ' + (error.error.error || 'Please try again'));
          }
        });
    }else{
      Object.keys(this.loginForm.controls).forEach(key => {
        const control = this.loginForm.get(key);
        control?.markAsTouched();
        if (control?.errors) {
          console.log(`${key} validation errors:`, control.errors);
          let errorMessage = `${key.charAt(0).toUpperCase() + key.slice(1)} is invalid: `;
          if (control.errors['required']) {
            errorMessage += 'This field is required.';
          } else if (control.errors['email']) {
            errorMessage += 'Please enter a valid email address.';
          } else if (control.errors['minlength']) {
            errorMessage += `Minimum length is ${control.errors['minlength'].requiredLength} characters.`;
          } else if (control.errors['min']) {
            errorMessage += `Minimum value is ${control.errors['min'].min}.`;
          } else if (control.errors['max']) {
            errorMessage += `Maximum value is ${control.errors['max'].max}.`;
          }
          alert(errorMessage);
        }
      });
    }
  }
}
