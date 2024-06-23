import { Component, Input, OnInit } from '@angular/core';
import { Usuario } from '../../../classes/usuario';
import { FirestoreUsuariosService } from '../../../services/firestore-usuarios.service';
import { LoaderService } from '../../../services/loader.service';
import { TurnosService } from '../../../services/turnos.service';
import { EspecialidadesService } from '../../../services/especialidades.service';
import { Turno } from '../../../classes/turno';
import { Especialista } from '../../../classes/especialista';
import { Paciente } from '../../../classes/paciente';
import { Administrador } from '../../../classes/administrador';
import Swal from 'sweetalert2';
import { FechaPipe } from '../../../pipes/fecha.pipe';

@Component({
  selector: 'app-tabla-turnos',
  standalone: true,
  imports: [FechaPipe],
  templateUrl: './tabla-turnos.component.html',
  styleUrls: ['./tabla-turnos.component.css'],
})
export class TablaTurnosComponent implements OnInit {
  @Input() usuarioActual: Usuario | undefined = undefined;
  turnos: Turno[] = []; // Lista de todos los turnos
  especialistas: Especialista[] = []; // Lista de todos los especialistas
  pacientes: Paciente[] = []; // Lista de todos los pacientes
  especialidades: string[] = []; // Lista de todas las especialidades
  especialidadSeleccionada: string[] = []; // Lista de las especialidades seleccionadas
  especialistaSeleccionado: string[] = []; // Lista de los especialistas seleccionados
  pacienteSeleccionado: string[] = []; // Lista de los pacientes seleccionados

  constructor(
    private usuarioService: FirestoreUsuariosService,
    private loader: LoaderService,
    private turnosService: TurnosService,
    private especialidadesService: EspecialidadesService
  ) {}

  ngOnInit(): void {
    this.loader.show();

    this.cargarTurnos()
      .then(() => {
        const promesas: Promise<any>[] = [];
        if (
          this.usuarioActual instanceof Paciente ||
          this.usuarioActual instanceof Administrador
        ) {
          promesas.push(this.cargarEspecialidades());
          promesas.push(this.cargarEspecialistas());
        } else if (this.usuarioActual instanceof Especialista) {
          promesas.push(this.cargarPacientes());
          this.especialidades = this.usuarioActual.especialidad;
        }

        return Promise.all(promesas); // Espero a que todas las promesas se resuelvan
      })
      .catch((error) => {
        console.error('Error durante la inicialización:', error);
      })
      .finally(() => {
        console.log(this.turnos);
        console.log(this.especialidades);
        console.log(this.especialistas);
        console.log(this.pacientes);
        this.loader.hide();
      });
  }

  async cargarTurnos() {
    try {
      this.turnos = await this.turnosService.getTurnos();

      // Filtro que los turnos sean propios del usuario (si no es administrador)
      if (this.usuarioActual?.perfil !== 'Administrador') {
        this.turnos = this.turnos.filter(
          (turno) =>
            turno.apellidoPaciente === this.usuarioActual?.apellido ||
            turno.apellidoEspecialista === this.usuarioActual?.apellido
        );
      }
    } catch (error) {
      console.error('Error obteniendo turnos:', error);
    }
  }

  async cargarEspecialistas() {
    try {
      const usuarios = await this.usuarioService.obtenerUsuariosPorPerfil(
        'Especialista',
        99
      );
      this.especialistas = usuarios.filter(
        (user) => user instanceof Especialista
      ) as Especialista[];
    } catch (error) {
      console.error('Error obteniendo especialistas:', error);
    }
  }

  async cargarPacientes() {
    try {
      const usuarios = await this.usuarioService.obtenerUsuariosPorPerfil(
        'Paciente',
        99
      );
      this.pacientes = usuarios.filter(
        (user) => user instanceof Paciente
      ) as Paciente[];
    } catch (error) {
      console.error('Error obteniendo pacientes:', error);
    }
  }

