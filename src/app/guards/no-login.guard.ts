import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LoaderService } from '../services/loader.service';
import { inject } from '@angular/core';

export const noLoginGuard: CanActivateFn = (route, state) => {
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);
  const loaderService: LoaderService = inject(LoaderService);

  loaderService.show();

  authService.user$.subscribe(async isLoggedIn => {
    isLoggedIn = isLoggedIn;
    console.log(`noLoginGuard: El estado del logeo es: ${authService.isLoggedIn}`);
  });

  setTimeout(() => {
    if (authService.isLoggedIn) {
      router.navigate(['/inicio']);
      console.log('Usuario ya autenticado. Redirección a Inicio');
    }
    loaderService.hide();
  }, 1500);
  
  return !authService.isLoggedIn;
};
