export class Turno {
  idTurno?: string;
  idPaciente: string;
  idEspecialista: string;
  especialidad: string;
  apellidoEspecialista: string;
  apellidoPaciente: string;
  comentario: string;
  diagnostico: string;
  encuesta: any[];
  estado: string;
  fecha: any;
  
  constructor(
    idPaciente: string,
    idEspecialista: string,
    especialidad: string,
    apellidoEspecialista: string,
    apellidoPaciente: string,
    comentario: string,
    diagnostico: string,
    encuesta: any[],
    estado: string,
    fecha: any,
    idTurno?: string
  ) {
    this.idPaciente = idPaciente;
    this.idEspecialista = idEspecialista;
    this.especialidad = especialidad;
    this.apellidoEspecialista = apellidoEspecialista;
    this.apellidoPaciente = apellidoPaciente;
    this.comentario = comentario;
    this.diagnostico = diagnostico;
    this.encuesta = encuesta;
    this.estado = estado;
    this.fecha = fecha;
    this.idTurno = idTurno;
  }
}
