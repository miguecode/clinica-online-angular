import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { NgClass } from '@angular/common';
import { FirestoreUsuariosService } from '../../services/firestore-usuarios.service';
import { InicioComponent } from '../inicio/inicio.component';
import { Usuario } from '../../classes/usuario';
import { LoaderService } from '../../services/loader.service';
import { Especialista } from '../../classes/especialista';
import { Paciente } from '../../classes/paciente';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule, NgClass, InicioComponent, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  mensaje: string = 'Bienvenido, para iniciar sesión tenés que ingresar tus datos correctamente';
  error: boolean = false;
  usuarioIngresado: Usuario | Paciente | Especialista | undefined | null = undefined;
  form!: FormGroup;

  constructor(private authService: AuthService, private usuarioService: FirestoreUsuariosService,
    private router: Router, private fb: FormBuilder, private loader: LoaderService) {}


  // Función que se ejecuta al inicializar el componente, crea al formulario
  ngOnInit(): void {
    this.error = false;
    
    this.form = this.fb.group({
      correo: new FormControl(null, Validators.compose([Validators.required, Validators.email])),
      clave: new FormControl(null, Validators.compose([Validators.required, Validators.minLength(6)]))
    });
  }


  // Función que intenta realizar el logeo
  async ingresar() {
    try {
      this.loader.show();

      if (this.hasErrors()) { return };
      const datosIngresados = this.form.value;
      console.log(datosIngresados);
  
      await this.authService.login(datosIngresados.correo, datosIngresados.clave);
      console.log('Inicio de sesión exitoso');
      
      this.usuarioIngresado = await this.usuarioService.getUsuarioPorCorreo(datosIngresados.correo);

      console.log('El usuario que está por ser checkeado es: ');
      console.log(this.usuarioIngresado);

      if (!this.especialistaHabilitado()) {
        this.loader.hide();
        return; 
      };
      
      this.vaciarCampos();
      this.loader.hide();
      this.router.navigate(['/inicio']);
    } catch (error) {
      this.loader.hide();
      console.log('Error al iniciar sesión:', error);
      this.error = true;
      this.mensaje = 'No existe un usuario con ese correo y esa contraseña.';
    }
  }


  // Función que comprueba que haya errores o no
  private hasErrors(): boolean {
    this.form.markAllAsTouched();
    return this.form.invalid;
  }


  // Función que comprueba que si el usuario es Especialista, esté habilitado
  especialistaHabilitado() {
    if (!(this.usuarioIngresado instanceof Especialista)) { return true };
    // Si no es especialista, devuelvo true

    if (this.usuarioIngresado.estado === 'Habilitado') { return true };
    // Si es especialista y está habilitado, devuelvo tru

    console.log('Especialista no habilitado');
    this.error = true;
    this.mensaje = 'Para ingresar, un Administrador debe habilitar tu cuenta.';
    this.authService.logout();
    return false;
    // Si es especialista y no está habilitado, devuelvo false, muestro el error y deslogeo
  }


  // Función que vacía todos los inputs del formulario
  vaciarCampos(): void {
    this.error = false;
    this.form.value.correo = '';
    this.form.value.clave = '';
  }


  // Función que autocompleta los inputs del formulario
  autocompletarDatos(correo: string, clave: string) {
    this.form.setValue({ correo, clave });
  }
}