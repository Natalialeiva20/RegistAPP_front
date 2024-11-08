import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AttendancesService } from 'src/app/utils/services/attendances.service';
import { BrowserQRCodeReader, IScannerControls } from '@zxing/browser';

@Component({
  selector: 'app-asistencias',
  templateUrl: './asistencias.page.html',
  styleUrls: ['./asistencias.page.scss'],
})
export class AsistenciasPage implements OnInit {
  @ViewChild('videoElement', { static: true }) videoElement!: ElementRef;
  qrCodeReader: BrowserQRCodeReader;
  studentId: number | null = null;
  sectionId: number | null = null;
  attendances: any[] = [];
  isScanning: boolean = false;
  scanControls: IScannerControls | null = null;
  selectedDate: string | null = null;
  filteredAttendances: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private alertController: AlertController,
    private attendancesService: AttendancesService
  ) {
    this.qrCodeReader = new BrowserQRCodeReader();
  }

  ngOnInit() {
    this.studentId = Number(localStorage.getItem('userId'));
    this.sectionId = Number(this.route.snapshot.paramMap.get('sectionId'));

    if (this.studentId && this.sectionId) {
      this.loadAttendances();
    }
  }

  async startScan() {
    try {
      const videoInputDevices = await BrowserQRCodeReader.listVideoInputDevices();
      const selectedDeviceId = videoInputDevices[0]?.deviceId || '';

      this.isScanning = true;
      this.scanControls = await this.qrCodeReader.decodeFromVideoDevice(
        selectedDeviceId,
        this.videoElement.nativeElement,
        (result, error) => {
          if (result) {
            console.log('Resultado escaneado:', result.getText());
            this.registerAttendance(result.getText());
            this.stopScan(); // Detener el escaneo después de leer un resultado
          }
          if (error) {
            console.error('Error en el escaneo:', error);
          }
        }
      );
    } catch (err) {
      console.error('Error al iniciar el escáner:', err);
      await this.showAlert('Error', 'No se pudo iniciar el escaneo de QR. Verifique los permisos de la cámara.');
    }
  }

  stopScan() {
    if (this.isScanning && this.scanControls) {
      this.scanControls.stop(); // Detiene el escaneo usando los controles del escáner
      this.isScanning = false;
      this.scanControls = null;
    }
  }

  async registerAttendance(classId: string) {
    if (this.studentId && classId) {
      this.attendancesService.registerAttendance(this.studentId, classId).subscribe(
        async (response) => {
          await this.showAlert('Éxito', response.message);
          this.loadAttendances(); // Recargar las asistencias
        },
        async (error) => {
          const errorMessage = error.status === 409
            ? 'La asistencia ya está registrada para esta clase'
            : error.status === 403
            ? 'El estudiante no está asignado a la sección de la clase'
            : 'Error al registrar la asistencia';
          await this.showAlert('Error', errorMessage);
        }
      );
    }
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  loadAttendances() {
    this.attendancesService.getAttendancesByStudentAndSection(this.studentId!, this.sectionId!).subscribe(
      (data) => {
        this.attendances = data;
      },
      (error) => {
        console.error('Error al cargar las asistencias:', error);
      }
    );
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: 'America/Santiago'
    });
  }

  formatTime(dateString: string): string {
    const date = new Date(dateString);
    
    // Restar tres horas
    date.setHours(date.getHours() - 3);
  
    return date.toLocaleTimeString('es-CL', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'America/Santiago'
    });
  }
  filterAttendancesByDate() {
    if (this.selectedDate) {
      const selectedDateFormatted = new Date(this.selectedDate).toISOString().split('T')[0]; // Formato yyyy-MM-dd
      this.filteredAttendances = this.attendances.filter(attendance => {
        const attendanceDate = new Date(attendance.fecha_clase).toISOString().split('T')[0];
        return attendanceDate === selectedDateFormatted;
      });
    } else {
      this.filteredAttendances = this.attendances; // Restablecer al original si no hay fecha seleccionada
    }
  }
  
}