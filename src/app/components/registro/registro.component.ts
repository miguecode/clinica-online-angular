import { Component, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { FirestoreUsuariosService } from '../../services/firestore-usuarios.service';
import { StorageService } from '../../services/storage.service';
import { Usuario } from '../../classes/usuario';
import { Paciente } from '../../classes/paciente';
import { Especialista } from '../../classes/especialista';
import { InicioComponent } from '../inicio/inicio.component';
import { CommonModule, NgClass } from '@angular/common';
import { LoaderService } from '../../services/loader.service';
import { MensajeConfirmacionComponent } from '../mensaje-confirmacion/mensaje-confirmacion.component';
import { Administrador } from '../../classes/administrador';
import { EspecialidadesService } from '../../services/especialidades.service';
import { EspecialidadesComponent } from '../especialidades/especialidades.component';
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [
    FormsModule,
    RouterModule,
    NgClass,
    InicioComponent,
    ReactiveFormsModule,
    CommonModule,
    MensajeConfirmacionComponent,
    EspecialidadesComponent,
    RecaptchaModule,
    RecaptchaFormsModule,
  ],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
})
export class RegistroComponent implements OnInit {
  mensaje: string =
    'Bienvenido, para completar el registro hay que rellenar todos los datos.';
  error: boolean = false;
  formPaciente!: FormGroup;
  formEspecialista!: FormGroup;
  formAdministrador!: FormGroup;
  formActivo: string = 'Paciente';
  mostrarConfirmacion: boolean = false;
  usuarioActual: Usuario | Paciente | Especialista | Administrador | undefined;
  especialidades: string[] = [];
  mostrarEspecialidades: boolean = false;
  especialidadesSeleccionadas: string[] = [];
  captchaResolved: boolean = false;

  constructor(
    private authService: AuthService,
    private usuarioService: FirestoreUsuariosService,
    private fb: FormBuilder,
    private storageService: StorageService,
    private loader: LoaderService,
    private especialidadesService: EspecialidadesService
  ) {}

