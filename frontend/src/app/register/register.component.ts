import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="register-container">
      <div class="register-form">
        <h2>Create Admin Account</h2>
        <div class="form-group">
          <input type="email" [(ngModel)]="email" placeholder="Email" class="form-control">
        </div>
        <div class="form-group">
          <input type="password" [(ngModel)]="password" placeholder="Password" class="form-control">
        </div>
        <div class="form-group">
          <input type="password" [(ngModel)]="secretKey" placeholder="Secret Key" class="form-control">
        </div>
        <button (click)="register()" [disabled]="isLoading">
          {{ isLoading ? 'Creating...' : 'Create Account' }}
        </button>
        <div class="error" *ngIf="error">{{ error }}</div>
      </div>
    </div>
  `,
  styles: [`
    .register-container {
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f5f5f5;
    }
    .register-form {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      width: 100%;
      max-width: 400px;
    }
    h2 {
      margin-bottom: 2rem;
      text-align: center;
      color: #333;
    }
    .form-group {
      margin-bottom: 1rem;
    }
    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }
    button {
      width: 100%;
      padding: 0.75rem;
      background: #333;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      transition: background 0.3s;
    }
    button:hover:not(:disabled) {
      background: #555;
    }
    button:disabled {
      background: #999;
      cursor: not-allowed;
    }
    .error {
      color: #dc3545;
      margin-top: 1rem;
      text-align: center;
    }
  `]
})
export class RegisterComponent {
  email = '';
  password = '';
  secretKey = '';
  isLoading = false;
  error = '';

  constructor(private http: HttpClient, private router: Router) {}

  register() {
    if (!this.email || !this.password || !this.secretKey) {
      this.error = 'All fields are required';
      return;
    }

    this.isLoading = true;
    this.error = '';

    this.http.post('http://localhost:5000/api/auth/register', {
      email: this.email,
      password: this.password,
      secretKey: this.secretKey
    }).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        this.router.navigate(['/admin/login']);
      },
      error: (error) => {
        this.isLoading = false;
        this.error = error.error.message || 'Registration failed';
      }
    });
  }
}