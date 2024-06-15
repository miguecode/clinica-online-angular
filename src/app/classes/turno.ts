export class Turno {
  idTurno: string;
  idPaciente: string;
  idEspecialista: string;
  especialidad: string;
  apellidoEspecialista: string;
  apellidoPaciente: string;
  estado: string;

  constructor(idTurno: string, idPaciente: string, idEspecialista: string,
    especialidad: string, apellidoEspecialista: string, apellidoPaciente: string, estado: string) {
    this.idTurno = idTurno;
    this.idPaciente = idPaciente;
    this.idEspecialista = idEspecialista;
    this.especialidad = especialidad;
    this.apellidoEspecialista = apellidoEspecialista;
    this.apellidoPaciente = apellidoPaciente;
    this.estado = estado;
  }
}
