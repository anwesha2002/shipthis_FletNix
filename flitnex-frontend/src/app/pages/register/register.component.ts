import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { RegisterRequest } from '../../models';
import {error} from "@angular/compiler-cli/src/transformers/util";

@Component({
  selector: 'app-register',
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Create your account
          </h2>
        </div>
        <form class="mt-8 space-y-6" [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          <div class="rounded-md shadow-sm -space-y-px gap-2">
            <div class="mb-2">
              <label for="email" class="sr-only">Email address</label>
              <input
                id="email"
                type="email"
                formControlName="email"
                [class]="'form-input rounded-t-md w-full ' + (registerForm.get('email')?.touched && registerForm.get('email')?.invalid ? 'border-red-500' : '')"
                placeholder="Email address"
                class="mb-2"
              >
              <div *ngIf="registerForm.get('email')?.touched && registerForm.get('email')?.invalid" class="text-red-500 text-sm mt-1">
                <div *ngIf="registerForm.get('email')?.errors?.['required']">Email is required</div>
                <div *ngIf="registerForm.get('email')?.errors?.['email']">Please enter a valid email</div>
              </div>
            </div>
            <div class="mt-2">
              <label for="password" class="sr-only">Password</label>
              <input
                id="password"
                type="password"
                formControlName="password"
                [class]="'form-input w-full ' + (registerForm.get('password')?.touched && registerForm.get('password')?.invalid ? 'border-red-500' : '')"
                placeholder="Password"
              >
              <div *ngIf="registerForm.get('password')?.touched && registerForm.get('password')?.invalid" class="text-red-500 text-sm mt-1">
                <div *ngIf="registerForm.get('password')?.errors?.['required']">Password is required</div>
                <div *ngIf="registerForm.get('password')?.errors?.['minlength']">Password must be at least 6 characters</div>
              </div>
            </div>
            <div>
              <label for="age" class="sr-only">Age</label>
              <input
                id="age"
                type="number"
                formControlName="age"
                [class]="'form-input rounded-b-md w-full ' + (registerForm.get('age')?.touched && registerForm.get('age')?.invalid ? 'border-red-500' : '')"
                placeholder="Age"
                min="1"
                max="120"
              >
              <div *ngIf="registerForm.get('age')?.touched && registerForm.get('age')?.invalid" class="text-red-500 text-sm mt-1">
                <div *ngIf="registerForm.get('age')?.errors?.['required']">Age is required</div>
                <div *ngIf="registerForm.get('age')?.errors?.['min']">Age must be at least 1</div>
                <div *ngIf="registerForm.get('age')?.errors?.['max']">Age must be less than 120</div>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              class="btn btn-primary w-full"
              [disabled]=" isLoading"
            >
              {{ isLoading ? 'Creating account...' : 'Create account' }}
            </button>
          </div>
        </form>

        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?
          <a
            routerLink="/login"
            class="font-medium text-blue-600 hover:text-blue-500"
          >
            Sign in
          </a>
        </p>
      </div>
    </div>
  `
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      age: ['', [Validators.required, Validators.min(1), Validators.max(120)]]
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid && !this.isLoading) {
      console.log('Form submitted:', this.registerForm.value);
      this.isLoading = true;

      const registerData: RegisterRequest = {
        email: this.registerForm.get('email')?.value,
        password: this.registerForm.get('password')?.value,
        age: Number(this.registerForm.get('age')?.value)
      };

      this.authService.register(registerData)
        .subscribe({
          next: (user) => {
            console.log('Registration successful:', user);
            this.router.navigate(['/']);
          },
          error: (error) => {
            console.error('Registration failed:', error);
            this.isLoading = false;
            // You might want to show an error message to the user here
            alert('Registration failed: ' + (error.error.error || 'Please try again'));
          }
        });
    } else {
      // Mark all fields as touched to trigger validation display
      Object.keys(this.registerForm.controls).forEach(key => {
        const control = this.registerForm.get(key);
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
