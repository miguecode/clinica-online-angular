import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, doc, getDocs, query, updateDoc } from '@angular/fire/firestore';
import { Turno } from '../classes/turno';

@Injectable({
  providedIn: 'root'
})
export class TurnosService {
  private PATH = 'turnos';

  constructor(private firestore: Firestore) { }

  async getTurnos(): Promise<Turno[]> {
    const col = collection(this.firestore, this.PATH);
    const q = query(col);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => this.convertirATurno(doc.data(), doc.id));
  }

  convertirATurno(doc: any, id: string): Turno {
    return new Turno(
      id,
      doc.idPaciente,
      doc.idEspecialista,
      doc.especialidad,
      doc.apellidoEspecialista,
      doc.apellidoPaciente,
      doc.comentario,
      doc.diagnostico,
      doc.encuesta,
      doc.estado
    );
  }

  async agregarTurno(turno: Turno): Promise<void> {
    const col = collection(this.firestore, this.PATH);
    await addDoc(col, {
      idPaciente: turno.idPaciente,
      idEspecialista: turno.idEspecialista,
      especialidad: turno.especialidad,
      apellidoEspecialista: turno.apellidoEspecialista,
      apellidoPaciente: turno.apellidoPaciente,
      comentario: turno.comentario,
      diagnostico: turno.diagnostico,
      encuesta: turno.encuesta,
      estado: turno.estado
    });
  }

  async modificarTurno(turno: Turno): Promise<void> {
    if (!turno.idTurno) {
      console.error('Error: El turno no tiene un ID.');
      return;
    }

    try {
      const turnoDocRef = doc(this.firestore, `${this.PATH}/${turno.idTurno}`);
      await updateDoc(turnoDocRef, {
        estado: turno.estado,
        especialidad: turno.especialidad,
        apellidoEspecialista: turno.apellidoEspecialista,
        apellidoPaciente: turno.apellidoPaciente,
        comentario: turno.comentario,
        diagnostico: turno.diagnostico,
        encuesta: turno.encuesta,
      });
      console.log('Turno modificado correctamente en la BD');
    } catch (error) {
      console.error('Error actualizando turno en Firestore:', error);
    }
  }
}
