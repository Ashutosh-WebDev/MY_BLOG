import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard = () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if (!authService.isAdmin()) {
    console.error('Access denied: User is not an admin');
    router.navigate(['/admin/login']);
    return false;
  }

  return true;
};
