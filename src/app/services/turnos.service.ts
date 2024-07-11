import { Injectable } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
} from '@angular/fire/firestore';
import { Turno } from '../classes/turno';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TurnosService {
  private PATH = 'turnos';
  private turnosSubject: BehaviorSubject<Turno[]> = new BehaviorSubject<Turno[]>([]);
  turnos$: Observable<Turno[]> = this.turnosSubject.asObservable();

  constructor(private firestore: Firestore) {
    this.initTurnosListener();
  }

  async getTurnos(): Promise<Turno[]> {
    const col = collection(this.firestore, this.PATH);
    const q = query(col);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) =>
      this.convertirATurno(doc.data(), doc.id)
    );
  }

  private initTurnosListener(): void {
    const col = collection(this.firestore, this.PATH);
    const q = query(col);

    onSnapshot(q, snapshot => {
      const turnos: Turno[] = snapshot.docs.map(doc => this.convertirATurno(doc.data(), doc.id));
      this.turnosSubject.next(turnos);
    });
  }

  convertirATurno(doc: any, id: string): Turno {
    return new Turno(
      doc.idPaciente,
      doc.idEspecialista,
      doc.especialidad,
      doc.apellidoEspecialista,
      doc.apellidoPaciente,
      doc.comentario,
      doc.diagnostico,
      doc.encuesta,
      doc.estado,
      doc.fecha,
      doc.historiaClinica,
      id
    );
  }

  async agregarTurno(turno: Turno): Promise<void> {
    const col = collection(this.firestore, this.PATH);
    const docRef = await addDoc(col, {
      idPaciente: turno.idPaciente,
      idEspecialista: turno.idEspecialista,
      especialidad: turno.especialidad,
      apellidoEspecialista: turno.apellidoEspecialista,
      apellidoPaciente: turno.apellidoPaciente,
      comentario: turno.comentario,
      diagnostico: turno.diagnostico,
      encuesta: turno.encuesta,
      estado: turno.estado,
      fecha: turno.fecha,
      historiaClinica: turno.historiaClinica,
    });

    turno.idTurno = docRef.id; // Guardo el ID generado por Firestore en el objeto Turno
    this.initTurnosListener();
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
        fecha: turno.fecha,
        historiaClinica: turno.historiaClinica,
      });
      console.log('Turno modificado correctamente en la BD');
      this.initTurnosListener();
    } catch (error) {
      console.error('Error actualizando turno en Firestore:', error);
    }
  }
}
