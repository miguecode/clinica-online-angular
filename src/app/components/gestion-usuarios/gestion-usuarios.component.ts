import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../classes/usuario';
import { Paciente } from '../../classes/paciente';
import { Especialista } from '../../classes/especialista';
import { Administrador } from '../../classes/administrador';
import { FirestoreUsuariosService } from '../../services/firestore-usuarios.service';
import { LoaderService } from '../../services/loader.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx'; // Biblioteca de excel
import { saveAs } from 'file-saver'; // Funciones para guardar archivos
import { EspecialidadesPipe } from '../../pipes/especialidades.pipe';

@Component({
  selector: 'app-gestion-usuarios',
  standalone: true,
  imports: [EspecialidadesPipe],
  templateUrl: './gestion-usuarios.component.html',
  styleUrl: './gestion-usuarios.component.css',
  providers: [EspecialidadesPipe]
})
export class GestionUsuariosComponent implements OnInit {
  listaUsuarios: (Usuario | Paciente | Especialista | Administrador)[] = [];
  perfiles: string[] = ['Paciente', 'Especialista', 'Administrador'];
  perfilSeleccionado: string = 'Paciente';

  constructor(
    private usuariosService: FirestoreUsuariosService,
    private loader: LoaderService,
    private router: Router,
    private especialidadesPipe: EspecialidadesPipe, // Inyecto el pipe para usarlo en el TS
  ) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  async cargarUsuarios(): Promise<void> {
    this.loader.show();
    this.listaUsuarios = await this.usuariosService.obtenerUsuariosPorPerfil(this.perfilSeleccionado, 99);
    this.loader.hide();
  }

  cambiarPerfil(perfil: string): void {
    this.perfilSeleccionado = perfil;
    this.cargarUsuarios();
  }

  esPaciente(usuario: Usuario | Paciente | Especialista | Administrador): usuario is Paciente {
    return usuario instanceof Paciente;
  }

  esEspecialista(usuario: Usuario | Paciente | Especialista | Administrador): usuario is Especialista {
    return usuario instanceof Especialista;
  }

  esAdministrador(usuario: Usuario | Paciente | Especialista | Administrador): usuario is Administrador {
    return usuario instanceof Administrador;
  }

  cambiarEstadoEspecialista(especialista: Especialista) {
    if (especialista.estado === 'Habilitado') {
      especialista.estado = 'Inhabilitado';
    } else {
      especialista.estado = 'Habilitado';
    }

    this.usuariosService.updateUsuario(especialista);
  }

  irAAlta() {
    this.router.navigate(['/registro']);
  }

  mostrarHistoriaClinica(paciente: Paciente) {
    if (!this.esPaciente || !paciente || paciente.historiaClinica === 'NN') {
      Swal.fire({
        title: 'Historia Clínica',
        text: 'La historia clínica está vacía o no se cargó aún.',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3c5ebc',
        icon: 'info',
      });
      return;
    }

    const historiaClinica = paciente.historiaClinica;
    const fijos = `
    Temperatura: ${historiaClinica.temperatura || 'N/A'} °C <br>
    Peso: ${historiaClinica.peso || 'N/A'} kg <br>
    Presión: ${historiaClinica.presion || 'N/A'} mmHg <br>
    Altura: ${historiaClinica.altura || 'N/A'} cm <br>
  `;

    const opcionales = Object.keys(historiaClinica)
      .filter(key => !['temperatura', 'peso', 'presion', 'altura'].includes(key))
      .map(key => `${key}: ${historiaClinica[key]}`)
      .join('<br>');

    Swal.fire({
      title: 'Historia Clínica',
      html: `${fijos}${opcionales}`,
      confirmButtonText: 'Listo',
      confirmButtonColor: '#3c5ebc',
    });
  }

  descargarExcel(): void {
    // Creo una nueva "hoja de trabajo"
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.prepararDatosParaExcel());
  
    // Creo un nuevo "libro de trabajo"
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `${this.perfilSeleccionado}s`);
    // El nombre del libro será el mismo que el perfil seleccionado
    // La 's' es sólo para que el nombre quede en plural
    
    // Genero el archivo Excel
    const wbout: ArrayBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  
    // Guardo el archivo
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), `${this.perfilSeleccionado}s.xlsx`);
    // El nombre del archivo será el mismo que el perfil seleccionado, con un 's.xlsx' al final
    // La 's' es sólo para que el nombre quede en plural
  
    // Muestro mensaje de confirmación
    Swal.fire({
      title: 'Descargando...',
      text: 'La descarga del archivo Excel ha comenzado.',
      confirmButtonText: 'Listo',
      confirmButtonColor: '#249d46',
      icon: 'success',
    });
  }
  
  // Función para preparar los datos para el Excel
  private prepararDatosParaExcel(): any[] {
    return this.listaUsuarios.map(usuario => {
      if (this.esPaciente(usuario)) {
        return {
          Nombre: usuario.nombre,
          Apellido: usuario.apellido,
          Correo: usuario.correo,
          Edad: usuario.edad,
          DNI: usuario.dni,
          'Obra Social': usuario.obraSocial,
          'Primer Imagen': usuario.imagenUno,
          'Segunda Imagen': usuario.imagenDos,
          Historial: '...'
        };
      } else if (this.esEspecialista(usuario)) {
        return {
          Nombre: usuario.nombre,
          Apellido: usuario.apellido,
          Correo: usuario.correo,
          Edad: usuario.edad,
          DNI: usuario.dni,
          Especialidad: this.especialidadesPipe.transform(usuario.especialidad), // Uso el pipe en TS
          Estado: usuario.estado,
          Disponibilidad: '...',
          'Imagen Perfil': usuario.imagenPerfil
        };
      } else if (this.esAdministrador(usuario)) {
        return {
          Nombre: usuario.nombre,
          Apellido: usuario.apellido,
          Correo: usuario.correo,
          Edad: usuario.edad,
          DNI: usuario.dni,
          Tipo: 'Administrador',
          "Imagen Perfil": usuario.imagenPerfil
        };
      }
      return {};
    });
  }
}
