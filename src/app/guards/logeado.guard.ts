import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const logeadoGuard: CanActivateFn = (route, state) => {
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);

  console.log(`LogeadoGuard: El estado del logeo es: ${authService.isLoggedIn}`);

  if (!authService.isLoggedIn) {
    router.navigate(['/login']);
    console.log('Usuario no autenticado. Redirección a Login');
  }

  return authService.isLoggedIn;
};