  // Inicializo los formularios al iniciar el componente
  ngOnInit(): void {
    this.getUsuarioActual();
    this.cargarEspecialidades();

    this.formActivo = 'Paciente';
    this.error = false;

    this.formPaciente = this.fb.group({
      correo: new FormControl(null, [Validators.required, Validators.email]),
      clave: new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
      ]),
      nombre: new FormControl(null, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(20),
        this.palabraValidator(),
      ]),
      apellido: new FormControl(null, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(20),
        this.palabraValidator(),
      ]),
      edad: new FormControl(null, [
        Validators.required,
        Validators.min(1),
        Validators.max(120),
      ]),
      dni: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^\d+$/),
        Validators.minLength(7),
        Validators.maxLength(9),
      ]),
      obraSocial: new FormControl(null, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(20),
        this.palabraValidator(),
      ]),
      imagenUno: new FormControl(null, Validators.required),
      imagenDos: new FormControl(null, Validators.required),
    });

    this.formEspecialista = this.fb.group({
      correo: new FormControl(null, [Validators.required, Validators.email]),
      clave: new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
      ]),
      nombre: new FormControl(null, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(20),
        this.palabraValidator(),
      ]),
      apellido: new FormControl(null, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(20),
        this.palabraValidator(),
      ]),
      edad: new FormControl(null, [
        Validators.required,
        Validators.min(20),
        Validators.max(120),
      ]),
      dni: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^\d+$/),
        Validators.minLength(7),
        Validators.maxLength(9),
      ]),
      // especialidad: new FormControl(null, [Validators.required, Validators.minLength(2), Validators.maxLength(20), this.palabraValidator()]),
      especialidades: new FormControl([], [Validators.required]),
      imagen: new FormControl(null, Validators.required),
    });

    this.formAdministrador = this.fb.group({
      correo: new FormControl(null, [Validators.required, Validators.email]),
      clave: new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
      ]),
      nombre: new FormControl(null, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(20),
        this.palabraValidator(),
      ]),
      apellido: new FormControl(null, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(20),
        this.palabraValidator(),
      ]),
      edad: new FormControl(null, [
        Validators.required,
        Validators.min(20),
        Validators.max(120),
      ]),
      dni: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^\d+$/),
        Validators.minLength(7),
        Validators.maxLength(9),
      ]),
      imagenAdmin: new FormControl(null, Validators.required),
    });
  }

  async getUsuarioActual() {
    this.loader.show();
    try {
      const correo = this.authService.getCurrentUserEmail();
      if (correo) {
        this.usuarioActual = await this.usuarioService.getUsuarioPorCorreo(
          correo
        );
      }
    } catch (error) {
      console.error('Error obteniendo usuario:', error);
    } finally {
      this.loader.hide();
    }
  }

  //Función que carga la lista de especialidades (array de strings)
  async cargarEspecialidades() {
    this.especialidades =
      await this.especialidadesService.getEspecialidadesNombres();
  }

  // Validador personalizado para el nombre, apellido, especialidad y obra social
  palabraValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const valid =
        /^[a-zA-ZáéíóúÁÉÍÓÚñÑ'’-]+( [a-zA-ZáéíóúÁÉÍÓÚñÑ'’-]+)*$/.test(
          control.value
        );
      return valid ? null : { invalidName: true };
    };
  }

  // Función de registrar un nuevo usuario
  async registrar() {
    if (!this.captchaResolved) {
      console.error('El captcha no está resuelto');
      return;
    }

    try {
      let form = null;
      if (this.formActivo === 'Paciente') {
        form = this.formPaciente;
      } else if (this.formActivo === 'Especialista') {
        form = this.formEspecialista;
      } else {
        form = this.formAdministrador;
      }

      if (form.invalid) {
        form.markAllAsTouched();
        return;
      }

      this.loader.show();

      const datos = form.value;
      console.log('Datos del formulario:', datos);

      if (this.usuarioActual?.perfil === 'Administrador') {
        await this.authService.createUserWithoutLogin(
          datos.correo,
          datos.clave
        );
        console.log('Usuario creado sin cambiar sesión de administrador');
      } else {
        await this.authService.register(datos.correo, datos.clave);
      }

      let usuario: Usuario;
      if (this.formActivo === 'Paciente') {
        const imagen1URL = await this.uploadImage(datos.imagenUno);
        const imagen2URL = await this.uploadImage(datos.imagenDos);

        usuario = new Paciente(
          datos.correo.toLowerCase(),
          'Paciente',
          datos.nombre,
          datos.apellido,
          datos.edad,
          datos.dni,
          datos.obraSocial,
          imagen1URL,
          imagen2URL
        );
      } else if (this.formActivo === 'Especialista') {
        const imagenURL = await this.uploadImage(datos.imagen);
        usuario = new Especialista(
          datos.correo.toLowerCase(),
          'Especialista',
          datos.nombre,
          datos.apellido,
          datos.edad,
          datos.dni,
          this.especialidadesSeleccionadas,
          imagenURL,
          'Inhabilitado',
          { ['Dia']: ['Hora'] }
        );
      } else {
        const imagenURL = await this.uploadImage(datos.imagenAdmin);
        usuario = new Administrador(
          datos.correo.toLowerCase(),
          'Administrador',
          datos.nombre,
          datos.apellido,
          datos.edad,
          datos.dni,
          imagenURL
        );
      }

      console.log('El usuario que se va a guardar es: ', usuario);

      try {
        await this.usuarioService.guardar(usuario); // Subo el usuario a la Firestore
        this.loader.hide(); // Oculto el loader
        this.mostrarConfirmacion = true;
      } catch (error) {
        this.loader.hide(); // Oculto el loader
        console.error('Error guardando usuario en Firestore:', error);
        this.error = true;
        this.mensaje =
          'Hubo un error al guardar el usuario en la base de datos';
      }
    } catch (error: any) {
      this.loader.hide();
      console.error('Error al registrar:', error);
      this.error = true;

      if (error && error.code) {
        if (error.code === 'auth/email-already-in-use') {
          console.log('Error al registrar usuario:', error);
          this.mensaje = 'El correo ya está siendo utilizado por otro usuario';
        } else {
          this.mensaje = 'Error al registrar usuario';
        }
      } else {
        console.error('Error desconocido al registrar usuario:', error);
      }

      this.mensaje = 'Hubo un error al registrar el usuario';
    }
  }
  // Manejo el cambio de archivos en los inputs de tipo file
  onFileChange(event: Event, fieldName: string): void {
    const input = event.target as HTMLInputElement;

    try {
      if (input.files && input.files.length > 0) {
        const file = input.files[0];
        console.log('Archivo seleccionado:', file);
        if (this.formActivo === 'Paciente') {
          this.formPaciente.get(fieldName)?.setValue(file);
        } else if (this.formActivo === 'Especialista') {
          this.formEspecialista.get(fieldName)?.setValue(file);
        } else {
          this.formAdministrador.get(fieldName)?.setValue(file);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  // Subo la imagen al Storage y retorno su URL de descarga
  async uploadImage(file: File): Promise<string> {
    try {
      console.log('Subiendo archivo:', file);
      const downloadURL = await this.storageService.subirImagenFile(file);
      console.log('URL de descarga:', downloadURL);
      return downloadURL;
    } catch (error) {
      console.error('Error al subir la imagen:', error);
      throw new Error('Error al subir la imagen');
    }
  }

  // Función que cambia al formulario activo y resetea todos los datos
  cambiarFormulario(formulario: string) {
    this.formActivo = formulario;
    this.error = false;
    this.mensaje =
      'Bienvenido, para completar el registro hay que rellenar todos los datos.';

    this.formPaciente.reset();
    this.formEspecialista.reset();
    this.formAdministrador.reset();
    // Reseteo formularios
  }

  // Función que le devuelve el formulario activo al HTML
  obtenerFormularioActivo() {
    if (this.formActivo === 'Paciente') {
      return this.formPaciente;
    } else if (this.formActivo === 'Especialista') {
      return this.formEspecialista;
    } else {
      return this.formAdministrador;
    }
  }

  // Función que muestra el componente de las especialidades
  mostrarEspecialidadesClick() {
    this.mostrarEspecialidades = !this.mostrarEspecialidades;
  }

  // Función que recibe las especialidades que seleccionó el usuario
  recibirEspecialidadesSeleccionadas(especialidades: string[]) {
    this.formEspecialista.get('especialidades')?.setValue(especialidades);
    this.especialidadesSeleccionadas = especialidades;
    console.log('Especialidades seleccionadas:', especialidades);
  }

  // Función que cierra el componente de especialidades
  cerrarEspecialidades() {
    this.mostrarEspecialidades = false;
  }

  resolved(captchaResponse: string | null) {
    console.log(`Resolved captcha with response: ${captchaResponse}`);
    this.captchaResolved = captchaResponse !== null;
  }
}
