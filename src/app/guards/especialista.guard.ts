import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FirestoreUsuariosService } from '../services/firestore-usuarios.service';

export const especialistaGuard: CanActivateFn = async (route, state) => {
  const authService: AuthService = inject(AuthService);
  const usuariosService: FirestoreUsuariosService = inject(FirestoreUsuariosService);
  const router: Router = inject(Router);

  const email = authService.getCurrentUserEmail();

  if (!email) {
    return false;
  }

  const usuario = await usuariosService.getUsuarioPorCorreo(email);

  if (usuario?.perfil !== 'Especialista') {
    router.navigate(['/inicio']);
    console.log('El usuario no es Especialista. Redirección a Inicio');
  }

  return usuario?.perfil === 'Especialista';
};
