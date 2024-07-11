import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { TurnosService } from '../../services/turnos.service';
import { Turno } from '../../classes/turno';
import { Subscription } from 'rxjs';
import { LogsService } from '../../services/logs.service';
import { CommonModule } from '@angular/common';
import * as XLSX from 'xlsx'; // Biblioteca de excel
import { saveAs } from 'file-saver'; // Funciones para guardar archivos
import { HighlightDirective } from '../../directives/highlight.directive';

@Component({
  selector: 'app-graficos',
  standalone: true,
  templateUrl: './graficos.component.html',
  styleUrls: ['./graficos.component.css'],
  imports: [CommonModule, HighlightDirective],
})
export class GraficosComponent implements OnInit, OnDestroy {
  private turnosSubscription: Subscription = new Subscription();
  private logsSubscription: Subscription = new Subscription();
  logs: string[] = [];
  graficoUno: any = '';
  graficoDos: any = '';
  graficoTres: any = '';
  graficoCuatro: any = '';
  @ViewChild('cuerpoLogs') cuerpoLogs!: ElementRef;

  constructor(private turnosService: TurnosService, private logsService: LogsService) {}

  ngOnInit(): void {
    this.turnosSubscription = this.turnosService.turnos$.subscribe(turnos => {
      this.destruirGraficos();
      this.crearGraficos(turnos);
    });
    this.logsSubscription = this.logsService.logs$.subscribe(logs => {
      this.logs = logs;
      this.scrollToBottom();
    });
  }

  ngOnDestroy(): void {
    this.destruirGraficos();
    this.turnosSubscription.unsubscribe();
    this.logsSubscription.unsubscribe();
  }

  private crearGraficos(turnos: Turno[]): void {
    this.destruirGraficos();
    this.crearGraficoUno(turnos);
    this.crearGraficoDos(turnos);
    this.crearGraficoTres(turnos);
    this.crearGraficoCuatro(turnos);
  }