  async cargarEspecialidades() {
    try {
      this.especialidades =
        await this.especialidadesService.getEspecialidadesNombres();
    } catch (error) {
      console.error('Error obteniendo especialidades:', error);
    }
  }

  // Función que devuelve un array con los turnos que pasen el filtro de los Checkbox
  get turnosFiltrados() {
    if (
      this.usuarioActual?.perfil === 'Paciente' ||
      this.usuarioActual?.perfil === 'Administrador'
    ) {
      return this.turnos.filter(
        (turno) =>
          (this.especialidadSeleccionada.length === 0 ||
            this.especialidadSeleccionada.includes(turno.especialidad)) &&
          (this.especialistaSeleccionado.length === 0 ||
            this.especialistaSeleccionado.includes(turno.apellidoEspecialista))
      );
    } else {
      return this.turnos.filter(
        (turno) =>
          (this.especialidadSeleccionada.length === 0 ||
            this.especialidadSeleccionada.includes(turno.especialidad)) &&
          (this.pacienteSeleccionado.length === 0 ||
            this.pacienteSeleccionado.includes(turno.apellidoPaciente))
      );
    }
  }

  // Función que quita o agrega elementos a las listas afectadas por los Checkbox
  actualizarFiltro(tipo: string, valor: string, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (tipo === 'especialidad') {
      if (isChecked) {
        this.especialidadSeleccionada.push(valor);
      } else {
        this.especialidadSeleccionada = this.especialidadSeleccionada.filter(
          (especialidad) => especialidad !== valor
        );
      }
    } else if (tipo === 'especialista') {
      if (isChecked) {
        this.especialistaSeleccionado.push(valor);
      } else {
        this.especialistaSeleccionado = this.especialistaSeleccionado.filter(
          (especialista) => especialista !== valor
        );
      }
    } else if (tipo === 'paciente') {
      if (isChecked) {
        this.pacienteSeleccionado.push(valor);
      } else {
        this.pacienteSeleccionado = this.pacienteSeleccionado.filter(
          (paciente) => paciente !== valor
        );
      }
    }
  }

  cancelarTurno(turno: Turno) {
    Swal.fire({
      title: 'Cancelar Turno',
      input: 'textarea',
      inputLabel: '¿Vas a cancelar el turno? Explicá tu motivo.',
      inputPlaceholder: 'Escribí tu comentario acá...',
      showCancelButton: true,
      confirmButtonText: 'Confirmar cancelación',
      confirmButtonColor: '#3c5ebc',
      cancelButtonText: 'Cerrar',
    }).then((result) => {
      if (result.isConfirmed) {
        const comentario = result.value;
        console.log('Comentario sobre cancelación:', comentario);
        turno.estado = 'Cancelado';
        turno.comentario = `Comentario sobre la cancelación hecha por el ${this.usuarioActual?.perfil}: ${comentario}`;
        this.turnosService.modificarTurno(turno);
      } else if (result.isDismissed) {
        console.log('Cancelación de turno descartada');
      }
    });
  }

  verResenia(turno: Turno) {
    let htmlContent = '';
    if (turno.comentario !== 'NN') {
      htmlContent += `<br><h4>Comentario</h4>
      <textarea class="swal2-textarea" readonly>${turno.comentario}</textarea><br>`;
    }
    if (turno.diagnostico !== 'NN') {
      htmlContent += `<br><h4>Diagnóstico</h4>
      <textarea class="swal2-textarea" readonly>${turno.diagnostico}</textarea>`;
    }

    Swal.fire({
      title: 'Reseña del Turno',
      html: htmlContent,
      // showCloseButton: true,
      focusConfirm: false,
      confirmButtonText: 'Cerrar',
      confirmButtonColor: '#3c5ebc',
    });
  }

