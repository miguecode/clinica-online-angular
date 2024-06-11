import { Injectable } from '@angular/core';
import { 
  Auth, 
  UserCredential, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendEmailVerification, 
  getAuth,
  updateCurrentUser
} from '@angular/fire/auth';
import 'firebase/auth';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$!: Observable<boolean>;
  private userSubject: BehaviorSubject<boolean>;

  constructor(private firebaseAuth: Auth) {
    this.userSubject = new BehaviorSubject<boolean>(false);
    this.user$ = this.userSubject.asObservable();
    this.checkAuthState();
  }

  // Variable para indicar si el usuario está logueado
  get isLoggedIn(): boolean {
    return this.userSubject.value;
  }

  // Registrar un nuevo usuario y enviar correo de verificación
  async register(email: string, password: string): Promise<UserCredential> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.firebaseAuth, email.toLocaleLowerCase(), password);
      await this.enviarConfirmacion();
      this.userSubject.next(false); // No cambiar el estado a true
      await this.logout(); // Desloguear al usuario inmediatamente después del registro
      return userCredential;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Registrar un nuevo usuario y enviar correo de verificación, pero manteniendo la sesión iniciada
  async createUserWithoutLogin(email: string, password: string): Promise<void> {
    const usuarioOriginal = this.firebaseAuth.currentUser;
    try {
      await createUserWithEmailAndPassword(this.firebaseAuth, email.toLowerCase(), password);
      await this.enviarConfirmacion();

      // Restauro el usuario original después de crear el nuevo usuario
      const auth = getAuth();
      await updateCurrentUser(auth, usuarioOriginal);
    } catch (error) {
      this.handleError(error);
    }
  }

  // Enviar correo de verificación
  async enviarConfirmacion(): Promise<void> {
    try {
      const user = this.firebaseAuth.currentUser;
      if (user) {
        await sendEmailVerification(user);
        console.log('Correo de verificación enviado');
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  // Iniciar sesión del usuario
  async login(email: string, password: string): Promise<UserCredential> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.firebaseAuth, email, password);
      const user = userCredential.user;
      
      if (user.emailVerified) {
        this.userSubject.next(true);
      } else {
        this.userSubject.next(false);
        console.error('El correo electrónico no ha sido verificado');
        throw new Error('El correo electrónico no ha sido verificado');
      }
      
      return userCredential;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Cerrar sesión del usuario
  async logout(): Promise<void> {
    try {
      await signOut(this.firebaseAuth);
      this.userSubject.next(false);
      console.log("Login - User:", this.firebaseAuth.currentUser);
    } catch (error) {
      this.handleError(error);
    }
  }


  // Obtener el correo electrónico del usuario actual
  getCurrentUserEmail(): string | null | undefined {
    return this.firebaseAuth.currentUser?.email;
  }

  // Verificar el estado de autenticación del usuario
  private checkAuthState(): void {
    this.firebaseAuth.onAuthStateChanged(user => {
      this.userSubject.next(!!user);
    });
  }

  // Manejar errores
  private handleError(error: any): never {
    console.error('Error en AuthService:', error);
    throw error; // Re-lanzar el error para que pueda ser manejado externamente si es necesario
  }
}