  private crearGraficoUno(turnos: Turno[]): void {
    const especialidades = turnos.map(turno => turno.especialidad);
    const contadorEspecialidades = especialidades.reduce((counts, especialidad) => {
      counts[especialidad] = (counts[especialidad] || 0) + 1;
      return counts;
    }, {} as { [key: string]: number });

    const ctx = document.getElementById('graficoUno') as HTMLCanvasElement;
    this.graficoUno = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: Object.keys(contadorEspecialidades),
        datasets: [
          {
            label: 'Cantidad de turnos',
            data: Object.values(contadorEspecialidades),
            backgroundColor: [
              'rgba(255, 0, 0, 0.6)',
              'rgba(0, 128, 0, 0.6)',
              'rgba(0, 0, 255, 0.6)',
              'rgba(255, 165, 0, 0.6)',
              'rgba(255, 255, 0, 0.6)',
              'rgba(128, 0, 128, 0.6)',
              'rgba(75, 0, 130, 0.6)',
              'rgba(0, 255, 255, 0.6)',
            ],
            borderColor: [
              'rgba(255, 0, 0, 1)',
              'rgba(0, 128, 0, 1)',
              'rgba(0, 0, 255, 1)',
              'rgba(255, 165, 0, 1)',
              'rgba(255, 255, 0, 1)',
              'rgba(128, 0, 128, 1)',
              'rgba(75, 0, 130, 1)',
              'rgba(0, 255, 255, 1)',
            ],
            borderWidth: 1,
          },
        ],
      }
    });
  }

  private crearGraficoDos(turnos: Turno[]): void {
    const dias = turnos.map(turno => turno.fecha.dia);
    const contadorDias = dias.reduce((counts, dia) => {
      counts[dia] = (counts[dia] || 0) + 1;
      return counts;
    }, {} as { [key: string]: number });

    const ctx = document.getElementById('graficoDos') as HTMLCanvasElement;
    this.graficoDos = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: Object.keys(contadorDias),
        datasets: [
          {
            label: 'Cantidad de turnos',
            data: Object.values(contadorDias),
            backgroundColor: [
              'rgba(255, 0, 0, 0.6)',
              'rgba(0, 128, 0, 0.6)',
              'rgba(0, 0, 255, 0.6)',
              'rgba(255, 165, 0, 0.6)',
              'rgba(255, 255, 0, 0.6)',
              'rgba(128, 0, 128, 0.6)',
              'rgba(75, 0, 130, 0.6)',
              'rgba(0, 255, 255, 0.6)',
            ],
            borderColor: [
              'rgba(255, 0, 0, 1)',
              'rgba(0, 128, 0, 1)',
              'rgba(0, 0, 255, 1)',
              'rgba(255, 165, 0, 1)',
              'rgba(255, 255, 0, 1)',
              'rgba(128, 0, 128, 1)',
              'rgba(75, 0, 130, 1)',
              'rgba(0, 255, 255, 1)',
            ],
            borderWidth: 1,
          },
        ],
      }
    });
  }
  
  private crearGraficoTres(turnos: Turno[]): void {
    const hoy = new Date();
    const hace7Dias = new Date(hoy);
    hace7Dias.setDate(hoy.getDate() - 7);
  
    const turnosUltimos7Dias = turnos.filter(turno => {
      const [dia, mes, anio] = turno.fecha.dia.split(' de ');
      const fechaTurno = new Date(`${hoy.getFullYear()}-${this.getMesNumero(mes)}-${dia}`);
  
      return fechaTurno >= hace7Dias && fechaTurno <= hoy;
    });
  
    const especialistas = turnosUltimos7Dias.map(turno => turno.apellidoEspecialista);
    const contadorEspecialistas = especialistas.reduce((counts, especialista) => {
      counts[especialista] = (counts[especialista] || 0) + 1;
      return counts;
    }, {} as { [key: string]: number });
  
    const ctx = document.getElementById('graficoTres') as HTMLCanvasElement;
    this.graficoTres = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: Object.keys(contadorEspecialistas),
        datasets: [
          {
            label: 'Cantidad de turnos',
            data: Object.values(contadorEspecialistas),
            backgroundColor: [
              'rgba(255, 0, 0, 0.6)',
              'rgba(0, 128, 0, 0.6)',
              'rgba(0, 0, 255, 0.6)',
              'rgba(255, 165, 0, 0.6)',
              'rgba(255, 255, 0, 0.6)',
              'rgba(128, 0, 128, 0.6)',
              'rgba(75, 0, 130, 0.6)',
              'rgba(0, 255, 255, 0.6)',
            ],
            borderColor: [
              'rgba(255, 0, 0, 1)',
              'rgba(0, 128, 0, 1)',
              'rgba(0, 0, 255, 1)',
              'rgba(255, 165, 0, 1)',
              'rgba(255, 255, 0, 1)',
              'rgba(128, 0, 128, 1)',
              'rgba(75, 0, 130, 1)',
              'rgba(0, 255, 255, 1)',
            ],
            borderWidth: 1,
          },
        ],
      }
    });
  }

  private crearGraficoCuatro(turnos: Turno[]): void {
    const hoy = new Date();
    const hace7Dias = new Date(hoy);
    hace7Dias.setDate(hoy.getDate() - 7);
  
    const turnosUltimos7Dias = turnos.filter(turno => {
      if (turno.estado !== 'Realizado') {
        return false;
      }

      const [dia, mes, anio] = turno.fecha.dia.split(' de ');
      const fechaTurno = new Date(`${hoy.getFullYear()}-${this.getMesNumero(mes)}-${dia}`);
  
      return fechaTurno >= hace7Dias && fechaTurno <= hoy;
    });
  
    const especialistas = turnosUltimos7Dias.map(turno => turno.apellidoEspecialista);
    const contadorEspecialistas = especialistas.reduce((counts, especialista) => {
      counts[especialista] = (counts[especialista] || 0) + 1;
      return counts;
    }, {} as { [key: string]: number });
  
    const ctx = document.getElementById('graficoCuatro') as HTMLCanvasElement;
    this.graficoCuatro = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: Object.keys(contadorEspecialistas),
        datasets: [
          {
            label: 'Cantidad de turnos',
            data: Object.values(contadorEspecialistas),
            backgroundColor: [
              'rgba(255, 0, 0, 0.6)',
              'rgba(0, 128, 0, 0.6)',
              'rgba(0, 0, 255, 0.6)',
              'rgba(255, 165, 0, 0.6)',
              'rgba(255, 255, 0, 0.6)',
              'rgba(128, 0, 128, 0.6)',
              'rgba(75, 0, 130, 0.6)',
              'rgba(0, 255, 255, 0.6)',
            ],
            borderColor: [
              'rgba(255, 0, 0, 1)',
              'rgba(0, 128, 0, 1)',
              'rgba(0, 0, 255, 1)',
              'rgba(255, 165, 0, 1)',
              'rgba(255, 255, 0, 1)',
              'rgba(128, 0, 128, 1)',
              'rgba(75, 0, 130, 1)',
              'rgba(0, 255, 255, 1)',
            ],
            borderWidth: 1,
          },
        ],
      }
    });
  }

  private getMesNumero(mes: string): string {
    const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
       'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    return String(meses.indexOf(mes) + 1).padStart(2, '0');
  }
  
  destruirGraficos() {
    if (this.graficoUno) {
      this.graficoUno.destroy();
      this.graficoUno = null;
    }
    if (this.graficoDos) {
      this.graficoDos.destroy();
      this.graficoDos = null;
    }
    if (this.graficoTres) {
      this.graficoTres.destroy();
      this.graficoTres = null;
    }
    if (this.graficoCuatro) {
      this.graficoCuatro.destroy();
      this.graficoCuatro = null;
    }
  }

  // Función que manda el scroll hacia lo más bajo
  private scrollToBottom(): void {
    setTimeout(() => {
      if (this.cuerpoLogs) {
        this.cuerpoLogs.nativeElement.scrollTop = this.cuerpoLogs.nativeElement.scrollHeight;
      }
    }, 0);
  }

  descargarGraficoUno(): void {
    const especialidades = this.graficoUno.data.labels as string[];
    const cantidades = this.graficoUno.data.datasets[0].data as number[];

    const worksheet = XLSX.utils.json_to_sheet(especialidades.map((especialidad, index) => ({
      Especialidad: especialidad,
      Cantidad: cantidades[index]
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'Grafico_Uno.xlsx');
  }

  descargarGraficoDos(): void {
    const dias = this.graficoDos.data.labels as string[];
    const cantidades = this.graficoDos.data.datasets[0].data as number[];

    const worksheet = XLSX.utils.json_to_sheet(dias.map((dia, index) => ({
      Dia: dia,
      Cantidad: cantidades[index]
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'Grafico_Dos.xlsx');
  }

  descargarGraficoTres(): void {
    const especialistas = this.graficoTres.data.labels as string[];
    const cantidades = this.graficoTres.data.datasets[0].data as number[];

    const worksheet = XLSX.utils.json_to_sheet(especialistas.map((especialista, index) => ({
      Especialista: especialista,
      Cantidad: cantidades[index]
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'Grafico_Tres.xlsx');
  }

  descargarGraficoCuatro(): void {
    const especialistas = this.graficoCuatro.data.labels as string[];
    const cantidades = this.graficoCuatro.data.datasets[0].data as number[];

    const worksheet = XLSX.utils.json_to_sheet(especialistas.map((especialista, index) => ({
      Especialista: especialista,
      Cantidad: cantidades[index]
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'Grafico_Cuatro.xlsx');
  }

  descargarTodosLosGraficos(): void {
    const workbook = XLSX.utils.book_new();

    const agregarHoja = (nombre: string, datos: any[]) => {
      const worksheet = XLSX.utils.json_to_sheet(datos);
      XLSX.utils.book_append_sheet(workbook, worksheet, nombre);
    };

    agregarHoja('GraficoUno', this.graficoUno.data.labels.map((especialidad: any, index: string | number) => ({
      Especialidad: especialidad,
      Cantidad: this.graficoUno.data.datasets[0].data[index]
    })));

    agregarHoja('GraficoDos', this.graficoDos.data.labels.map((dia: any, index: string | number) => ({
      Dia: dia,
      Cantidad: this.graficoDos.data.datasets[0].data[index]
    })));

    agregarHoja('GraficoTres', this.graficoTres.data.labels.map((especialista: any, index: string | number) => ({
      Especialista: especialista,
      Cantidad: this.graficoTres.data.datasets[0].data[index]
    })));

    agregarHoja('GraficoCuatro', this.graficoCuatro.data.labels.map((especialista: any, index: string | number) => ({
      Especialista: especialista,
      Cantidad: this.graficoCuatro.data.datasets[0].data[index]
    })));

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'Todos_Los_Graficos.xlsx');
  }
}