  completarEncuesta(turno: Turno) {
    Swal.fire({
      title: 'Completar Encuesta',
      html: `
        <p>Por favor, completá esta encuesta para ayudarnos a crecer.</p>
        <label for="experiencia">¿Cómo fue tu experiencia en la Web?</label>
        <input id="experiencia" class="swal2-input" type="text">
        <label for="calificacion">¿Cuánto calificarías del 1 al 10 la atención del Especialista?</label>
        <input id="calificacion" class="swal2-input" type="number" min="1" max="10">
        <label for="consejo">¿Qué consejo nos darías para mejorar?</label>
        <input id="consejo" class="swal2-input" type="text">
      `,
      showCancelButton: true,
      confirmButtonText: 'Enviar',
      confirmButtonColor: '#3c5ebc',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const experiencia = (
          document.getElementById('experiencia') as HTMLInputElement
        ).value;
        const calificacion = (
          document.getElementById('calificacion') as HTMLInputElement
        ).value;
        const consejo = (document.getElementById('consejo') as HTMLInputElement)
          .value;

        if (!experiencia || !calificacion || !consejo) {
          Swal.showValidationMessage('Por favor, completá todos los campos');
          return null;
        }

        return { experiencia, calificacion, consejo };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const { experiencia, calificacion, consejo } = result.value!;
        console.log('Experiencia en la Web:', experiencia);
        console.log('Calificación de la atención:', calificacion);
        console.log('Consejo para mejorar:', consejo);

        turno.encuesta = [experiencia, calificacion, consejo];
        this.turnosService.modificarTurno(turno);
      }
    });
  }

  calificarAtencion(turno: Turno) {
    Swal.fire({
      title: 'Calificar Atención',
      input: 'textarea',
      inputLabel:
        'Contanos tu experiencia siendo atendido por este Especialista.',
      inputPlaceholder: 'Escribí tu comentario acá...',
      showCancelButton: true,
      confirmButtonText: 'Enviar comentario',
      confirmButtonColor: '#3c5ebc',
      cancelButtonText: 'Cerrar',
    }).then((result) => {
      if (result.isConfirmed) {
        const comentario = result.value;
        console.log('Calificación de atención:', comentario);
        turno.comentario = `Calificación de atención: ${comentario}`;
        this.turnosService.modificarTurno(turno);
      } else if (result.isDismissed) {
        console.log('Calificación de atención descartada');
      }
    });
  }

  rechazarTurno(turno: Turno) {
    Swal.fire({
      title: 'Rechazar Turno',
      input: 'textarea',
      inputLabel: '¿Vas a rechazar el turno? Explicá tu motivo.',
      inputPlaceholder: 'Escribí tu comentario acá...',
      showCancelButton: true,
      confirmButtonText: 'Rechazar turno',
      confirmButtonColor: '#3c5ebc',
      cancelButtonText: 'Cerrar',
    }).then((result) => {
      if (result.isConfirmed) {
        const comentario = result.value;
        console.log('Comentario sobre el rechazo del turno:', comentario);
        turno.estado = 'Rechazado';
        turno.comentario = `Comentario sobre el rechazo del turno: ${comentario}`;
        this.turnosService.modificarTurno(turno);
      } else if (result.isDismissed) {
        console.log('Rechazo de turno descartado');
      }
    });
  }

  aceptarTurno(turno: Turno) {
    turno.estado = 'Aceptado';
    this.turnosService.modificarTurno(turno);
  }
  finalizarTurno(turno: Turno) {
    Swal.fire({
      title: 'Finalizar Turno',
      input: 'textarea',
      inputLabel: 'Completá el diagnóstico detalladamente.',
      inputPlaceholder: 'Escribir acá...',
      showCancelButton: true,
      confirmButtonText: 'Finalizar turno',
      confirmButtonColor: '#3c5ebc',
      cancelButtonText: 'Cerrar',
    }).then((result) => {
      if (result.isConfirmed) {
        const comentario = result.value;
        console.log('Diagnóstico:', comentario);
        turno.diagnostico = comentario;
        turno.estado = 'Realizado';
        this.turnosService.modificarTurno(turno);
      } else if (result.isDismissed) {
        console.log('Finalización de turno descartada');
      }
    });
  }

  cargarHistoriaClinica(turno: Turno) {
    Swal.fire({
      title: 'Cargar Historia Clínica',
      html: `
        <style>
          input {
            background-color: black;
          }
        </style>

        <p>Completá los 4 campos obligatorios. También podés agregar 3 opcionales.</p>
        <label for="altura">Altura</label>
        <input id="altura" class="swal2-input" style="border-color: black;" type="number" min="100" max="700"> <br>
        <label for="peso">Peso</label>
        <input id="peso" class="swal2-input" style="border-color: black;" type="number" min="0" max="700"> <br>
        <label for="temperatura">Temperatura</label>
        <input id="temperatura" class="swal2-input" style="border-color: black;" type="number" min="1" max="300"> <br>
        <label for="presion">Presión</label>
        <input id="presion" class="swal2-input" style="border-color: black;" type="number" min="1" max="500"> <br><br>
        <h4>Campos Opcionales</h4>
        <input id="campoOpcionalKey1" placeholder="Campo Opcional" class="swal2-input" style="border-color: black;" type="text"> <br>
        <input id="campoOpcionalValue1" placeholder="Valor" class="swal2-input" style="border-color: black;" type="text"> <br>
        <input id="campoOpcionalKey2" placeholder="Campo Opcional" class="swal2-input" style="border-color: black;" type="text"> <br>
        <input id="campoOpcionalValue2" placeholder="Valor" class="swal2-input" style="border-color: black;" type="text"> <br>
        <input id="campoOpcionalKey3" placeholder="Campo Opcional" class="swal2-input" style="border-color: black;" type="text"> <br>
        <input id="campoOpcionalValue3" placeholder="Valor" class="swal2-input" style="border-color: black;" type="text">`,
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      confirmButtonColor: '#3c5ebc',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const altura = (document.getElementById('altura') as HTMLInputElement).value;
        const peso = (document.getElementById('peso') as HTMLInputElement).value;
        const temperatura = (document.getElementById('temperatura') as HTMLInputElement).value;
        const presion = (document.getElementById('presion') as HTMLInputElement).value;
        
        const campoOpcionalKey1 = (document.getElementById('campoOpcionalKey1') as HTMLInputElement).value;
        const campoOpcionalValue1 = (document.getElementById('campoOpcionalValue1') as HTMLInputElement).value;
        const campoOpcionalKey2 = (document.getElementById('campoOpcionalKey2') as HTMLInputElement).value;
        const campoOpcionalValue2 = (document.getElementById('campoOpcionalValue2') as HTMLInputElement).value;
        const campoOpcionalKey3 = (document.getElementById('campoOpcionalKey3') as HTMLInputElement).value;
        const campoOpcionalValue3 = (document.getElementById('campoOpcionalValue3') as HTMLInputElement).value;
  
        if (!altura || !peso || !temperatura || !presion) {
          Swal.showValidationMessage('Por favor, completá los 4 campos obligatorios.');
          return null;
        }
  
        return {
          altura,
          peso,
          temperatura,
          presion,
          opcionales: [
            { key: campoOpcionalKey1, value: campoOpcionalValue1 },
            { key: campoOpcionalKey2, value: campoOpcionalValue2 },
            { key: campoOpcionalKey3, value: campoOpcionalValue3 },
          ],
        };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const paciente = this.pacientes.find(p => p.id === turno.idPaciente);
        const { altura, peso, temperatura, presion, opcionales } = result.value!;
        console.log(result.value);
  
        if (paciente) {
          const historiaClinica: any = {
            altura,
            peso,
            temperatura,
            presion,
          };
  
          opcionales.forEach((opcional: { key: string; value: string; }) => {
            if (opcional.key && opcional.value && opcional.key !== 'NN' && opcional.value !== 'NN') {
              historiaClinica[opcional.key] = opcional.value;
            }
          });
  
          paciente.historiaClinica = historiaClinica;
          console.log(paciente);
          this.usuarioService.updateUsuario(paciente);
        }
      }
    });
  }
}