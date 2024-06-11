import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LoaderService } from '../services/loader.service';
import { FirestoreUsuariosService } from '../services/firestore-usuarios.service';
import { inject } from '@angular/core';

export const noLoginSiAdminGuard: CanActivateFn = async (route, state) => {
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);
  const loaderService: LoaderService = inject(LoaderService);
  const usuarioService: FirestoreUsuariosService = inject(FirestoreUsuariosService);

  loaderService.show();

  // Espero a checkear el estado de logeo
  await new Promise(resolve => setTimeout(resolve, 1000));

  const isLoggedIn = authService.isLoggedIn;
  console.log(`noLoginGuard: El estado del logeo es: ${isLoggedIn}`);

  if (isLoggedIn) {
    const correo = authService.getCurrentUserEmail();
    if (correo) {
      const usuario = await usuarioService.getUsuarioPorCorreo(correo);
      if (usuario && usuario.perfil === 'Administrador') {
        loaderService.hide();
        console.log('Acceso permitido, el usuario es Administrador');
        return true; // Permito el acceso si el usuario es administrador
      }
    }
    router.navigate(['/inicio']);
    console.log('Usuario ya autenticado. Redirección a Inicio');
    loaderService.hide();
    return false;
  }
  
  loaderService.hide();
  return true; // Permitir acceso si no está autenticado
};
