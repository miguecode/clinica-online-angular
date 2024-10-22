import { Component, OnInit } from '@angular/core';
import { FirestoreUsuariosService } from '../../services/firestore-usuarios.service';
import { LoaderService } from '../../services/loader.service';
import { AuthService } from '../../services/auth.service';
import { Paciente } from '../../classes/paciente';
import { Especialista } from '../../classes/especialista';
import { Administrador } from '../../classes/administrador';
import { CommonModule } from '@angular/common';
import { MostrarHorariosComponent } from '../mostrar-horarios/mostrar-horarios.component';
import { DisponibilidadPipe } from '../../pipes/disponibilidad.pipe';
import Swal from 'sweetalert2';
import { animate, style, transition, trigger } from '@angular/animations';
import jsPDF from 'jspdf';

const mostrarOcultar = trigger('mostrarOcultarTrigger', [
  transition (':enter', [
    style({ opacity: 0 }),
    animate('1s', style({ opacity: 1 }))
  ]),
  transition (':leave', [
    style({ opacity: 1 }),
    animate('0.6s', style({ opacity: 0 }))
  ]),
]);

@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [CommonModule, MostrarHorariosComponent, DisponibilidadPipe],
  templateUrl: './mi-perfil.component.html',
  styleUrls: ['./mi-perfil.component.css'],
  animations: [mostrarOcultar],
})
export class MiPerfilComponent implements OnInit {
  usuario: any;
  esPaciente: boolean = false;
  esEspecialista: boolean = false;
  esAdministrador: boolean = false;
  mostrarHorarios: boolean = false;
  horarios: { [key: string]: string[] } = {};

  constructor(
    private auth: AuthService,
    private usuarioService: FirestoreUsuariosService,
    private loader: LoaderService,
  ) {}

  ngOnInit(): void {
    this.getUsuarioActual();
  }

  async getUsuarioActual() {
    this.loader.show();
    try {
      const correo = this.auth.getCurrentUserEmail();
      if (correo) {
        this.usuario = await this.usuarioService.getUsuarioPorCorreo(correo);
        this.esPaciente = this.usuario instanceof Paciente;
        this.esEspecialista = this.usuario instanceof Especialista;
        this.esAdministrador = this.usuario instanceof Administrador;

        if (this.esEspecialista && this.usuario instanceof Especialista) {
          this.horarios = this.usuario.disponibilidad || {};
        }
      }
    } catch (error) {
      console.error('Error obteniendo usuario:', error);
    } finally {
      this.loader.hide();
    }
  }

  // Función para la animación de mostrar u ocultar un componente hijo
  mostrarOcultar() {
    this.mostrarHorarios = !this.mostrarHorarios;
  }

  mostrarHorariosClick() {
    this.mostrarHorarios = true;
  }

  mostrarHistoriaClinica() {
    if (!this.esPaciente || !this.usuario || !Array.isArray(this.usuario.historiaClinica) || this.usuario.historiaClinica.length === 0) {
      Swal.fire({
        title: 'Historia Clínica',
        text: 'Tu historia clínica está vacía o no se cargó aún.',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3c5ebc',
        icon: 'info',
      });
      return;
    }
  
    const historiaClinica = this.usuario.historiaClinica[this.usuario.historiaClinica.length - 1];
    
    const fijos = `
      Fecha: ${historiaClinica.fecha || 'N/A'} <br>
      Temperatura: ${historiaClinica.temperatura || 'N/A'} °C <br>
      Peso: ${historiaClinica.peso || 'N/A'} kg <br>
      Presión: ${historiaClinica.presion || 'N/A'} mmHg <br>
      Altura: ${historiaClinica.altura || 'N/A'} cm <br>
    `;
  
    const opcionales = Object.keys(historiaClinica)
      .filter(key => !['fecha', 'temperatura', 'peso', 'presion', 'altura'].includes(key))
      .map(key => `${key}: ${historiaClinica[key]}`)
      .join('<br>');
  
    Swal.fire({
      title: 'Historia Clínica',
      html: `${fijos}${opcionales}`,
      confirmButtonText: 'Listo',
      confirmButtonColor: '#3c5ebc',
    });
  }
  

  // Función que recibe los horarios que seleccionó el usuario y los guarda en Firestore
  async recibirHorariosSeleccionados(horarios: { [key: string]: string[] }) {
    this.horarios = horarios;
    console.log('Disponibilidad:', horarios);

    if (this.usuario && this.esEspecialista && this.usuario instanceof Especialista) {
      this.usuario.disponibilidad = horarios;
      try {
        await this.usuarioService.updateUsuario(this.usuario);
        console.log('Horarios guardados correctamente.');
      } catch (error) {
        console.error('Error guardando los horarios:', error);
      }
    }
  }

  // Función que cierra el componente de especialidades
  cerrarMostrarHorarios() {
    this.mostrarHorarios = false;
  }

  descargarHistoriaClinica() {
    if (!this.esPaciente || !this.usuario || this.usuario.historiaClinica === 'NN' || !Array.isArray(this.usuario.historiaClinica) || this.usuario.historiaClinica.length === 0) {
      Swal.fire({
        title: 'Historia Clínica',
        text: 'Tu historia clínica está vacía o no se cargó aún.',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3c5ebc',
        icon: 'info',
      });
      return;
    }
  
    const historiasClinicas = this.usuario.historiaClinica;
    const doc = new jsPDF();
  
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(42);
    doc.text('Historia Clínica', 55, 30);
  
    doc.setFontSize(30);
    doc.setFont('helvetica', 'normal');
    doc.text(`${this.usuario.nombre} ${this.usuario.apellido}, ${this.usuario.edad} años`, 10, 60);
  
    let y = 80;
    historiasClinicas.forEach((historiaClinica:
      { [x: string]: any; fecha?: any; temperatura?: any; peso?: any; presion?: any; altura?: any; }) => {
      if (y > 260) {
        doc.addPage();
        y = 20;
      }
  
      doc.setFontSize(25);
      doc.setFont('helvetica', 'bold');
      doc.text(`${historiaClinica.fecha}`, 10, y);
      y += 10;
  
      doc.setFont('helvetica', 'bold');
      doc.text(`- Temperatura: `, 10, y);
      doc.setFont('helvetica', 'normal');
      doc.text(`${historiaClinica.temperatura || 'N/A'} °C`, 85, y);
      y += 15;
  
      doc.setFont('helvetica', 'bold');
      doc.text(`- Peso: `, 10, y);
      doc.setFont('helvetica', 'normal');
      doc.text(`${historiaClinica.peso || 'N/A'} kg`, 85, y);
      y += 15;
  
      doc.setFont('helvetica', 'bold');
      doc.text(`- Presión: `, 10, y);
      doc.setFont('helvetica', 'normal');
      doc.text(`${historiaClinica.presion || 'N/A'} mmHg`, 85, y);
      y += 15;
  
      doc.setFont('helvetica', 'bold');
      doc.text(`- Altura: `, 10, y);
      doc.setFont('helvetica', 'normal');
      doc.text(`${historiaClinica.altura || 'N/A'} cm`, 85, y);
      y += 15;
  
      Object.keys(historiaClinica).forEach(key => {
        if (!['fecha', 'temperatura', 'peso', 'presion', 'altura'].includes(key)) {
          doc.setFont('helvetica', 'bold');
          doc.text(`- ${key}: `, 10, y);
          doc.setFont('helvetica', 'normal');
          doc.text(`${historiaClinica[key]}`, 85, y);
          y += 15;
        }
      });
  
      y += 10;
    });
  
    doc.save('HistoriaClinica.pdf');
  }
}